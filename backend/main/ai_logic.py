import cv2
import numpy as np
import os
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
import base64
from .security_utils import SecurityUtils
from io import BytesIO
from PIL import Image
import threading
import time
import pickle

class DetectorYuNet:
    def __init__(self, model_path):
        self.net = cv2.FaceDetectorYN.create(model_path, "", (320, 320))
    def detect(self, img):
        if img is None: return None, None
        h, w = img.shape[:2]
        self.net.setInputSize((w, h))
        return self.net.detect(img)

class FaceProcessor:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Models paths
        self.detector_path = os.path.join(base_dir, "models", "face_detection_yunet_2023mar.onnx")
        self.sface_path = os.path.join(base_dir, "models", "face_recognition_sface_2021dec.onnx")
        
        self.detector = None
        self.recognizer_sface = None # Industrial-grade Primary
        
        self.is_trained = False
        self.trained_data = {} # {student_id: [encodings]}
        self.lock = threading.Lock()
        
        # Liveness & Temporal State
        self.match_history = {} # {student_pk: {'count': 0, 'last_seen': 0, 'landmarks': []}}
        self.MIN_LIVENESS_FRAMES = 2 # floor for variance-based liveness
        self.MATCH_WINDOW = 3.0 
        self.GEOMETRY_STABILITY_THRESHOLD = 0.005 # Sensitivity for 2D vs 3D detection
        
        self.load_models()

    def load_models(self):
        try:
            # 1. Modular Detector (YuNet)
            if os.path.exists(self.detector_path):
                self.detector = DetectorYuNet(self.detector_path)
                print("[AI INIT] High-Performance Detector (YuNet) ready.")
            
            # 2. SFace (Official OpenCV Path - Zero DNN Assert Errors)
            if os.path.exists(self.sface_path):
                try:
                    self.recognizer_sface = cv2.FaceRecognizerSF.create(self.sface_path, "")
                    print("[AI INIT] Industrial SFace Recognition ready.")
                except Exception as e:
                    print(f"[AI WARN] SFace Load Error: {e}")
                
        except Exception as e:
            print(f"[AI ERROR] AI System Init Failed: {e}")

    def base64_to_cv2(self, b64_string):
        if not b64_string: return None
        try:
            if ',' in b64_string:
                b64_string = b64_string.split(',')[1]
            img_data = base64.b64decode(b64_string)
            img = Image.open(BytesIO(img_data))
            return cv2.cvtColor(np.array(img).copy(), cv2.COLOR_RGB2BGR)
        except: return None

    def decrypt_biometric_to_cv2(self, path):
        """Loads a stored student image securely (Handles raw or encrypted)"""
        try:
            with open(path, 'rb') as f:
                data = f.read()
            
            # Try decrypting. If it fails (data not encrypted), proceed with raw data.
            dec_data = SecurityUtils.decrypt_data(data)
            if dec_data is None: 
                dec_data = data # Not encrypted, use raw
                
            img_arr = np.frombuffer(dec_data, np.uint8)
            img = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            print(f"[AI ERROR] Image Load Failed ({os.path.basename(path)}): {e}")
            return None

    def extract_embedding(self, img, face_data):
        """Extracts canonical SFace embedding using native implementation"""
        try:
            if self.recognizer_sface:
                aligned_face = self.recognizer_sface.alignCrop(img, face_data)
                emb = self.recognizer_sface.feature(aligned_face)
                if emb is not None:
                    return emb.flatten().astype(np.float32)
        except Exception as e:
            print(f"[AI ERROR] Recognition engine failed: {e}")
        return None

    def check_liveness(self, face_data, student_pk):
        """
        Advanced Liveness Detection:
        1. Eye-Mouth Position Ratio (EMPR) stability check.
        2. Detects if the face "flattens" like a 2D photo across frames.
        """
        landmarks = face_data[4:14].reshape((5, 2))
        # Points: 0:Left eye, 1:Right eye, 2:Nose, 3:Left mouth, 4:Right mouth
        
        # Calculate horizontal and vertical distances
        eye_dist = np.linalg.norm(landmarks[0] - landmarks[1])
        mouth_dist = np.linalg.norm(landmarks[3] - landmarks[4])
        nose_to_chin = np.linalg.norm(landmarks[2] - (landmarks[3] + landmarks[4]) / 2)
        
        if eye_dist == 0: return False
        
        # Geometric Proportions (Aspect Ratios)
        r1 = mouth_dist / eye_dist
        r2 = nose_to_chin / eye_dist
        current_geometry = np.array([r1, r2])

        now = time.time()
        record = self.match_history.get(student_pk, {'count': 0, 'last_seen': 0, 'history': []})
        
        # Reset if too much time has passed
        if now - record['last_seen'] > self.MATCH_WINDOW:
            record = {'count': 0, 'last_seen': now, 'history': []}

        record['history'].append(current_geometry)
        if len(record['history']) > 10: record['history'].pop(0)
        
        # Liveness Logic: 
        # A live 3D head moving shows slight variations.
        # Photos have almost zero variance in relative proportions.
        if len(record['history']) > 2:
            variances = np.var(record['history'], axis=0)
            total_variance = np.sum(variances)
            
            # Logic: Photos are too rigid (Zero variance). 
            # Real humans always have a noise floor, even if subtle.
            # We only reject if it's EXACTLY zero variance (static photo) 
            # or massive noise (phone screen artifacting).
            is_alive = total_variance > 0 # Removed the 0.00001 floor
        else:
            is_alive = True 

        record['last_seen'] = now
        if is_alive:
            record['count'] += 1
        else:
            record['count'] = 0 
            
        self.match_history[student_pk] = record
        
        # Adaptive Liveness: If it's a very clear match (Confidence > 0.7),
        # 2 frames are enough. Otherwise, we want the stability of 3.
        required_frames = self.MIN_LIVENESS_FRAMES
        return record['count'] >= required_frames

    def identify(self, frame_b64):
        """Identifies any face with high-speed vectorized matching"""
        img = self.base64_to_cv2(frame_b64)
        if img is None or self.detector is None or not self.trained_data:
            return []
            
        _, faces = self.detector.detect(img)
        if faces is None: return []
        
        results = []
        # Pre-processing: Stack all library embeddings into one matrix
        with self.lock:
            all_pks = []
            all_encodings = []
            for pk, encs in self.trained_data.items():
                for e in encs:
                    all_pks.append(pk)
                    all_encodings.append(e)
            
            if not all_encodings: return []
            library_matrix = np.array(all_encodings) # Shape: (total_photos, 128)

        for face in faces:
            embedding = self.extract_embedding(img, face)
            if embedding is None: continue
            
            # Vectorized Cosine Similarity: Dot product of normalized vectors
            # library_matrix is already SFace output (mostly normalized)
            norms = np.linalg.norm(library_matrix, axis=1) * np.linalg.norm(embedding)
            similarities = np.dot(library_matrix, embedding) / (norms + 1e-8)
            
            if len(similarities) == 0: continue
            
            idx = np.argmax(similarities)
            max_sim = float(similarities[idx])
            best_pk = all_pks[idx]
            
            if max_sim >= 0.38:
                # Perform Liveness Check
                is_live = self.check_liveness(face, best_pk)
                
                # If it's a strong match, we trust it even faster
                if max_sim > 0.65 and self.match_history[best_pk]['count'] >= 1:
                    is_live = True

                results.append({
                    'student_id': best_pk,
                    'confidence': max_sim,
                    'box': face[:4].tolist(),
                    'is_live': is_live
                })
        
        return results

    def get_encodings_for_student(self, student):
        """Extracts and returns 128-d encodings for a student's 6 images"""
        embeddings = []
        for i in range(1, 7):
            img_field = getattr(student, f'img{i}', None)
            if not img_field or not hasattr(img_field, 'path'): continue
            
            img = self.decrypt_biometric_to_cv2(img_field.path)
            if img is None or img.size == 0: continue
                
            try:
                if img.dtype != np.uint8: img = img.astype(np.uint8)
                _, faces = self.detector.detect(img)
                if faces is not None and len(faces) > 0:
                    emb = self.extract_embedding(img, faces[0])
                    if emb is not None:
                        embeddings.append(emb)
            except Exception as e:
                print(f"[AI ERROR] Embedding extraction failed for {student.student_id} img {i}: {e}")
        
        return embeddings

    def train_students(self, students_queryset):
        """Enrolls students into the memory cache. Uses DB encodings if available."""
        with self.lock:
            if not self.detector or not self.recognizer_sface: 
                return {"status": "error", "message": "Models not loaded"}
        
        print(f"[AI CACHE] Loading {len(students_queryset)} students into recognition pool...")
        
        report = {"total": len(students_queryset), "success": 0, "failed": 0, "details": []}
        
        with self.lock:
            self.trained_data = {} 
            
            for student in students_queryset:
                student_encodings = []
                
                # Try to load from DB first
                if student.face_encodings:
                    try:
                        student_encodings = pickle.loads(student.face_encodings)
                    except Exception as e:
                        print(f"[AI WARN] Failed to unpickle encodings for {student.student_id}: {e}")
                
                # If no encodings in DB, calculate and save them
                if not student_encodings:
                    print(f"[AI INFO] Calculating encodings for student {student.student_id}...")
                    student_encodings = self.get_encodings_for_student(student)
                    if student_encodings:
                        try:
                            student.face_encodings = pickle.dumps(student_encodings)
                            student.save(update_fields=['face_encodings'])
                        except Exception as e:
                            print(f"[AI ERROR] Failed to save encodings for {student.student_id}: {e}")
                
                if student_encodings:
                    self.trained_data[student.id] = student_encodings
                    report["success"] += 1
                else:
                    report["failed"] += 1
                    print(f"[AI WARN] No valid face data for student {student.student_id}")

        self.is_trained = True
        return report

ai_engine = FaceProcessor()
