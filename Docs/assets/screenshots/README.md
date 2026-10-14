# 📸 Visual Interface & Telemetry Showcase

## AI-Powered Smart Attendance Management System

> **Directory:** `assets/screenshots/`  
> **Purpose:** Visual documentation of user interfaces, real-time computer vision telemetry, and role-based portals.  

---

## 📑 Interface Catalog

| File | Module / Interface | Target Role | Key Features Displayed |
| :--- | :--- | :---: | :--- |
| [`01_supervisor_registration.jpeg`](01_supervisor_registration.jpeg) | Supervisor Registration | Teacher | Account onboarding, department assignment, form validation |
| [`02_teacher_login.jpeg`](02_teacher_login.jpeg) | Teacher Portal Login | Teacher | Dual username/email authentication, PBKDF2 verification |
| [`03_auth_security_modal.jpeg`](03_auth_security_modal.jpeg) | Auth Security Modal | All Roles | SweetAlert2 session alerts, role-mismatch defense |
| [`04_unified_login_portal.jpeg`](04_unified_login_portal.jpeg) | Unified Login Portal | Student / Teacher | Role selector, glassmorphic login interface |
| [`05_teacher_analytics_dashboard.jpeg`](05_teacher_analytics_dashboard.jpeg) | Supervisor Analytics | Teacher | Attendance intensity heatmap, weekly participation donut |
| [`06_biometric_multiangle_enrollment.jpeg`](06_biometric_multiangle_enrollment.jpeg) | Biometric Enrollment | Teacher | 10-shot guided multi-angle face capture with visual cues |
| [`07_realtime_ai_vision_session.jpeg`](07_realtime_ai_vision_session.jpeg) | Live AI Attendance Session | Teacher | Sub-40ms bounding box HUD, real-time confidence scores |
| [`08_admin_teacher_management.jpeg`](08_admin_teacher_management.jpeg) | Admin Management | Admin | Supervisor status toggling, global database purge |
| [`09_student_portal_dashboard.jpeg`](09_student_portal_dashboard.jpeg) | Student Dashboard | Student | Personal attendance percentage, late metrics, record history |

---

## 🖼️ Detailed Walkthrough & Visual Highlights

### 1. Real-Time AI Attendance Session with Cyber-HUD Telemetry
**File:** `07_realtime_ai_vision_session.jpeg`  
**Description:** The primary operational screen during an active classroom session. The webcam feed is processed at ~37ms per frame. Detected faces are marked with high-tech cyan bounding boxes projected on an overlay canvas with horizontal mirror correction, displaying the identified student name and real-time confidence rating (e.g., `Ahmad Khan (Marked 98.4%)`).

---

### 2. Guided 10-Shot Biometric Face Enrollment
**File:** `06_biometric_multiangle_enrollment.jpeg`  
**Description:** The structured biometric onboarding interface. Teachers guide students through 10 distinct facial poses (front view, slight left, slight right, tilt up, tilt down, neutral expression, and distance shifts). This multi-angle enrollment ensures high recognition precision under differing classroom lighting conditions.

---

### 3. Comprehensive Supervisor Analytics Dashboard
**File:** `05_teacher_analytics_dashboard.jpeg`  
**Description:** The course instructor dashboard featuring real-time statistical widgets: total enrolled students, students present today, late arrivals, average AI confidence, a 7-day weekly attendance intensity matrix, and overall participation rate charts.

---

### 4. Student Self-Service Portal
**File:** `09_student_portal_dashboard.jpeg`  
**Description:** Dedicated interface for students to independently monitor their attendance records, view class-by-class participation rates, verify check-in timestamps, and review late arrival counters.

---

### 5. Institutional Administrator Governance
**File:** `08_admin_teacher_management.jpeg`  
**Description:** The elevated administrative panel accessible only to superusers (`is_superuser=True`). Enables campus-wide teacher account activation/deactivation, audit log clearing, and system governance.

---

### 6. Multi-Layer Authentication & Security Modals
**Files:** `01_supervisor_registration.jpeg`, `02_teacher_login.jpeg`, `03_auth_security_modal.jpeg`, `04_unified_login_portal.jpeg`  
**Description:** Demonstrates the secure authentication workflow, including SweetAlert2 operational confirmation dialogs, client-side route guards, and role-separated login portals.

---

<div align="center">
  <b>AI-Powered Smart Attendance Management System</b><br/>
  <i>Visual Interface Documentation & Telemetry Showcase.</i>
</div>
