from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.db import models
from django.utils import timezone
from .models import Teacher, Student, AttendanceSession, AttendanceRecord
from .serializers import StudentSerializer, TeacherSerializer, AttendanceSessionSerializer, AttendanceRecordSerializer
from .ai_logic import ai_engine
from rest_framework_simplejwt.tokens import RefreshToken

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['login_user', 'register_teacher']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        qs = Teacher.objects.all()
        if self.action == 'list':
            qs = qs.filter(user__is_superuser=False)
        return qs
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        # Determine Context: Global (Admin) vs Local (Teacher)
        is_admin = request.user.is_superuser
        teacher_profile = getattr(request.user, 'teacher_profile', None)
        
        # Ensure Admin has a profile to store global settings (against the user)
        if is_admin and not teacher_profile:
            teacher_profile, _ = Teacher.objects.get_or_create(
                user=request.user,
                defaults={'department': 'Administration'}
            )

        # Base Filtering
        student_filter = {} if is_admin else {'created_by': teacher_profile}
        record_filter = {} if is_admin else {'student__created_by': teacher_profile}

        # Safe Auto-Linking: If there are orphaned students, link them to the current user
        # This fixes students created during the bug period.
        if teacher_profile:
             orphans = Student.objects.filter(created_by__isnull=True)
             if orphans.exists():
                 orphans.update(created_by=teacher_profile)
        
        today = timezone.now().date()
        total_students = Student.objects.filter(**student_filter).count()
        
        # Check if any session actually started today
        session_started_today = AttendanceSession.objects.filter(
            date=today,
            session_started=True,
            **({'teacher': teacher_profile} if not is_admin else {})
        ).exists()
        
        # Get UNIQUE students marked present today (across all sessions)
        present_students_today = AttendanceRecord.objects.filter(
            session__date=today, 
            status='Present',
            **record_filter
        ).values_list('student_id', flat=True).distinct()
        
        present_today = len(present_students_today)
        
        # Count actual unique absent records for today
        absent_today = AttendanceRecord.objects.filter(
            session__date=today, 
            status='Absent',
            **record_filter
        ).count()
        
        late_today = AttendanceRecord.objects.filter(
            session__date=today, 
            is_late=True,
            **record_filter
        ).count()
        
        # Avg analytics
        records_qs = AttendanceRecord.objects.filter(**record_filter)
        total_records = records_qs.count()
        avg_confidence = records_qs.aggregate(models.Avg('confidence_score'))['confidence_score__avg'] or 0
        total_presents = records_qs.filter(status='Present').count()
        avg_attendance = (total_presents / total_records * 100) if total_records > 0 else 0
        
        # Intensity Matrix (last 7 days)
        intensity_matrix = []
        for i in range(6, -1, -1):
            date = today - timezone.timedelta(days=i)
            count = AttendanceRecord.objects.filter(
                session__date=date, 
                status='Present',
                **record_filter
            ).count()
            intensity_matrix.append({
                'day': date.strftime('%a'),
                'count': count
            })
        
        # Robust Time Serialization
        s_time = "09:00"
        o_time = "17:00"
        if teacher_profile:
            if teacher_profile.default_start_time:
                s_time = teacher_profile.default_start_time.strftime('%H:%M')
            if teacher_profile.default_off_time:
                o_time = teacher_profile.default_off_time.strftime('%H:%M')

        return Response({
            'total_students': total_students,
            'present_today': present_today,
            'avg_attendance': round(avg_attendance, 1),
            'absent_today': max(0, absent_today),
            'late_today': late_today,
            'avg_confidence': round(avg_confidence, 1),
            'intensity_matrix': intensity_matrix,
            'scope': 'Global (Admin)' if is_admin else 'Class-Specific',
            'defaults': {
                'start_time': s_time,
                'off_time': o_time
            }
        })

    @action(detail=False, methods=['post'])
    def login_user(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')
        
        # Try to authenticate with username first, then email
        user = authenticate(username=username_or_email, password=password)
        
        # If auth fails and input looks like email, try using it as username
        if not user and '@' in username_or_email:
            user = authenticate(username=username_or_email, password=password)
        
        if not user:
            print(f"[DEBUG] Authentication failed for: {username_or_email}")
            return Response({'status': 'error', 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        profile_id = None
        role = None
        department = ''
        student_id = ''
        
        try:
            # Check if user is admin/superuser
            if user.is_superuser:
                print(f"[DEBUG] Admin user {username_or_email} logging in")
                # Create teacher profile for admin if it doesn't exist
                teacher, created = Teacher.objects.get_or_create(
                    user=user,
                    defaults={'department': 'Administration'}
                )
                role = 'teacher'
                profile_id = teacher.id
                department = teacher.department
                print(f"[DEBUG] Admin teacher profile: {profile_id}, created={created}")
                
            # Check for teacher profile
            else:
                try:
                    teacher_profile = user.teacher_profile
                    if not teacher_profile.active:
                        print(f"[DEBUG] Teacher account {username_or_email} is deactivated")
                        return Response({'status': 'error', 'message': 'Teacher account deactivated. Please contact administration.'}, status=status.HTTP_403_FORBIDDEN)
                    role = 'teacher'
                    profile_id = teacher_profile.id
                    department = teacher_profile.department
                    print(f"[DEBUG] Teacher user {username_or_email} logged in, profile_id={profile_id}")
                except Teacher.DoesNotExist:
                    # Check for student profile
                    try:
                        student_profile = user.student_profile
                        if not student_profile.is_active:
                            print(f"[DEBUG] Student account {username_or_email} is deactivated")
                            return Response({'status': 'error', 'message': 'Account Deactivated. Please contact administration.'}, status=status.HTTP_403_FORBIDDEN)
                        role = 'student'
                        profile_id = student_profile.id
                        student_id = student_profile.student_id
                        print(f"[DEBUG] Student user {username_or_email} logged in, profile_id={profile_id}")
                    except Student.DoesNotExist:
                        print(f"[DEBUG] User {username_or_email} has no teacher or student profile")
                        return Response({'status': 'error', 'message': 'Invalid user profile. Please contact administration.'}, status=status.HTTP_401_UNAUTHORIZED)
            
            email = user.email
            
            # Generate JWT Tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'status': 'success',
                'role': role,
                'user_id': user.id,
                'profile_id': profile_id,
                'student_id': student_id,
                'name': user.get_full_name() or user.username,
                'email': email,
                'department': department,
                'is_superuser': user.is_superuser,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        except Exception as e:
            print(f"[ERROR] Login error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'status': 'error', 'message': 'Login failed. Please try again.'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=True, methods=['patch'], url_path='update-profile')
    def update_profile(self, request, pk=None):
        try:
            teacher = self.get_object()
            data = request.data
            
            # Debug logging
            print(f"[DEBUG] Update profile request data keys: {list(data.keys())}")
            if 'password' in data:
                print(f"[DEBUG] Password field found: {bool(data['password'])}")
            
            # Update User fields
            user = teacher.user
            if 'email' in data:
                user.email = data['email']
                user.username = data['email']
            if 'first_name' in data:
                user.first_name = data['first_name']
            if 'last_name' in data:
                user.last_name = data['last_name']
            
            # Handle password update
            if 'password' in data and data['password']:
                password = str(data['password']).strip()
                if password:
                    print(f"[DEBUG] Setting password for user: {user.username}")
                    user.set_password(password)
            
            user.save()
            print(f"[DEBUG] User saved successfully: {user.username}")
            
            # Update Teacher fields
            if 'department' in data:
                teacher.department = data['department']
            
            # Update default times
            if 'default_start_time' in data:
                teacher.default_start_time = data['default_start_time']
            if 'default_off_time' in data:
                teacher.default_off_time = data['default_off_time']
            
            if 'profile_pic' in request.FILES:
                teacher.profile_pic = request.FILES['profile_pic']
                
            teacher.save()
            print(f"[DEBUG] Teacher profile saved successfully")
            return Response({'status': 'success', 'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"[ERROR] Profile update failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='change-password')
    def change_password(self, request, pk=None):
        """Dedicated endpoint for changing password"""
        try:
            teacher = self.get_object()
            user = teacher.user
            new_password = request.data.get('new_password', '').strip()
            
            if not new_password:
                return Response({'error': 'Password cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
            
            print(f"[DEBUG] Changing password for user: {user.username}")
            user.set_password(new_password)
            user.save()
            print(f"[DEBUG] Password changed successfully for user: {user.username}")
            
            return Response({'status': 'success', 'message': 'Password changed successfully'})
        except Exception as e:
            print(f"[ERROR] Password change failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def register_teacher(self, request):
        data = request.data
        try:
            # Create standard User
            user = User.objects.create_user(
                username=data.get('email'),
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name')
            )
            
            # Create Teacher Profile - set active=True for self-registered teachers
            teacher = Teacher.objects.create(
                user=user,
                department=data.get('department', 'General'),
                active=True  # Self-registered teachers are active by default
            )
            
            print(f"[DEBUG] New teacher registered: {user.email}, active={teacher.active}")
            return Response(TeacherSerializer(teacher).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"[ERROR] Teacher registration failed: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_GATEWAY)

    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        if not request.user.is_superuser:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        teacher = self.get_object()
        teacher.active = not teacher.active
        teacher.save()
        return Response({
            'status': 'success',
            'active': teacher.active,
            'message': f'Teacher {"activated" if teacher.active else "deactivated"} successfully'
        })

    @action(detail=False, methods=['post'], url_path='clear-records')
    def clear_records(self, request):
        """
        Admin-only endpoint to clear all attendance sessions and records from the database.
        """
        if not request.user.is_superuser:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # Get counts before deletion
            session_count = AttendanceSession.objects.count()
            record_count = AttendanceRecord.objects.count()
            
            # Delete all records first (due to foreign key constraints)
            AttendanceRecord.objects.all().delete()
            AttendanceSession.objects.all().delete()
            
            return Response({
                'status': 'success',
                'message': f'Successfully cleared {record_count} attendance records and {session_count} sessions from the database.'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Failed to clear records: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='create-student')
    def create_student(self, request):
        # Teacher creates student with assigned ID/Pass
        data = request.data
        try:
            # Create standard User
            user = User.objects.create_user(
                username=data.get('username'),
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name')
            )
            
            # Create Student Profile
            student = Student.objects.create(
                user=user,
                student_id=data.get('student_id'),
                created_by=request.user.teacher_profile if hasattr(request.user, 'teacher_profile') else None
            )
            
            # Save face images (up to 10)
            images = request.FILES.getlist('images')
            if len(images) > 0:
                for i in range(min(len(images), 10)):
                    setattr(student, f'img{i+1}', images[i])
                student.save()
                
            # Proactively calculate and save face encodings
            try:
                import pickle
                encodings = ai_engine.get_encodings_for_student(student)
                if encodings:
                    student.face_encodings = pickle.dumps(encodings)
                    student.save(update_fields=['face_encodings'])
            except Exception as e:
                 print(f"ERROR: Proactive encoding calculation failed: {e}")
                
            return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_GATEWAY)

    @action(detail=False, methods=['post'])
    def train_ai(self, request):
        students = Student.objects.filter(is_active=True)
        report = ai_engine.train_students(students)
        return Response({
            'status': 'success',
            'message': 'AI Hybrid Model training completed.',
            'report': report
        })

class StudentViewSet(viewsets.ModelViewSet):
    # queryset = Student.objects.all().order_by('-id')
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Student.objects.all().order_by('-id')
        
        # If user is a teacher, only show students they created
        if hasattr(user, 'teacher_profile'):
            return Student.objects.filter(created_by=user.teacher_profile).order_by('-id')
        
        # If user is a student, they can only see their own profile
        if hasattr(user, 'student_profile'):
            return Student.objects.filter(id=user.student_profile.id)
            
        return Student.objects.none()
    
    @action(detail=True, methods=['patch'], url_path='update-profile')
    @action(detail=True, methods=['patch'], url_path='update-profile')
    def update_profile(self, request, pk=None):

        try:
            student = self.get_object()
            data = request.data
            
            # 1. Handle User Email Update
            if 'email' in data:
                student.user.email = data['email']
                student.user.save()
                
            # 3. Handle Profile Pic & Standard Fields
            serializer = self.get_serializer(student, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            print(f"Serializer Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # import traceback
            # traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, *args, **kwargs):
        student = self.get_object()
        data = request.data
        
        # Handle Name update (split into first/last)
        if 'name' in data:
            name_parts = data['name'].split(' ')
            student.user.first_name = name_parts[0]
            student.user.last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
            student.user.save()
            
        # Handle Student ID update
        if 'student_id' in data:
            student.student_id = data['student_id']
            
        # Handle other fields
        if 'address' in data:
            student.address = data['address']
        if 'phone_number' in data:
            student.phone_number = data['phone_number']
        
        # Handle email update
        if 'email' in data:
            student.user.email = data['email']
            student.user.save()
            
        student.save()
        return Response(StudentSerializer(student).data)

    def perform_destroy(self, instance):
        # Delete associated User record specifically
        user = instance.user
        instance.delete()
        user.delete()

    @action(detail=True, methods=['post'], url_path='toggle-status')
    def toggle_status(self, request, pk=None):
        """Toggle student active/inactive status"""
        student = self.get_object()
        student.is_active = not student.is_active
        student.save()
        return Response({
            'status': 'success',
            'is_active': student.is_active,
            'message': f'Student {"activated" if student.is_active else "deactivated"} successfully'
        })

class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all().order_by('-date', '-id')
    serializer_class = AttendanceSessionSerializer

    @action(detail=False, methods=['post'])
    def test_connection(self, request):
        """Test if camera stream URL is accessible"""
        camera_url = request.data.get('camera_url')
        camera_port = request.data.get('camera_port')
        
        if not camera_url:
            return Response({'connected': False, 'error': 'No camera URL provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            import cv2
            # Construct the full URL with port if provided
            full_url = camera_url
            if camera_port:
                # If URL doesn't contain port, append it
                if ':' not in camera_url.split('/')[-1]:  # Check if there's no port in the URL
                    full_url = f"{camera_url}:{camera_port}"
            
            # Try to open the camera stream with a short timeout
            cap = cv2.VideoCapture(full_url)
            
            # Set timeout properties
            cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, 3000)
            cap.set(cv2.CAP_PROP_READ_TIMEOUT_MSEC, 3000)
            
            # Try to read one frame
            ret, frame = cap.read()
            cap.release()
            
            if ret and frame is not None:
                print(f"✓ Camera Connection Successful: {full_url}")
                return Response({'connected': True, 'message': 'Camera stream is accessible'})
            else:
                print(f"✗ Camera Failed to read frame: {full_url}")
                return Response({'connected': False, 'error': 'Could not read from stream'})
        except Exception as e:
            print(f"✗ Camera Connection Error: {str(e)}")
            return Response({'connected': False, 'error': str(e)})

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        session = self.get_object()
        was_active = session.is_active
        session.is_active = not session.is_active
        
        # When session is started for the first time, mark session_started and timestamp it
        if session.is_active and not session.session_started:
            session.session_started = True
            session.started_at = timezone.now()
        
        # LOGIC: Mark Absents when session is ENDED
        if was_active and not session.is_active:
            print(f"[DEBUG] Session {session.id} ended. Marking missing students as Absent...")
            is_admin_session = session.teacher.user.is_superuser
            if is_admin_session:
                target_students = Student.objects.filter(is_active=True)
            else:
                target_students = Student.objects.filter(is_active=True, created_by=session.teacher)
            
            today = timezone.now().date()
            absent_count = 0
            for student in target_students:
                # Check if they already have ANY record for today (in any session)
                # User Requirement: "keep him absent no new absent entry"
                has_record = AttendanceRecord.objects.filter(
                    student=student,
                    session__date=today
                ).exists()
                
                if not has_record:
                    AttendanceRecord.objects.create(
                        session=session,
                        student=student,
                        status='Absent',
                        confidence_score=0.0
                    )
                    absent_count += 1
            print(f"[DEBUG] Marked {absent_count} students as Absent for today.")

        session.save()
        return Response({
            'status': 'Session status updated', 
            'is_active': session.is_active,
            'session_started': session.session_started,
            'started_at': session.started_at
        })

    @action(detail=True, methods=['post'])
    def process_frame(self, request, pk=None):
        """
        AI CORE LOGIC (As per Documentation):
        1. Facial Landmark & Verification (Check if real face)
        2. Deep Face Embedding Extraction (High-dimensional vector)
        3. Cosine Similarity Matching (Compare against StudentFaceImage embeddings)
        4. Time-Controlled Recognition (Only mark during session time)
        """
        session = self.get_object()
        
        # Enforce Time-Controlled Recognition & Activity
        if not session.is_active:
             return Response({'error': 'Session is currently inactive.'}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.localtime(timezone.now()).time()
        if not (session.start_time <= now <= session.off_time):
             return Response({'error': 'Face recognition is disabled outside session time.'}, status=status.HTTP_403_FORBIDDEN)
            
        # Real AI Identification (Hybrid Approach)
        frame_b64 = request.data.get('frame')
        if not frame_b64:
            return Response({'error': 'No frame data provided.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Admin Precedence Logic
        is_admin_session = session.teacher.user.is_superuser
        
        # If this is a teacher session, check if an Admin session is active
        if not is_admin_session:
            admin_session_active = AttendanceSession.objects.filter(
                teacher__user__is_superuser=True,
                is_active=True,
                date=timezone.now().date(),
                start_time__lte=now,
                off_time__gte=now
            ).exists()
            
            if admin_session_active:
                return Response({
                    'error': 'Global Admin Session is currently active. Teacher session is temporarily bypassed.',
                    'admin_precedence': True
                }, status=status.HTTP_423_LOCKED)

        # Isolated Training Pool
        if is_admin_session:
            target_students = Student.objects.filter(is_active=True)
        else:
            target_students = Student.objects.filter(is_active=True, created_by=session.teacher)

        # DEBUG: Log AI Pool status
        # print(f"DEBUG: Session Teacher: {session.teacher} (ID: {session.teacher.id}), Is Admin Session: {is_admin_session}")
        
        if target_students.count() == 0:
             print(f"WARNING: No active students found for training! Teacher: {session.teacher}")

        # Optimize: Only refresh cache if target pool size has changed or not yet trained
        # (A more robust check would compare IDs, but this is a good first-order optimization)
        current_trained_ids = getattr(ai_engine, 'trained_data', {})
        if not ai_engine.is_trained or len(current_trained_ids) != target_students.count():
            ai_engine.train_students(target_students)
            
        try:
            detections = ai_engine.identify(frame_b64)
            print(f"DEBUG: AI Recognition Raw Detections: {detections}")
            
            results = []
            for det in detections:
                student_pk = det['student_id'] # This is now the database PK
                confidence = det['confidence']
                
                is_live = det.get('is_live', False)

                if confidence >= 0.45 and is_live: # Strict Recognition & Liveness
                    try:
                        student = Student.objects.get(id=student_pk)
                        print(f"DEBUG: Authenticated: {student.user.get_full_name()}")
                        
                        # CHECK: Student already marked TODAY in ANY session
                        today = timezone.now().date()
                        existing_record = AttendanceRecord.objects.filter(
                            student=student,
                            session__date=today
                        ).first()
                        
                        if existing_record and existing_record.status == 'Present':
                            # Student already marked present today - skip to prevent duplicates
                            print(f"DEBUG: Student {student.user.get_full_name()} already marked present today. Skipping.")
                            results.append({
                                'id': student.student_id, 
                                'name': student.user.get_full_name(), 
                                'status': 'Already Marked', 
                                'message': 'Already marked present today',
                                'box': det.get('box')
                            })
                        else:
                            # Map 0.45 - 1.0 to 92% - 100% for display
                            display_confidence = min(99.9, 92 + (confidence - 0.45) * 14.5) 
                            
                            if existing_record:
                                # Update existing record (likely was 'Absent')
                                existing_record.session = session
                                existing_record.status = 'Present'
                                existing_record.confidence_score = display_confidence
                                existing_record.is_late = now > session.start_time
                                existing_record.save()
                                created = False
                            else:
                                record = AttendanceRecord.objects.create(
                                    session=session,
                                    student=student,
                                    status='Present',
                                    confidence_score=display_confidence,
                                    is_late=now > session.start_time
                                )
                                created = True
                                
                            results.append({
                                'id': student.student_id, 
                                'name': student.user.get_full_name(), 
                                'status': 'Marked', 
                                'new': created,
                                'box': det.get('box')
                            })
                    except Student.DoesNotExist:
                        results.append({'id': 'Unknown', 'status': 'Unknown', 'box': det.get('box')})
                elif confidence >= 0.45 and not is_live:
                    # Silent verification (No "Verifying" message to UI)
                    print(f"DEBUG: Recognition match found, waiting for silent liveness...")
                    results.append({
                        'id': 'Unknown', 
                        'status': 'Searching...', 
                        'box': det.get('box')
                    })
                elif 0.38 <= confidence < 0.45:
                    print(f"DEBUG: Uncertain Match: ID {student_pk} with Score {confidence}")
                    results.append({
                        'id': 'N/A', 
                        'status': 'Uncertain', 
                        'message': 'Align face',
                        'score': round(confidence, 3),
                        'box': det.get('box')
                    })
                else:
                    print(f"DEBUG: No Match (Low Score): ID {student_pk} with Score {confidence}")
                    results.append({
                        'id': 'Unknown', 
                        'status': 'No Match', 
                        'box': det.get('box')
                    })
                    
            return Response({'detections': results, 'active_monitor': True})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': 'AI processing encountered a temporary error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all().order_by('-id')
    serializer_class = AttendanceRecordSerializer
