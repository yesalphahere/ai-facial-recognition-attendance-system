import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerTeacher } from '../api';
import Swal from 'sweetalert2';

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerTeacher(formData);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Please sign in to your account.',
        confirmButtonColor: '#0f626a'
      });
      navigate('/sign-in');
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Try again.";
      setError(errorMsg);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMsg,
        confirmButtonColor: '#0f626a'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper d-block overflow-hidden">
      <div className="sign-up-bg">
        <div className="container-fluid p-0">
          <div className="row g-0 main-content-box shadow-lg min-vh-100 overflow-hidden">
            <div className="col-lg-5 form-content-box bg-white p-4 p-xl-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <div className="form-container">
                <form className="app-form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-4 text-center">
                      <div className="mb-2">
                        <img alt="Logo" src={process.env.PUBLIC_URL + '/assets/images/logo/1.png'} style={{ maxWidth: '140px' }} />
                      </div>
                      <h2 className="text-dark f-w-700">Supervisor <span style={{ color: '#0f626a' }}>Signup</span></h2>
                      <p className="text-muted">Create your teacher account to start managing attendance</p>
                    </div>
                    {error && <div className="col-12 alert alert-danger py-2">{error}</div>}
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input className="form-control" placeholder="First Name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
                        <label>First Name</label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input className="form-control" placeholder="Last Name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
                        <label>Last Name</label>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="form-floating">
                        <input className="form-control" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        <label>Email Address</label>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="form-floating position-relative">
                        <input
                          className="form-control"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <label>Create Password</label>
                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y border-0 me-2"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ zIndex: 10 }}
                        >
                          <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'} f-s-20`} style={{ color: '#0f626a' }}></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Department"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          required
                        />
                        <label>Department / Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn w-100 py-3 f-w-600 text-white" style={{ backgroundColor: '#0f626a', borderColor: '#0f626a' }} type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register as Supervisor'}
                      </button>
                    </div>
                    <div className="col-12 mt-4 text-center">
                      <p className="text-muted">Already registered? <Link className="f-w-600 decoration-none" style={{ color: '#0f626a' }} to="/sign-in">Sign In</Link></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-7 image-content-box d-none d-lg-flex flex-column justify-content-center bg-primary-grad p-5 order-1 order-lg-2">
              <div className="form-container text-center">
                <div className="signup-content mb-4 text-end">
                </div>
                <div className="text-start mt-5">
                  <h1 className="text-white f-w-800 display-5">Empower Your Classroom</h1>
                  <p className="text-white opacity-75 f-s-18">Automate attendance tracking with precision AI-based facial recognition technology.</p>
                </div>
                <div className="signup-bg-img mt-4">
                  <img alt="Sign Up" className="img-fluid rounded-4 shadow" src={process.env.PUBLIC_URL + '/assets/images/login/01.png'} />
                </div>
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
                .sign-up-bg { height: 100%; }
                
                /* Custom Borders to match SignIn */
                .form-control, .form-select {
                    border: 2px solid #0f626a !important;
                    border-radius: 10px !important;
                }
                .form-control:focus, .form-select:focus {
                    box-shadow: none;
                    border-color: #0f626a !important;
                }
                .form-floating > .form-control:focus ~ label,
                .form-floating > .form-control:not(:placeholder-shown) ~ label {
                    color: #0f626a !important;
                }
                /* Padding for eye icon */
                input[type="password"], input[type="text"].form-control {
                    padding-right: 45px !important;
                }
            `}} />
    </div>
  );
};

export default SignUp;
