<div align="center">

# 📚 Engineering Documentation & Technical Specifications

### *AI-Powered Smart Attendance Management System*
**Computer Vision • Role-Based Access Control • Biometric Data Privacy**

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-3--Tier_Decoupled-0284c7?style=for-the-badge&logo=fastapi&logoColor=white" alt="Architecture" />
  <img src="https://img.shields.io/badge/Computer_Vision-YuNet_%2B_SFace-7c3aed?style=for-the-badge&logo=opencv&logoColor=white" alt="Vision Engine" />
  <img src="https://img.shields.io/badge/Security-AES_Fernet_%2B_HMAC-b91c1c?style=for-the-badge&logo=shield&logoColor=white" alt="Security" />
  <img src="https://img.shields.io/badge/Framework-Django_REST_5.2-059669?style=for-the-badge&logo=django&logoColor=white" alt="Backend" />
  <img src="https://img.shields.io/badge/Frontend-React_18.2-38bdf8?style=for-the-badge&logo=react&logoColor=black" alt="Frontend" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL_16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="Database" />
</p>

<p align="center">
  <b>Comprehensive technical documentation hub detailing system architecture, cryptographic engineering, computer vision inference pipelines, STRIDE threat models, engineering case studies, and deployment runbooks.</b>
</p>

---

[🏛️ Architecture](#-1-system-architecture--specifications) •
[🔒 Security & Privacy](#-2-cybersecurity-access-control--threat-modeling) •
[🚀 Development](#-3-engineering-retrospectives--adrs) •
[🛠️ Setup & Operations](#-4-installation-configuration--runbooks) •
[🎨 Media & Live Demo](#-5-visual-assets-vector-diagrams--live-demo)

---

</div>

## 📊 System Engineering Highlights

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KEY SYSTEM METRICS & BENCHMARKS                          │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│   SUB-40MS INFERENCE     │    ZERO-DISK EXPOSURE    │   375x COLD-START     │
│ ~37ms Total Round-Trip   │ 100% In-Memory Decrypt   │ 45s ➔ <120ms Startup  │
│ Vectorized BLAS Dot-Prod │ Plaintext Never on Disk  │ Pickled Vector Cache  │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│   PASSIVE ANTI-SPOOFING  │   MULTI-TIER RBAC        │   DUPLICATE INTEGRITY │
│ EMPR Geometric Variance  │ Admin, Teacher, Student  │ Single Daily Check-in │
│ Zero User Disruption     │ Server Queryset Scoping  │ Admin Precedence Lock │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 📂 Documentation Directory Map

```
Docs/
├── 🏛️ architecture/                     # System design, tech stack & data flows
│   ├── SYSTEM_ARCHITECTURE.md           # Multi-tier architecture & component lifecycles
│   ├── TECHNOLOGY_STACK.md              # Frameworks, versions & ONNX runtime models
│   └── DATA_FLOW.md                     # Sequence diagrams & data transformation pipelines
│
├── 🔒 security/                         # Cryptographic protocols & threat modeling
│   ├── security-and-privacy.md          # Fernet AES-128 encryption & in-memory decryption
│   ├── authentication-and-access-control.md # Multi-tier RBAC & sliding JWT token rotation
│   └── threat-model.md                  # STRIDE framework evaluation & defense matrix
│
├── 🚀 development/                      # Case studies, ADRs & engineering reflections
│   ├── technical-challenges.md          # Deep-dive case studies on 6 hard problems solved
│   ├── design-decisions.md              # 8 formal Architectural Decision Records (ADRs)
│   └── lessons-learned.md               # Systems thinking, edge AI realities & retrospective
│
├── 🛠️ setup/                            # Installation, environment & deployment
│   ├── installation-guide.md            # Step-by-step setup runbook & sanity walkthroughs
│   └── configuration-guide.md           # 12-factor env matrix, Nginx & Gunicorn configs
│
└── 🎨 assets/                           # Vector diagrams, screenshots & live demo scripts
    ├── diagrams/                        # High-resolution scalable vector diagrams (SVGs)
    │   ├── system_architecture_diagram.svg
    │   ├── ai_vision_pipeline_diagram.svg
    │   ├── cryptographic_security_diagram.svg
    │   ├── rbac_governance_diagram.svg
    │   └── README.md
    │
    ├── screenshots/                     # Real UI captures & OpenCV telemetry displays
    │   ├── 01_supervisor_registration.jpeg ... 09_student_portal_dashboard.jpeg
    │   └── README.md
    │
    ├── demo/                            # Viva defense scripts & automated testing payloads
    │   ├── demo_walkthrough_guide.md    # 10-minute live evaluator demonstration script
    │   ├── sample_payloads.json         # Sample API request/response test fixtures
    │   └── README.md
    │
    └── README.md                        # Master assets catalog & media index
```

---

## 🏛️ 1. System Architecture & Specifications

The architecture section provides end-to-end structural documentation of the platform's multi-tier design, data flows, and technology selections.

| Document | Primary Focus | Key Engineering Artifacts |
| :--- | :--- | :--- |
| **[SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md)** | **Multi-Tier System Architecture** | 3-tier decoupled design, client HUD rendering, DRF middleware, in-memory AI engine, PostgreSQL data model, mathematical EMPR modeling, session states, and deployment topology. |
| **[TECHNOLOGY_STACK.md](architecture/TECHNOLOGY_STACK.md)** | **Technology & Dependency Rationale** | Complete inventory of frameworks (React 18, Django 5.2, DRF 3.14), exact package versions, OpenCV ONNX runtimes (YuNet + SFace), database engines, and comparison trade-off matrices. |
| **[DATA_FLOW.md](architecture/DATA_FLOW.md)** | **Information Lifecycle & Sequence Flows** | Sequence diagrams for unified login, 10-shot multi-angle enrollment, live Base64 frame processing, session termination auto-absent reconcile, and complete API endpoint reference. |

### Visual Architecture Snapshot
<div align="center">
  <img src="assets/diagrams/system_architecture_diagram.svg" alt="System Architecture Diagram" width="95%" />
</div>

---

## 🔒 2. Cybersecurity, Access Control & Threat Modeling

The security suite details how the platform addresses data privacy, biometric security, and identity governance under rigorous engineering standards.

| Document | Primary Focus | Key Security Highlights |
| :--- | :--- | :--- |
| **[security-and-privacy.md](security/security-and-privacy.md)** | **Cryptographic Privacy & Biometric Vault** | Authenticated Fernet AES-128-CBC + HMAC-SHA256 encryption at rest, **zero-plaintext in-memory RAM streaming decryption**, field-level PII protection, and GDPR data minimization. |
| **[authentication-and-access-control.md](security/authentication-and-access-control.md)** | **Multi-Tier RBAC & Token Governance** | RFC 7519 JWT token pairs, **sliding refresh token rotation with database blacklisting**, PBKDF2 password derivation (870,000+ iters), and deep server-side ORM queryset isolation. |
| **[threat-model.md](security/threat-model.md)** | **STRIDE Threat Modeling & Defense Matrix** | Formal STRIDE evaluation mapping 12 distinct threat vectors (presentation spoofing, token theft, DoS floods, cross-class leaks) directly to implemented countermeasures. |

### Cryptographic In-Memory Pipeline Snapshot
<div align="center">
  <img src="assets/diagrams/cryptographic_security_diagram.svg" alt="Cryptographic Security Pipeline" width="95%" />
</div>

---

## 🚀 3. Engineering Retrospectives & ADRs

The development section documents the problem-solving journey, architectural trade-offs, and lessons learned from conceiving and implementing the project.

| Document | Primary Focus | Key Retrospective Insights |
| :--- | :--- | :--- |
| **[technical-challenges.md](development/technical-challenges.md)** | **Deep-Dive Technical Case Studies** | Solutions to 6 hard engineering bottlenecks: Sub-40ms CPU latency via vectorized BLAS dot products, passive EMPR anti-spoofing, 375x cold-start reduction, and dual-canvas HUD mirroring. |
| **[design-decisions.md](development/design-decisions.md)** | **Architectural Decision Records (ADRs)** | 8 formal ADRs documenting why OpenCV ONNX was chosen over MTCNN/FaceNet, why Fernet was chosen over plain AES, why vectorized matrix math beat loops, and why dual-canvas HUD beat video baking. |
| **[lessons-learned.md](development/lessons-learned.md)** | **Personal Retrospective & Systems Growth** | Reflections on software craftsmanship, the edge AI CPU reality, full-stack perceived latency hiding, defensive database constraints, and the Version 2.0 multi-campus roadmap. |

### Deep Vision Inference Pipeline Snapshot
<div align="center">
  <img src="assets/diagrams/ai_vision_pipeline_diagram.svg" alt="AI Vision Pipeline Diagram" width="95%" />
</div>

---

## 🛠️ 4. Installation, Configuration & Runbooks

Operational runbooks providing turnkey setup instructions and production hardening guidelines for developers and system administrators.

| Document | Primary Focus | Key Operational Artifacts |
| :--- | :--- | :--- |
| **[installation-guide.md](setup/installation-guide.md)** | **Turnkey Setup & Verification Runbook** | Prerequisites, PostgreSQL initialization, virtual environment setup, Fernet key generation, React 18 client installation, sanity walkthroughs, and troubleshooting FAQ. |
| **[configuration-guide.md](setup/configuration-guide.md)** | **12-Factor Configuration & Production Guide** | Complete environment variable matrices (`backend/.env` & `frontend/.env`), camera parameter tuning (Webcam & RTSP), JWT rate limit tuning, and **production Nginx + Gunicorn systemd configurations**. |

### Port & Service Allocations
```
┌───────────────────────┬──────────────┬───────────┬───────────────────────────────────────────┐
│ Service Component     │ Default Port │ Protocol  │ Purpose                                   │
├───────────────────────┼──────────────┼───────────┼───────────────────────────────────────────┤
│ React 18 Frontend     │ 3000         │ HTTP/S    │ User Interface, Canvas HUD & Video Feed   │
│ Django REST Backend   │ 8000         │ HTTP/S    │ REST API Gateway, Auth & OpenCV AI Engine │
│ PostgreSQL 16 DB      │ 5432         │ TCP/IP    │ Relational Storage & Pickled Vector Cache │
└───────────────────────┴──────────────┴───────────┴───────────────────────────────────────────┘
```

---

## 🎨 5. Visual Assets, Vector Diagrams & Live Demo

High-resolution media, interactive vector diagrams, interface screenshots, and live evaluation runbooks.

| Section | Directory Link | Included Materials |
| :--- | :--- | :--- |
| **Scalable Vector Diagrams** | **[assets/diagrams/](assets/diagrams/)** | High-resolution SVG diagrams of the 3-Tier Architecture, AI Vision Pipeline, Cryptographic Vault, and Multi-Tier RBAC. |
| **Interface Screenshots** | **[assets/screenshots/](assets/screenshots/)** | 9 high-resolution screenshots illustrating Teacher Login, 10-Shot Biometric Enrollment, Real-Time HUD, and Analytics. |
| **Live Demonstration Kit** | **[assets/demo/](assets/demo/)** | Detailed 10-minute presentation script (`demo_walkthrough_guide.md`) and sample API payloads (`sample_payloads.json`). |
| **Master Media Catalog** | **[assets/README.md](assets/README.md)** | Catalog and description of all media assets in the repository. |

### Multi-Tier Role-Based Governance Snapshot
<div align="center">
  <img src="assets/diagrams/rbac_governance_diagram.svg" alt="RBAC Governance Diagram" width="95%" />
</div>

---

## 💡 Quick Start Command Reference

```bash
# 1. Clone the repository
git clone https://github.com/yesalphahere/ai-facial-recognition-attendance-system.git
cd ai-facial-recognition-attendance-system

# 2. Setup & run Backend
cd backend
python -m venv venv
.\venv\Scripts\activate       # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # Update DB credentials & generate ENCRYPTION_KEY
python manage.py migrate
python manage.py runserver

# 3. Setup & run Frontend (in a new terminal)
cd ../frontend
npm install --legacy-peer-deps
cp .env.example .env
npm start
```
👉 Application will launch at **[http://localhost:3000](http://localhost:3000)**!

---

<div align="center">
  <b>AI-Powered Smart Attendance Management System</b><br/>
  <i>Engineered for Academic Excellence, Computational Efficiency, and Biometric Privacy.</i><br/>
  <sub>Developed by Alpha • BS Computer Science Final Year Project</sub>
</div>
