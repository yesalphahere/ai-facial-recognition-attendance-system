# ⚙️ Django REST & AI Computer Vision Engine

Backend API and AI processing pipeline for the **AI-Powered Smart Attendance Management System**.

---

## 🎯 Architecture Highlights

- **OpenCV YuNet**: Deep neural network face detection ONNX model running at edge speeds (~40ms inference per frame).
- **OpenCV SFace**: Industrial 128-dimensional deep feature representation model for facial identity matching.
- **Dynamic Liveness & Anti-Spoofing Engine**:
  - Eye-Mouth Position Ratio (EMPR) proportion analysis.
  - Multi-frame geometric variance analysis to prevent 2D photo and screen replay attacks.
- **Cybersecurity & Data Privacy**:
  - **Fernet AES-128 Encryption at Rest** for sensitive student PII (phone number, address) and raw biometric files.
  - **JWT Authentication** (`rest_framework_simplejwt`) with token rotation and blacklisting.
  - **API Rate Limiting / Throttling** to mitigate brute force attacks and denial-of-service attempts.
  - **Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and secure CORS origin controls.

---

## 📦 Prerequisites

- Python 3.10+
- PostgreSQL (or configured database)

---

## 🚀 Setup & Execution

### 1. Create Virtual Environment
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your database credentials and secret key:
```bash
cp .env.example .env
```
Generate an encryption key:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```
Paste this into `ENCRYPTION_KEY` inside `.env`.

### 4. Database Migrations
```bash
python manage.py migrate
```

### 5. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### 6. Run Server
```bash
python manage.py runserver
```
The API will be available at [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/).
