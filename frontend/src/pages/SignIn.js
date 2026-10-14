import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import Swal from 'sweetalert2';

const SignIn = ({ teacherOnly, studentOnly }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = teacherOnly ? 'Teacher Login' : 'User Login';
  }, [teacherOnly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser({ username, password });
      if (res.data.status === 'success') {
        const { role, name } = res.data;
        // Store session info (simplified)
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_name', name);
        localStorage.setItem('access_token', res.data.tokens.access);
        localStorage.setItem('refresh_token', res.data.tokens.refresh);
        localStorage.setItem('user_id', res.data.user_id);
        localStorage.setItem('profile_id', res.data.profile_id);
        localStorage.setItem('student_id', res.data.student_id || '');
        localStorage.setItem('user_email', res.data.email || '');
        localStorage.setItem('is_superuser', res.data.is_superuser || false);
        localStorage.setItem('teacher_classroom', res.data.department || '');

        if (studentOnly && (role === 'teacher' || res.data.is_superuser)) {
          const blockMsg = 'Access Denied: Teachers cannot login through this portal.';
          setError(blockMsg);
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: blockMsg,
            confirmButtonColor: '#0f626a'
          });
          return;
        }

        if (teacherOnly && role === 'student') {
          const blockMsg = 'Access Denied: Students cannot login through this portal.';
          setError(blockMsg);
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: blockMsg,
            confirmButtonColor: '#0f626a'
          });
          return;
        }

        if (role === 'teacher') {
          navigate('/');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid username or password. Please try again.';
      setError(errorMsg);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMsg,
        confirmButtonColor: '#0f626a'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper d-block overflow-hidden">
      <div className="sign-in-bg">
        <div className="container-fluid p-0">
          <div className="row g-0 main-content-box shadow-lg min-vh-100 overflow-hidden">
            <div className="col-lg-7 image-content-box d-none d-lg-flex flex-column justify-content-center bg-primary-grad p-5">
              <div className="form-container text-center">
                <div className="signup-content mb-3">
                  <span>
                    <img alt="Logo" className="img-fluid" src={process.env.PUBLIC_URL + '/assets/images/logo/1.png'} style={{ maxWidth: '150px', filter: 'brightness(0) invert(1)' }} />
                  </span>
                </div>
                <h3 className="text-white mb-4">Smart Attendance System</h3>
                <div className="signup-bg-img">
                  <img alt="Sign In" className="img-fluid rounded-3" src={process.env.PUBLIC_URL + '/assets/images/login/01.png'} />
                </div>
              </div>
            </div>
            <div className="col-lg-5 form-content-box bg-white p-4 p-xl-5 d-flex flex-column justify-content-center">
              <div className="form-container">
                <form className="app-form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4 text-center text-lg-start">
                        <h2 className="text-dark f-w-700">{teacherOnly ? 'Teacher' : 'User'} Login to <span style={{ color: '#0f626a' }}>System</span></h2>
                        <p className="text-muted">Enter your credentials to access your dashboard</p>
                      </div>
                    </div>
                    {error && (
                      <div className="col-12">
                        <div className="alert alert-danger f-s-14 py-2">{error}</div>
                      </div>
                    )}
                    <div className="col-12">
                      <div className="mb-4">
                        <label className="form-label f-w-600 mb-2">Username or Email</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-user"></i></span>
                          <input
                            className="form-control border-start-0 ps-3 custom-input"
                            id="UserName"
                            placeholder="username or email address"
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); if (error) setError(''); }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-4">
                        <div className="d-flex justify-content-between">
                          <label className="form-label f-w-600 mb-2">Password</label>
                          <Link to="/forgot-password" className="f-s-12 text-decoration-none f-w-600" style={{ color: '#0f626a' }}>Forgot Password?</Link>
                        </div>
                        <div className="input-group position-relative">
                          <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-lock"></i></span>
                          <input
                            className="form-control border-start-0 ps-3 custom-input"
                            id="floatingInput"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                            required
                          />
                          <button
                            type="button"
                            className="btn position-absolute top-50 end-0 translate-middle-y border-0 me-2"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ zIndex: 10 }}
                          >
                            <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'} f-s-18`} style={{ color: '#0f626a' }}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn w-100 py-3 f-w-600 shadow-sm text-white" style={{ backgroundColor: '#0f626a', borderColor: '#0f626a' }} type="submit" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In Now'}
                      </button>
                    </div>
                    {teacherOnly && (
                      <div className="col-12 mt-4 text-center">
                        <p className="text-muted f-s-14">
                          Teacher registration required?{' '}
                          <Link className="f-w-600 decoration-none" style={{ color: '#0f626a' }} to="/sign-up">Register Here</Link>
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .bg-primary-grad { background: linear-gradient(135deg, #0f626a 0%, #0a4a50 100%); }
          .main-content-box { min-height: 100vh; margin: 0; }
          .app-wrapper { height: 100vh; overflow: hidden; }
          .sign-in-bg { height: 100%; }
          
          /* Custom Inputs */
          .custom-input {
              border: 2px solid #0f626a !important;
              border-radius: 0 10px 10px 0 !important;
              padding: 12px 45px 12px 15px !important;
              transition: all 0.3s ease;
          }
          .custom-input-icon {
              border: 2px solid #0f626a !important;
              border-right: 0 !important;
              border-radius: 10px 0 0 10px !important;
              padding: 12px 15px;
          }
          .input-group:focus-within .custom-input,
          .input-group:focus-within .custom-input-icon {
              border-color: #0f626a !important;
          }
          .input-group:focus-within .custom-input-icon i {
              color: #0f626a;
          }
          .form-control:focus { box-shadow: none; }
      `}} />
    </div>
  );
};

export default SignIn;
