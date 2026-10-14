import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { fetchAttendanceRecords } from '../api';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [classroom, setClassroom] = useState('');
  const [userRole, setUserRole] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


  const loadHeaderData = () => {
    const savedMode = localStorage.getItem('theme-mode');
    const darkMode = savedMode === 'dark';
    setIsDark(darkMode);
    document.body.classList.toggle('dark', darkMode);
    const nav = document.querySelector('nav');
    if (nav) {
      nav.classList.toggle('dark-sidebar', darkMode);
    }

    // Load Classroom and Role data
    setClassroom(localStorage.getItem('teacher_classroom') || '');
    setUserRole(localStorage.getItem('user_role') || '');
    // Load Classroom and Role data
    setClassroom(localStorage.getItem('teacher_classroom') || '');
    setUserRole(localStorage.getItem('user_role') || '');
  };

  const loadNotifications = useCallback(async () => {
    try {
      const role = localStorage.getItem('user_role');
      const sId = localStorage.getItem('student_id');
      const hiddenIds = JSON.parse(localStorage.getItem('hidden_notifications') || '[]');

      const res = await fetchAttendanceRecords();

      // 1. Role-based filtering
      let filtered = res.data;
      if (role === 'student') {
        filtered = filtered.filter(n => n.student_id === sId);
      }

      // 2. Persistence filtering (don't show hidden/deleted notifications)
      filtered = filtered.filter(n => !hiddenIds.includes(n.id));

      const latest = filtered.slice(0, 10);

      // 3. Trigger Toast for brand new notifications
      setNotifications(prev => {
        if (latest.length > 0 && prev.length > 0 && latest[0].id !== prev[0].id) {
          const newNotif = latest[0];
          Toast.fire({
            icon: 'info',
            title: 'New Activity',
            text: `${newNotif.student_name} marked ${newNotif.status}`
          });
        }
        return latest;
      });

      setUnreadCount(latest.length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, []);

  const handleDeleteNotification = (notifId) => {
    const hiddenIds = JSON.parse(localStorage.getItem('hidden_notifications') || '[]');
    const updated = [...hiddenIds, notifId];
    localStorage.setItem('hidden_notifications', JSON.stringify(updated));

    setNotifications(prev => prev.filter(n => n.id !== notifId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleClearAll = () => {
    const currentIds = notifications.map(n => n.id);
    const hiddenIds = JSON.parse(localStorage.getItem('hidden_notifications') || '[]');
    const updated = [...new Set([...hiddenIds, ...currentIds])];
    localStorage.setItem('hidden_notifications', JSON.stringify(updated));

    setNotifications([]);
    setUnreadCount(0);
  };

  useEffect(() => {
    loadHeaderData();
    loadNotifications();

    // Poll for new notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);

    // Listen for storage events (from other tabs or window updates)
    window.addEventListener('storage', loadHeaderData);
    const handleStorageUpdate = () => loadHeaderData();
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', loadHeaderData);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [loadNotifications]);

  const handleThemeToggle = () => {
    const nextMode = !isDark;
    setIsDark(nextMode);
    localStorage.setItem('theme-mode', nextMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', nextMode);
    const nav = document.querySelector('nav');
    if (nav) {
      nav.classList.toggle('dark-sidebar', nextMode);
    }
  };

  const handleToggleSidebar = () => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.classList.toggle('semi-nav');
    }
  };

  return (
    <header className="header-main">
      <div className="container-fluid">
        <div className="row">
          <div className="col-8 col-sm-6 d-flex align-items-center header-left p-0">
            <span className="header-toggle" onClick={handleToggleSidebar} role="button" tabIndex={0}>
              <i className="ph ph-squares-four"></i>
            </span>
            {userRole === 'Supervisor' && classroom && (
              <div className="ms-3 d-none d-md-block fade-in-left">
                <span className="text-muted small text-uppercase f-w-600 d-block l-h-1">Current Class</span>
                <span className="text-primary f-w-700 f-s-16">{classroom}</span>
              </div>
            )}
            <style>{`
                .fade-in-left { animation: fadeInLeft 0.5s ease-out; }
                @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
          </div>
          <div className="col-4 col-sm-6 d-flex align-items-center justify-content-end header-right p-0">
            <ul className="d-flex align-items-center">
              <li className="header-dark">
                <button
                  type="button"
                  className="sun-logo head-icon bg-light-dark rounded-circle f-s-22 p-2 btn btn-link"
                  onClick={handleThemeToggle}
                  aria-label="Toggle dark mode"
                >
                  <i className="ph ph-moon-stars"></i>
                </button>
                <button
                  type="button"
                  className="moon-logo head-icon bg-light-dark rounded-circle f-s-22 p-2 btn btn-link"
                  onClick={handleThemeToggle}
                  aria-label="Toggle light mode"
                >
                  <i className="ph ph-sun-dim"></i>
                </button>
              </li>
              <li className="header-notification">
                <button
                  aria-controls="notificationcanvasRight"
                  className="d-block head-icon position-relative bg-light-dark rounded-circle f-s-22 p-2 btn btn-link"
                  data-bs-target="#notificationcanvasRight"
                  data-bs-toggle="offcanvas"
                  type="button"
                >
                  <i className="ph ph-bell"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute translate-middle p-1 bg-primary border border-light rounded-circle animate__animated animate__fadeIn animate__infinite animate__slower"></span>
                  )}
                </button>
                <div
                  aria-labelledby="notificationcanvasRightLabel"
                  className="offcanvas offcanvas-end header-notification-canvas"
                  id="notificationcanvasRight"
                  tabIndex="-1"
                >
                  <div className="offcanvas-header border-bottom">
                    <div className="d-flex align-items-center justify-content-between w-100 me-3">
                      <h5 className="offcanvas-title" id="notificationcanvasRightLabel">
                        Notifications
                      </h5>
                      {notifications.length > 0 && (
                        <button className="btn btn-sm btn-light-danger f-s-12 f-w-600" onClick={handleClearAll}>
                          Clear All
                        </button>
                      )}
                    </div>
                    <button aria-label="Close" className="btn-close" data-bs-dismiss="offcanvas" type="button"></button>
                  </div>
                  <div className="offcanvas-body app-scroll p-0">
                    <div className="head-container">
                      {notifications.length > 0 ? notifications.map((notif, idx) => (
                        <div key={idx} className="notification-message head-box border-bottom hover-bg-light transition-all">
                          <div className="message-content-box flex-grow-1 pe-2">
                            <div className="f-s-14 mb-0">
                              <span className="f-w-600 text-dark">{notif.student_name}</span> has been marked <span className={`f-w-600 ${notif.status === 'Present' ? 'text-success' : 'text-danger'}`}>{notif.status}</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-1">
                              <span className="text-muted extra-small">Confidence: {Math.round(notif.confidence_score)}%</span>
                              <span className="badge bg-light text-dark border extra-small">{notif.check_in_time}</span>
                            </div>
                          </div>
                          <div className="ms-2">
                            <button
                              className="btn btn-link text-danger p-0"
                              onClick={() => handleDeleteNotification(notif.id)}
                              title="Remove alert"
                            >
                              <i className="ph ph-trash f-s-18"></i>
                            </button>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-5 opacity-50">
                          <p className="mb-0 small">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
