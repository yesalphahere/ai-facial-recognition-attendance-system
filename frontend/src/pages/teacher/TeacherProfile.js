import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';
import { updateTeacherProfile, changeTeacherPassword } from '../../api';

const Settings = () => {
  const [userName] = useState(localStorage.getItem('user_name') || 'Administrator');
  const [userRole] = useState(localStorage.getItem('is_superuser') === 'true' ? 'Administrator' : (localStorage.getItem('user_role') || 'Teacher'));
  const [profileId] = useState(localStorage.getItem('profile_id') || '');

  // Local state for editable fields
  const [classroom, setClassroom] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [offTime, setOffTime] = useState('17:00');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Load persisted settings
    const savedClassroom = localStorage.getItem('teacher_classroom');
    const savedEmail = localStorage.getItem('user_email');
    const savedImage = localStorage.getItem('teacher_profile_image');
    if (savedClassroom) setClassroom(savedClassroom);
    if (savedEmail) setEmail(savedEmail);
    if (savedImage) setProfileImage(savedImage);

    // Default times from stats/settings
    const savedStart = localStorage.getItem('teacher_start_time');
    const savedOff = localStorage.getItem('teacher_off_time');
    if (savedStart) setStartTime(savedStart);
    if (savedOff) setOffTime(savedOff);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // 1. Persist locally first
    localStorage.setItem('teacher_classroom', classroom);
    localStorage.setItem('user_email', email);
    localStorage.setItem('teacher_start_time', startTime);
    localStorage.setItem('teacher_off_time', offTime);
    if (profileImage) {
      localStorage.setItem('teacher_profile_image', profileImage);
    }

    // Validate password match if password is being changed
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Mismatch',
          text: 'New password and Confirm password do not match.',
          confirmButtonColor: '#0f626a'
        });
        return;
      }
    }

    // 2. Update profile info
    const data = new FormData();
    data.append('email', email);
    data.append('department', classroom);
    data.append('default_start_time', startTime);
    data.append('default_off_time', offTime);
    if (imageFile) {
      data.append('profile_pic', imageFile);
    }

    try {
      if (profileId) {
        // Update profile info
        await updateTeacherProfile(profileId, data);

        // Update password separately if provided
        if (newPassword && newPassword.trim()) {
          await changeTeacherPassword(profileId, newPassword);
          setNewPassword('');
          setConfirmPassword('');
        }
      }

      // Dispatch a custom event so Header can update immediately if needed
      window.dispatchEvent(new Event('storage'));

      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your profile has been updated successfully.',
        confirmButtonColor: '#0f626a'
      });
    } catch (error) {
      console.error("Profile sync failed:", error);
      Swal.fire({
        icon: 'warning',
        title: 'Save Error',
        text: error.response?.data?.error || 'Failed to save settings. Please try again.',
        confirmButtonColor: '#0f626a'
      });
    }
  };

  return (
    <Layout>
      <div className="row g-4">
        {/* Profile Header */}
        <div className="col-12">
          <div className="card shadow-lg border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-primary-grad p-4 border-0">
              <div className="d-flex align-items-center gap-4">
                <div className="position-relative group-hover-avatar">
                  <div className="bg-white rounded-circle p-1 shadow-sm" style={{ width: '100px', height: '100px' }}>
                    <img
                      src={profileImage || process.env.PUBLIC_URL + '/assets/images/avatar/3.png'}
                      alt="Profile"
                      className="w-100 h-100 rounded-circle object-fit-cover"
                    />
                  </div>
                  {/* Edit Icon Overlay */}
                  <label htmlFor="p-image-upload" className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 rounded-circle w-100 h-100 d-flex align-items-center justify-content-center cursor-pointer opacity-0 hover-opacity-100 transition-opacity">
                    <i className="ph ph-camera text-white f-s-24"></i>
                  </label>
                  <input type="file" id="p-image-upload" className="d-none" accept="image/*" onChange={handleImageChange} />

                  <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white border-3" style={{ width: '20px', height: '20px' }}></div>
                </div>
                <div className="text-white">
                  <h3 className="mb-1 f-w-700 text-white">{userName}</h3>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-white-20 backdrop-blur px-3 py-2 text-uppercase f-s-10 text-white">{userRole}</span>
                    <span className="text-white f-s-14">| Identity ID: {profileId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white p-4 border-0">
              <h5 className="mb-0 f-w-700">Identity Configuration</h5>
              <p className="text-muted small mb-0">Ensure your contact details are up to date for official system reports.</p>
            </div>
            <div className="card-body p-4">
              <form className="app-form" onSubmit={handleSave}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">Display Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-user"></i></span>
                        <input className="form-control border-start-0 ps-3 text-muted custom-input" value={userName} readOnly type="text" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">Privilege Level</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-identification-badge"></i></span>
                        <input className="form-control border-start-0 ps-3 text-muted custom-input" value={userRole} readOnly type="text" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">Registered Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-envelope"></i></span>
                        <input
                          className="form-control border-start-0 ps-3 text-muted custom-input"
                          placeholder="admin@example.com"
                          type="email"
                          value={email}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">Assigned Classroom / Subject</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-chalkboard-teacher"></i></span>
                        <input
                          className="form-control border-start-0 ps-3 custom-input"
                          placeholder="e.g. Mathematics - Class 10A"
                          type="text"
                          value={classroom}
                          onChange={(e) => setClassroom(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12"><hr className="my-2 opacity-10" /></div>

                  <div className="col-12">
                    <h4 className="f-w-700 mb-0">{classroom === 'Administration' ? 'System Configuration' : 'Institutional Credentials'}</h4>
                    <p className="text-muted small">Update your {classroom === 'Administration' ? 'Global Admin' : 'Academic'} profile and security tokens.</p>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">Recognition Start Time</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-timer"></i></span>
                        <input
                          className="form-control border-start-0 ps-3 custom-input"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">Recognition Off Time</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-timer"></i></span>
                        <input
                          className="form-control border-start-0 ps-3 custom-input"
                          type="time"
                          value={offTime}
                          onChange={(e) => setOffTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12"><hr className="my-2 opacity-10" /></div>
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">New password</label>
                      <div className="input-group position-relative">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-lock"></i></span>
                        <input className="form-control border-start-0 ps-3 custom-input" placeholder="••••••••" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label f-w-600 mb-2">Confirm password</label>
                      <div className="input-group position-relative">
                        <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-lock"></i></span>
                        <input className="form-control border-start-0 ps-3 custom-input" placeholder="••••••••" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      </div>
                    </div>
                  </div> */}
                  <div className="col-12 text-end mt-5">
                    <button type="submit" className="btn btn-primary btn-lg px-5 shadow-sm text-white f-w-600" style={{ borderRadius: '10px' }}>
                      Save Settings
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
                .bg-primary-grad { background: linear-gradient(135deg, #0f626a 0%, #0a4a50 100%); }
                .bg-light-soft { background-color: #f8fbff; }
                .bg-light-primary-50 { background-color: #f0f5ff; }
                .bg-white-20 { background-color: rgba(255, 255, 255, 0.2); }
                .backdrop-blur { backdrop-filter: blur(8px); }
                .border-start-4-primary { border-left: 4px solid #0f626a !important; }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); }
                .object-fit-cover { object-fit: cover; }
                .hover-opacity-100:hover { opacity: 1 !important; }
                .cursor-pointer { cursor: pointer; }
                .transition-opacity { transition: opacity 0.3s ease; }
                
                /* Custom Input Fields */
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
    </Layout>
  );
};

export default Settings;
