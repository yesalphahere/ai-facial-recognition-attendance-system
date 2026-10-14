import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Avoid redirect loops if the login request itself fails with 401
            const isLoginRequest = error.config.url.includes('/login_user/');

            if (!isLoginRequest) {
                console.error('Session expired or unauthorized. Redirecting to login...');
                localStorage.clear();
                window.location.href = '/sign-in';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const loginUser = (data) => api.post('/teachers/login_user/', data);
export const registerTeacher = (data) => api.post('/teachers/register_teacher/', data);

// Teacher APIs
export const fetchStudents = () => api.get('/students/');
export const registerStudent = (formData) => api.post('/teachers/create-student/', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const fetchStats = () => api.get('/teachers/stats/'); // To be implemented in backend views
export const fetchTeachers = () => api.get('/teachers/');
export const toggleTeacherStatus = (id) => api.post(`/teachers/${id}/toggle-active/`);
export const updateTeacherProfile = (id, formData) => api.patch(`/teachers/${id}/update-profile/`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const changeTeacherPassword = (id, newPassword) => api.post(`/teachers/${id}/change-password/`, {
    new_password: newPassword
});
export const clearAttendanceRecords = () => api.post('/teachers/clear-records/');

// Attendance Session APIs
export const fetchSessions = () => api.get('/sessions/');
export const createSession = (data) => api.post('/sessions/', data);
export const toggleSessionStatus = (id) => api.post(`/sessions/${id}/toggle_active/`);

// Attendance Records
export const fetchAttendanceRecords = () => api.get('/records/');
export const deleteAttendanceRecord = (id) => api.delete(`/records/${id}/`);

// Student APIs
export const fetchStudentProfile = (id) => api.get(`/students/${id}/`);
export const deleteStudent = (id) => api.delete(`/students/${id}/`);
export const toggleStudentStatus = (id) => api.post(`/students/${id}/toggle-status/`);
export const updateStudent = (id, data) => api.patch(`/students/${id}/`, data);
export const updateStudentProfile = (id, data) => api.patch(`/students/${id}/update-profile/`, data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    window.location.reload();
};

export default api;
