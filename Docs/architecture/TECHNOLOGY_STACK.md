# Technology Stack

## AI-Powered Smart Attendance Management System

> **Document type:** Technology inventory and rationale  
> **Project scope:** Collaborative final-year project — BS Computer Science

---

## Table of Contents

1. [Stack Overview](#1-stack-overview)
2. [Frontend Technologies](#2-frontend-technologies)
3. [Backend Technologies](#3-backend-technologies)
4. [Computer Vision and AI](#4-computer-vision-and-ai)
5. [Database](#5-database)
6. [Security and Cryptography](#6-security-and-cryptography)
7. [Development and Configuration Tools](#7-development-and-configuration-tools)
8. [Dependency Summary](#8-dependency-summary)

---

## 1. Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT TIER                          │
│  React 18.2 · React Router 6 · Axios · SweetAlert2      │
│  HTML5 Canvas · getUserMedia API                         │
├─────────────────────────────────────────────────────────┤
│                     SERVER TIER                          │
│  Python 3.10+ · Django 5.2 · Django REST Framework 3.14  │
│  SimpleJWT · django-cors-headers                         │
├─────────────────────────────────────────────────────────┤
│                 COMPUTER VISION TIER                     │
│  OpenCV 4.8+ (YuNet ONNX · SFace ONNX)                  │
│  NumPy · Pillow · scikit-learn                           │
├─────────────────────────────────────────────────────────┤
│                    SECURITY TIER                         │
│  cryptography (Fernet AES-128-CBC + HMAC-SHA256)         │
├─────────────────────────────────────────────────────────┤
│                    STORAGE TIER                          │
│  PostgreSQL · psycopg2-binary · File System              │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Technologies

| Technology | Version | Purpose | Source |
|-----------|---------|---------|--------|
| **React** | 18.2.x | UI component library; renders dashboards, forms, and camera interfaces as a single-page application. | `package.json` |
| **React DOM** | 18.2.x | DOM rendering for React components. | `package.json` |
| **React Router DOM** | 6.22.x | Client-side routing; defines protected and public routes for teacher, student, and admin pages. | `package.json` |
| **React Scripts** | 5.0.x | Create React App toolchain; provides development server, build pipeline, and Webpack configuration. | `package.json` |
| **Axios** | 1.13.x | HTTP client for making REST API calls to the Django backend. Configured with request interceptors (JWT token injection) and response interceptors (401 handling). | `package.json`, `src/api/index.js` |
| **SweetAlert2** | 11.26.x | Modal dialog library used for confirmation prompts, success/error notifications, and interactive alerts. | `package.json` |
| **Web Vitals** | 3.5.x | Performance measurement utilities (Core Web Vitals reporting). | `package.json` |
| **AJV / AJV Keywords** | 8.18.x / 5.1.x | JSON schema validation (dev dependency, used internally by Webpack/React Scripts). | `package.json` (devDependencies) |

### Browser APIs Used

| API | Usage |
|-----|-------|
| `navigator.mediaDevices.getUserMedia()` | Opens the user's webcam for live video streaming during attendance sessions. |
| `HTMLCanvasElement` | Used for two purposes: (1) capturing video frames as Base64 JPEG for the backend, and (2) rendering bounding box overlays on detected faces. |
| `localStorage` | Stores JWT access/refresh tokens, user role, user name, and profile ID on the client side. |

---

## 3. Backend Technologies

| Technology | Version Constraint | Purpose | Source |
|-----------|-------------------|---------|--------|
| **Python** | 3.10+ | Runtime language for the backend application and AI module. | Project requirement |
| **Django** | ≥ 5.0, < 6.0 | Web framework providing ORM, middleware pipeline, admin panel, authentication backend, and WSGI application structure. | `requirements.txt` |
| **Django REST Framework (DRF)** | ≥ 3.14.0 | Toolkit for building RESTful APIs; provides serializers, viewsets, routers, permission classes, throttling, and content negotiation. | `requirements.txt` |
| **djangorestframework-simplejwt** | ≥ 5.3.0 | JWT authentication backend for DRF. Handles token generation (access + refresh), token rotation, and blacklisting. | `requirements.txt`, `settings.py` |
| **django-cors-headers** | ≥ 4.3.0 | Middleware that adds CORS (Cross-Origin Resource Sharing) headers to responses, allowing the React frontend on port 3000 to communicate with the Django backend on port 8000. | `requirements.txt`, `settings.py` |
| **python-dotenv** | ≥ 1.0.0 | Loads environment variables from a `.env` file into `os.environ` at startup. Used for database credentials, secret keys, encryption keys, and CORS origins. | `requirements.txt`, `settings.py` |

### Django Configuration Highlights

| Setting | Value | Notes |
|---------|-------|-------|
| `TIME_ZONE` | `Asia/Karachi` | Server timezone for attendance timestamp calculations. |
| `USE_TZ` | `True` | Timezone-aware datetimes stored in the database. |
| `ACCESS_TOKEN_LIFETIME` | 60 minutes | JWT access token validity. |
| `REFRESH_TOKEN_LIFETIME` | 1 day | JWT refresh token validity. |
| `ROTATE_REFRESH_TOKENS` | `True` | A new refresh token is issued on each refresh request. |
| `BLACKLIST_AFTER_ROTATION` | `True` | Old refresh tokens are blacklisted after rotation. |
| `DEFAULT_THROTTLE_RATES` (anon) | 1,000/day | Rate limit for unauthenticated requests. |
| `DEFAULT_THROTTLE_RATES` (user) | 100,000/day | Rate limit for authenticated requests. |

---

## 4. Computer Vision and AI

| Technology | Version Constraint | Purpose | Source |
|-----------|-------------------|---------|--------|
| **OpenCV (opencv-python)** | ≥ 4.8.0 | Core computer vision library. Provides face detection (`FaceDetectorYN`), face recognition (`FaceRecognizerSF`), image decoding, and color space conversion. Models are loaded and executed via OpenCV's built-in ONNX runtime — no separate ONNX Runtime installation is required. | `requirements.txt`, `ai_logic.py` |
| **NumPy** | ≥ 1.24.0, < 2.0.0 | Numerical array operations. Used for image buffer handling, embedding vector storage, vectorized cosine similarity computation, and variance calculations in the liveness check. | `requirements.txt`, `ai_logic.py` |
| **Pillow (PIL)** | ≥ 10.0.0 | Image processing library. Used to decode Base64 image payloads from the frontend into PIL Image objects before conversion to OpenCV BGR format. | `requirements.txt`, `ai_logic.py` |
| **scikit-learn** | ≥ 1.3.0 | Machine learning library. Imported for `PCA` and `cosine_similarity` utilities, though the current implementation uses a custom vectorized dot-product approach for matching instead of scikit-learn's `cosine_similarity`. | `requirements.txt`, `ai_logic.py` |

### Pre-Trained ONNX Models

| Model | File | Architecture | Input | Output |
|-------|------|-------------|-------|--------|
| **YuNet** | `face_detection_yunet_2023mar.onnx` | Lightweight CNN face detector | BGR image (dynamically sized) | Bounding boxes + 5 facial landmark coordinates per detected face |
| **SFace** | `face_recognition_sface_2021dec.onnx` | Deep CNN with hyperspherical loss | Aligned face crop (112×112) | 128-dimensional float32 embedding vector |

These are pre-trained models distributed by the OpenCV project. No custom training, fine-tuning, or transfer learning was performed for this project. The models are stored in `backend/main/models/` and loaded at application startup.

---

## 5. Database

| Technology | Version | Purpose | Source |
|-----------|---------|---------|--------|
| **PostgreSQL** | 16.x (recommended) | Relational database management system. Stores user accounts, teacher/student profiles, attendance sessions, attendance records, and pickled face embeddings. | `settings.py` |
| **psycopg2-binary** | ≥ 2.9.9 | PostgreSQL adapter for Python. Provides the database driver that Django's ORM uses to communicate with PostgreSQL. The `-binary` variant includes pre-compiled C extensions. | `requirements.txt` |

### Database Schema Summary

| Table (Django Model) | Key Fields | Notes |
|---------------------|-----------|-------|
| `auth_user` | `id`, `username`, `email`, `password`, `is_superuser` | Django's built-in User model; shared by teachers and students. |
| `main_teacher` | `user_id` (FK), `department`, `active`, `default_start_time`, `default_off_time` | One-to-one with User. `active` flag controls login access. |
| `main_student` | `user_id` (FK), `student_id` (unique), `address`, `phone_number`, `img1`–`img10`, `face_encodings`, `created_by` (FK) | `address` and `phone_number` stored as encrypted text. `face_encodings` is a `BinaryField` storing pickled NumPy arrays. |
| `main_attendancesession` | `teacher_id` (FK), `course_name`, `start_time`, `off_time`, `date`, `is_active`, `camera_source` | Each session belongs to one teacher. |
| `main_attendancerecord` | `session_id` (FK), `student_id` (FK), `check_in_time`, `status`, `is_late`, `confidence_score` | `unique_together = (session, student)`. Status is either `Present` or `Absent`. |

---

## 6. Security and Cryptography

| Technology | Version Constraint | Purpose | Source |
|-----------|-------------------|---------|--------|
| **cryptography** | ≥ 42.0.0 | Python cryptographic library. The project uses its `Fernet` class, which implements AES-128-CBC encryption with HMAC-SHA256 message authentication (authenticated encryption). | `requirements.txt`, `security_utils.py` |

### What is Protected

| Data | Protection Method | Storage Location |
|------|-------------------|-----------------|
| Student face images (`img1`–`img10`) | Fernet encryption before writing to disk | `media/face_data/` (file system) |
| Student phone numbers | Fernet encryption of the string value | `main_student.phone_number` (database) |
| Student addresses | Fernet encryption of the string value | `main_student.address` (database) |
| User passwords | Django's default PBKDF2-SHA256 hashing | `auth_user.password` (database) |
| JWT tokens | HMAC-SHA256 signed by `SECRET_KEY` | Transmitted to client; stored in `localStorage` |

### What is Not Protected (Limitations)

| Data | Current State |
|------|--------------|
| Student names, email addresses, student IDs | Stored in plaintext in the database. |
| Face embeddings (`face_encodings`) | Stored as pickled binary in the database, but not encrypted. |
| Profile pictures | Stored as unencrypted image files. |
| Encryption key | Stored as a plaintext environment variable. No rotation mechanism. |

---

## 7. Development and Configuration Tools

| Tool/File | Purpose |
|-----------|---------|
| `.env` / `.env.example` | Environment variable configuration for database credentials, secret keys, encryption keys, and CORS origins. |
| `manage.py` | Django CLI entrypoint for running the development server, database migrations, and admin commands. |
| `requirements.txt` | Python dependency specification (pip). |
| `package.json` | Node.js dependency specification and scripts (npm/yarn). |
| `.gitignore` | Excludes `node_modules/`, `venv/`, `.env`, `media/`, `__pycache__/`, and other generated files from version control. |

---

## 8. Dependency Summary

### Backend (Python)

| Package | Purpose |
|---------|---------|
| `Django` | Web framework |
| `djangorestframework` | REST API toolkit |
| `djangorestframework-simplejwt` | JWT authentication |
| `django-cors-headers` | Cross-origin request handling |
| `psycopg2-binary` | PostgreSQL driver |
| `python-dotenv` | Environment variable loading |
| `cryptography` | Fernet symmetric encryption |
| `opencv-python` | Face detection and recognition |
| `numpy` | Numerical computation |
| `scikit-learn` | ML utilities (imported, partially used) |
| `Pillow` | Image decoding |

### Frontend (Node.js)

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `react-scripts` | Build toolchain (CRA) |
| `axios` | HTTP client |
| `sweetalert2` | Modal dialogs |
| `web-vitals` | Performance metrics |
| `ajv`, `ajv-keywords` | JSON schema validation (dev) |

---

<div align="center">

*This document lists the technologies as actually used in the project. Version constraints reflect what is specified in `requirements.txt` and `package.json`.*

</div>
