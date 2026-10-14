# 🖥️ Client Portal & Dashboard Frontend

Modern, high-performance React dashboard and webcam biometric interface for the **AI-Powered Smart Attendance Management System**.

---

## 🚀 Key Features

- **⚡ Live Webcam Biometrics**: Real-time facial frame streaming directly from client camera to the AI inference engine.
- **📸 10-Angle Enrollment System**: Structured multi-angle facial capture tool with live visual feedback and progress indicators.
- **📊 Real-time Analytical Telemetry**:
  - Live session tracking with millisecond latency metrics.
  - Interactive attendance intensity matrix and weekly attendance rate charts.
  - Participation breakdown donut charts.
- **🛡️ Secure Access Control (RBAC)**:
  - **Administrator Portal**: Teacher account lifecycle, profile approvals, and global audit clearing.
  - **Supervisor / Teacher Dashboard**: Course session activation, IP camera / USB webcam stream management, attendance reports.
  - **Student Self-Service Portal**: Individual attendance ledger, attendance percentages, and profile records.
- **🎨 Glassmorphic Modern UI**: Built with modern CSS, responsive layout, and SweetAlert2 notifications.

---

## 🛠️ Tech Stack

- **React 18** (Functional components & hooks)
- **React Router v6** (Protected client-side routing)
- **Axios** (Centralized API client with JWT request/response interceptors)
- **SweetAlert2** (Modal dialogs & operational alerts)

---

## ⚙️ Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `REACT_APP_API_URL` points to your backend:
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

### 3. Run Development Server
```bash
npm start
```
The app will open automatically at [http://localhost:3000](http://localhost:3000).

---

## 📂 Architecture Overview

```
frontend/
├── public/               # Static assets & HTML root
├── src/
│   ├── api/              # Axios configuration & authenticated API service calls
│   ├── components/       # Reusable components (Header, Sidebar, Layout, Loader)
│   ├── pages/            # Application views
│   │   ├── admin/        # Admin management pages
│   │   ├── teacher/      # Teacher sessions, student enrollment, metrics
│   │   ├── student/      # Student dashboard & profile
│   │   ├── SignIn.js     # Unified authentication
│   │   └── SignUp.js     # Supervisor registration
│   ├── App.js            # Routing and authentication guards
│   └── index.js          # React DOM entry point
└── package.json
```
