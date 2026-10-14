# ⚙️ System Configuration & Production Hardening Guide

## AI-Powered Smart Attendance Management System

> **Document Type:** Environment Specification & Production Configuration Runbook  
> **Target Audience:** DevOps Engineers, System Administrators, Security Engineers  
> **Scope:** Final Year Project (FYP) — BS Computer Science  

---

## 📑 Table of Contents

1. [Configuration Philosophy (12-Factor Alignment)](#1-configuration-philosophy-12-factor-alignment)
2. [Complete Environment Variable Reference](#2-complete-environment-variable-reference)
   - [2.1 Backend Environment Matrix (`backend/.env`)](#21-backend-environment-matrix-backendenv)
   - [2.2 Frontend Environment Matrix (`frontend/.env`)](#22-frontend-environment-matrix-frontedenv)
3. [Database Configuration & PostgreSQL Tuning](#3-database-configuration--postgresql-tuning)
4. [Cryptographic Key Management & Safety Protocols](#4-cryptographic-key-management--safety-protocols)
5. [Camera & Video Ingestion Configuration](#5-camera--video-ingestion-configuration)
   - [5.1 Client-Side Webcam Stream Tuning](#51-client-side-webcam-stream-tuning)
   - [5.2 Institutional RTSP / IP Camera Configuration](#52-institutional-rtsp--ip-camera-configuration)
6. [JWT Token Lifecycle & Throttling Rate Tuning](#6-jwt-token-lifecycle--throttling-rate-tuning)
7. [Production Hardening Checklist](#7-production-hardening-checklist)
8. [Production Deployment Architecture (Nginx + Gunicorn)](#8-production-deployment-architecture-nginx--gunicorn)

---

## 1. Configuration Philosophy (12-Factor Alignment)

The **AI-Powered Smart Attendance Management System** strictly adheres to the **Twelve-Factor App methodology (Config Factor III)**:
- **Strict Code/Config Separation:** No database passwords, secret keys, or environment-specific URLs are hardcoded in the codebase.
- **Environment Isolation:** Configuration parameters are injected dynamically at runtime via `.env` files using `python-dotenv` on the backend and Create-React-App environment processing on the frontend.
- **Portability:** The exact same codebase can transition from local laptop development to a multi-classroom campus server simply by modifying environment variables.

---

## 2. Complete Environment Variable Reference

### 2.1 Backend Environment Matrix (`backend/.env`)

Located at `backend/.env`. Created from template `backend/.env.example`.

| Variable Name | Required | Default / Example Value | Data Type | Purpose & Security Implications |
| :--- | :---: | :--- | :---: | :--- |
| `SECRET_KEY` | **Yes** | `django-insecure-generate-a-secure-random-key-here` | String | Master cryptographic key used for Django's cryptographic signing, CSRF protection, and JWT signature verification. In production, use a 64+ character random string. |
| `DEBUG` | **Yes** | `True` (Dev) / `False` (Prod) | Boolean | When `True`, displays detailed error traces. **Must be set to `False` in production** to prevent leaking database schemas, file paths, and internal stack traces. |
| `ALLOWED_HOSTS` | **Yes** | `127.0.0.1,localhost` | Comma-Separated | List of domain names or IP addresses that this Django site can serve. Prevents HTTP Host header poisoning attacks. |
| `DB_NAME` | **Yes** | `face_recognition` | String | Name of the active PostgreSQL database instance. |
| `DB_USER` | **Yes** | `postgres` | String | PostgreSQL database user account with schema read/write privileges. |
| `DB_PASSWORD` | **Yes** | `your_secure_db_password` | String | Password for the PostgreSQL user. Never commit this to version control. |
| `DB_HOST` | **Yes** | `127.0.0.1` | String / IP | Hostname or IP of the PostgreSQL server. Use `127.0.0.1` for local, or an internal private IP for dedicated database servers. |
| `DB_PORT` | **Yes** | `5432` | Integer | Network port for PostgreSQL (standard default is `5432`). |
| `ENCRYPTION_KEY` | **Yes** | `(Base64 32-Byte Key)` | URL-Safe Base64 | Symmetric Fernet key used to encrypt student PII and biometric face photos at rest. **Critical:** If lost, existing encrypted images cannot be recovered. |
| `CORS_ALLOWED_ORIGINS` | **Yes** | `http://localhost:3000` | Comma-Separated | Whitelisted origins permitted to make cross-origin REST requests. Prevents unauthorized websites from querying your API. |

---

### 2.2 Frontend Environment Matrix (`frontend/.env`)

Located at `frontend/.env`. Created from template `frontend/.env.example`.

| Variable Name | Required | Default / Example Value | Data Type | Purpose |
| :--- | :---: | :--- | :---: | :--- |
| `REACT_APP_API_URL` | **Yes** | `http://127.0.0.1:8000/api` | URL String | Base URL used by the Axios HTTP client (`frontend/src/api/index.js`) to route API calls to the Django REST server. In production, update this to your domain (e.g., `https://attendance.institution.edu/api`). |

---

## 3. Database Configuration & PostgreSQL Tuning

In `backend/backend/settings.py`, the database connection is resolved dynamically:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'face_recognition'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

### 3.1 Production PostgreSQL Connection Pooling
For multi-classroom deployments where dozens of camera streams access the database concurrently, configure persistent connections by adding `CONN_MAX_AGE` to reduce TCP handshake overhead:

```python
# Optional production optimization in settings.py:
DATABASES['default']['CONN_MAX_AGE'] = 600 # Persist database connections for 10 minutes
```

### 3.2 Database Backup Protocol
To back up the encrypted attendance database without exposing plaintext credentials:

```bash
# Automated database dump
pg_dump -U postgres -h 127.0.0.1 -d face_recognition -F c -b -v -f "attendance_backup_$(date +%Y%m%d).dump"
```

---

## 4. Cryptographic Key Management & Safety Protocols

The platform uses authenticated **Fernet AES-128-CBC + HMAC-SHA256** encryption to protect:
1. Multi-angle facial image files (`media/face_data/`).
2. Student personal telephone numbers and residential addresses.

```mermaid
flowchart TD
    A[Generate 256-Bit Cryptographic Key] --> B[Store in backend/.env: ENCRYPTION_KEY]
    B --> C[SecurityUtils.get_fernet]
    C --> D[Encrypts Images Before Writing to File System]
    C --> E[Encrypts PII Before Saving to Database]
    C --> F[Decrypts Into RAM During AI Recognition]
```

### 4.1 Generating a New Key
To generate a valid 32-byte base64-encoded key:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 4.2 Key Protection Guidelines
- **Zero Version Control:** Ensure `backend/.env` is listed in `.gitignore` and never committed to GitHub or public repositories.
- **Disaster Recovery Backup:** Store a secure offline copy of your `ENCRYPTION_KEY`. If this key is lost, encrypted student photos cannot be decrypted by the AI engine, requiring students to re-enroll.

---

## 5. Camera & Video Ingestion Configuration

The system accommodates both local classroom webcams and institutional IP cameras.

### 5.1 Client-Side Webcam Stream Tuning

In `frontend/src/pages/teacher/AttendanceSession.js`, video streaming parameters can be adjusted based on network bandwidth and client hardware:

```javascript
// Frame capture compression ratio (default: 0.60 JPEG quality)
const frameData = canvas.toDataURL('image/jpeg', 0.60);

// Polling frequency (default: ~2-3 seconds per frame)
```

- **Higher Precision Mode:** Increase quality to `0.80` for high-resolution 1080p webcams.
- **Low-Bandwidth Mode:** Reduce quality to `0.45` for slow Wi-Fi environments (reduces payload to ~10KB per frame).

---

### 5.2 Institutional RTSP / IP Camera Configuration

For large lecture halls with ceiling-mounted IP cameras, configure the stream URL during session creation:

```
RTSP URL SYNTAX:
rtsp://<username>:<password>@<camera_ip>:<port>/<stream_path>

EXAMPLES:
• Hikvision: rtsp://admin:Pass1234@192.168.1.64:554/Streaming/Channels/101
• Dahua:     rtsp://admin:Pass1234@192.168.1.108:554/cam/realmonitor?channel=1&subtype=0
• Custom IP: rtsp://192.168.1.50:8554/live.sdp
```

In `backend/main/views.py`, the backend tests the RTSP connection with a 3,000ms safety timeout:

```python
cap = cv2.VideoCapture(full_url)
cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, 3000) # 3-second connection timeout
cap.set(cv2.CAP_PROP_READ_TIMEOUT_MSEC, 3000)
ret, frame = cap.read()
cap.release()
```

---

## 6. JWT Token Lifecycle & Throttling Rate Tuning

JWT parameters and rate limits are defined in `backend/backend/settings.py`:

```python
# SimpleJWT Configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), # 1 Hour Access
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),     # 24 Hours Refresh
    'ROTATE_REFRESH_TOKENS': True,                   # Issue new refresh token on use
    'BLACKLIST_AFTER_ROTATION': True,                # Invalidate old refresh token
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# API Rate Throttling
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '1000/day',     # Limits brute-force login attempts
        'user': '100000/day'    # Sufficient for high-frequency live frame streaming
    }
}
```

- **For Large Institutions:** If multiple classrooms stream frames concurrently from the same network IP, adjust `'user': '500000/day'`.

---

## 7. Production Hardening Checklist

Before deploying the application to an institutional production server, verify each security setting:

```
PRODUCTION HARDENING CHECKLIST:
[ ] 1. Set DEBUG = False in backend/.env
[ ] 2. Replace SECRET_KEY with a 64-character cryptographically random string
[ ] 3. Update ALLOWED_HOSTS with your production domain (e.g., attendance.edu)
[ ] 4. Update CORS_ALLOWED_ORIGINS to match your production frontend URL
[ ] 5. Activate SECURE_SSL_REDIRECT = True (Requires HTTPS Certificate)
[ ] 6. Activate SESSION_COOKIE_SECURE = True and CSRF_COOKIE_SECURE = True
[ ] 7. Run 'python manage.py collectstatic' to aggregate static files
[ ] 8. Verify media directory permissions: chmod 700 backend/media/
[ ] 9. Verify .env file permissions: chmod 600 backend/.env
[ ] 10. Confirm PostgreSQL is NOT exposed to the public internet (Port 5432 bound to 127.0.0.1)
```

---

## 8. Production Deployment Architecture (Nginx + Gunicorn)

For production deployment on an Ubuntu Linux server, use **Nginx** as the reverse proxy and **Gunicorn** as the WSGI application server:

```mermaid
flowchart LR
    CLIENT[Web Browser / Webcam] -->|HTTPS Port 443| NGINX[Nginx Reverse Proxy & SSL]
    NGINX -->|Static Files / HTML| STATIC[(Compiled React Build<br/>/var/www/frontend/build)]
    NGINX -->|Proxy /api/| GUNICORN[Gunicorn WSGI Server<br/>127.0.0.1:8000]
    GUNICORN --> DJANGO[Django REST Framework]
    DJANGO --> DB[(PostgreSQL Port 5432)]
```

### 8.1 Gunicorn Systemd Service Unit (`/etc/systemd/system/attendance_backend.service`)

```ini
[Unit]
Description=Gunicorn instance to serve Smart Attendance Backend
After=network.target postgresql.service

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/ai-facial-recognition-attendance-system/backend
Environment="PATH=/var/www/ai-facial-recognition-attendance-system/backend/venv/bin"
ExecStart=/var/www/ai-facial-recognition-attendance-system/backend/venv/bin/gunicorn \
          --workers 4 \
          --bind 127.0.0.1:8000 \
          --timeout 60 \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 8.2 Nginx Server Block Configuration (`/etc/nginx/sites-available/attendance`)

```nginx
server {
    listen 80;
    server_name attendance.institution.edu;
    return 301 https://$host$request_uri; # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl http2;
    server_name attendance.institution.edu;

    ssl_certificate /etc/letsencrypt/live/attendance.institution.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/attendance.institution.edu/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Serve Compiled React Frontend SPA
    location / {
        root /var/www/ai-facial-recognition-attendance-system/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy REST API Requests to Gunicorn
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 25M; # Allows 10-shot enrollment photo uploads
    }

    # Serve Encrypted Media & Static Files
    location /media/ {
        alias /var/www/ai-facial-recognition-attendance-system/backend/media/;
    }
}
```

---

<div align="center">
  <b>AI-Powered Smart Attendance Management System</b><br/>
  <i>System Configuration Complete. Engineered for Security, Scalability, and Clean Infrastructure Separation.</i>
</div>
