import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AttendanceSession from './pages/teacher/AttendanceSession';
import StudentManagement from './pages/teacher/StudentManagement';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import FormValidation from './pages/FormValidation';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherManagement from './pages/admin/TeacherManagement';

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('user_role');
  const accessToken = localStorage.getItem('access_token');

  if (!userRole || !accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to legitimate dashboard based on role to avoid getting stuck
    return <Navigate to={userRole === 'teacher' ? '/' : '/student/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes - Teacher */}
        <Route path="/" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/attendance-session" element={<ProtectedRoute allowedRoles={['teacher']}><AttendanceSession /></ProtectedRoute>} />
        <Route path="/student-management" element={<ProtectedRoute allowedRoles={['teacher']}><StudentManagement /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherProfile /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherManagement /></ProtectedRoute>} />

        {/* Protected Routes - Student */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />

        {/* Public Routes */}
        <Route path="/sign-in" element={<SignIn teacherOnly={false} studentOnly={true} />} />
        <Route path="/teacher/login" element={<SignIn teacherOnly={true} studentOnly={false} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/form-validation" element={<FormValidation />} />
      </Routes>
    </Router>
  );
}





export default App;

