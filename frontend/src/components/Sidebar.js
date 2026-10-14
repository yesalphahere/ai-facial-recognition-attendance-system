import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isStudent = currentPath.startsWith('/student/');
  const userName = localStorage.getItem('user_name') || 'Administrator';
  const userRole = localStorage.getItem('user_role') || 'Supervisor';

  const handleCloseSidebar = () => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.classList.remove('semi-nav');
    }
  };

  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const getExactClass = (path) => {
    return isActive(path) ? 'active-nav-item' : '';
  };

  return (
    <nav>
      <div className="app-logo">
        <Link className="logo d-inline-block" to="/">
          <img alt="Face System" src={process.env.PUBLIC_URL + '/assets/images/logo/1.png'} className="sidebar-logo" />
        </Link>
        <span className="bg-light-primary toggle-semi-nav d-flex-center" onClick={handleCloseSidebar} role="button" tabIndex={0}>
          <i className="ti ti-chevron-right"></i>
        </span>
        <div className="d-flex align-items-center nav-profile p-3">
          <span className="h-45 w-45 d-flex-center b-r-10 position-relative bg-primary-grad m-auto overflow-hidden shadow-sm">
            <div className="text-white f-w-700 f-s-18">{userName.charAt(0)}</div>
            <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle"></span>
          </span>
          <div className="flex-grow-1 ps-2">
            <h6 className="text-primary mb-0 f-w-700">{userName}</h6>
            <p className="text-muted f-s-11 mb-0 text-uppercase">{userRole}</p>
          </div>
          <div className="dropdown profile-menu-dropdown">
            <button
              aria-expanded="false"
              data-bs-auto-close="true"
              data-bs-placement="top"
              data-bs-toggle="dropdown"
              className="btn p-0 d-inline-flex"
              type="button"
              style={{ display: 'inline-flex' }}
            >
              <i className="ph ph-dots-three-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu shadow-sm border-0">
              <li className="dropdown-item">
                <Link className="f-w-500" to="/settings">
                  <i className="ph ph-gear pe-2 text-primary"></i> Profile Settings
                </Link>
              </li>
              <li className="dropdown-item">
                <Link className="mb-0 text-danger" to="/sign-in" onClick={() => localStorage.clear()}>
                  <i className="ph ph-sign-out pe-2"></i> Log Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style>{`
        .bg-primary-grad { background: linear-gradient(135deg, #0f626a 0%, #0a4a50 100%); }
        .text-primary { color: #0f626a !important; }
        .bg-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; }
        
        /* Logo Sizing */
        .sidebar-logo {
            width: 200px;
            height: auto;
            max-width: none;
            transition: all 0.3s ease;
        }
        
        /* Collapsed Sidebar (.semi-nav) overrides */
        nav.semi-nav .sidebar-logo {
            width: 40px;
            opacity: 0; /* Optional: hide/fade logo in collapsed mode if preferred, or keep small */
            visibility: hidden;
        }
        nav.semi-nav .app-logo {
            padding: 10px !important;
            justify-content: center;
        }
        
        /* Active Sidebar Item Styling */
        .active-nav-item {
            background: linear-gradient(90deg, rgba(15, 98, 106, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
            border-left: 4px solid #0f626a;
            color: #0f626a !important;
            transition: all 0.3s ease;
        }
        .active-nav-item i {
            color: #0f626a !important;
            font-weight: 700;
        }
        .active-nav-item span, .active-nav-item a {
            color: #0f626a !important;
            font-weight: 600;
        }
        .app-nav li a {
            margin-left: 5px;
            transition: margin-left 0.2s;
        }
        .active-nav-item a {
            margin-left: 8px !important; 
        }
      `}</style>
      <div className="app-nav" id="app-simple-bar">
        <ul className="main-nav p-0 mt-2">
          {!isStudent ? (
            <>
              <li className="menu-title">
                <span>Teacher Panel</span>
              </li>
              <li className={`no-sub ${getExactClass('/')}`}>
                <Link to="/">
                  <i className="ph ph-house" style={{ color: isActive('/') ? '#0f626a' : 'black' }}></i>
                  Dashboard
                </Link>
              </li>
              {localStorage.getItem('is_superuser') !== 'true' && (
                <>
                  <li className={`no-sub ${getExactClass('/attendance-session')}`}>
                    <Link to="/attendance-session">
                      <i className="ph ph-camera" style={{ color: isActive('/attendance-session') ? '#0f626a' : 'black' }}></i>
                      Attendance Session
                    </Link>
                  </li>
                  <li className={`no-sub ${getExactClass('/student-management')}`}>
                    <Link to="/student-management">
                      <i className="ph ph-users" style={{ color: isActive('/student-management') ? '#0f626a' : 'black' }}></i>
                      Student Management
                    </Link>
                  </li>
                </>
              )}
              {localStorage.getItem('is_superuser') === 'true' && (
                <li className={`no-sub ${getExactClass('/admin/teachers')}`}>
                  <Link to="/admin/teachers">
                    <i className="ph ph-briefcase" style={{ color: isActive('/admin/teachers') ? '#0f626a' : 'black' }}></i>
                    Teacher Management
                  </Link>
                </li>
              )}
              <li className={`no-sub ${getExactClass('/settings')}`}>
                <Link to="/settings">
                  <i className="ph ph-gear" style={{ color: isActive('/settings') ? '#0f626a' : 'black' }}></i>
                  Profile Settings
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="menu-title">
                <span>Student Panel</span>
              </li>
              <li className={`no-sub ${getExactClass('/student/dashboard')}`}>
                <Link to="/student/dashboard">
                  <i className="ph ph-user-square" style={{ color: isActive('/student/dashboard') ? '#0f626a' : 'black' }}></i>
                  Dashboard
                </Link>
              </li>
              <li className={`no-sub ${getExactClass('/student/profile')}`}>
                <Link to="/student/profile">
                  <i className="ph ph-user-circle" style={{ color: isActive('/student/profile') ? '#0f626a' : 'black' }}></i>
                  My Profile
                </Link>
              </li>
            </>
          )}

          <li className="menu-title"><span>Account</span></li>
          <li className="no-sub">
            <Link to="/sign-in">
              <i className="ph ph-sign-out" style={{ color: 'black' }}></i>
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className="menu-navs">
        <span className="menu-previous"><i className="ti ti-chevron-left"></i></span>
        <span className="menu-next"><i className="ti ti-chevron-right"></i></span>
      </div>
    </nav>
  );
};

export default Sidebar;
