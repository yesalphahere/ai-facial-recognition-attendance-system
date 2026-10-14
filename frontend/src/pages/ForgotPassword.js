import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your forgot password logic here
    console.log('Reset password for:', email);
    setSubmitted(true);
  };

  return (
    <div className="app-wrapper d-block">
      <div className="sign-in-bg">
        <div className="container main-container">
          <div className="row main-content-box">
            <div className="col-lg-7 image-content-box d-none d-lg-block">
              <div className="form-container">
                <div className="signup-content mt-4">
                  <span>
                    <img alt="Face System" className="img-fluid" src={process.env.PUBLIC_URL + '/assets/images/logo/1.png'} />
                  </span>
                </div>
                <div className="signup-bg-img">
                  <img alt="Forgot Password" className="img-fluid" src={process.env.PUBLIC_URL + '/assets/images/login/01.png'} />
                </div>
              </div>
            </div>
            <div className="col-lg-5 form-content-box">
              <div className="form-container">
                {!submitted ? (
                  <form className="app-form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-5 text-center text-lg-start">
                          <h2 className="text-white f-w-600">
                            Forgot <span className="text-dark">Password?</span>
                          </h2>
                          <p className="f-s-16 mt-2">
                            Enter your email address and we'll send you a link to reset your password
                          </p>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="email"
                            placeholder="Enter Your Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <label htmlFor="email">Email Address</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100 mt-3" type="submit">
                          Send Reset Link
                        </button>
                      </div>
                      <div className="col-12">
                        <div className="text-center mt-3">
                          <Link className="text-dark f-w-500 text-decoration-underline" to="/sign-in">
                            Back to Sign In
                          </Link>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="ph ph-check-circle text-success" style={{ fontSize: '64px' }}></i>
                    </div>
                    <h3 className="text-white mb-3">Check Your Email</h3>
                    <p className="text-dark mb-4">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <Link className="btn btn-primary" to="/sign-in">
                      Back to Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
