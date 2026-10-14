import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import { fetchStudentProfile, updateStudentProfile } from '../../api';
import Swal from 'sweetalert2';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        phone_number: ''
    });

    const userName = localStorage.getItem('user_name') || 'Student User';
    const profileId = localStorage.getItem('profile_id'); // Use DB ID (numbers) not student_id (string)

    const loadProfile = useCallback(async () => {
        try {
            const res = await fetchStudentProfile(profileId);
            setProfile(res.data);
            setFormData({
                address: res.data.address || '',
                phone_number: res.data.phone_number || ''
            });

            if (res.data.profile_pic) {
                setProfileImage(res.data.profile_pic);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('address', formData.address);
        data.append('phone_number', formData.phone_number);
        if (imageFile) {
            // Quality is preserved as we send the original file
            data.append('profile_pic', imageFile);
        }

        try {
            await updateStudentProfile(profileId, data);
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your details have been saved successfully.',
                confirmButtonColor: '#0f626a'
            });
            // Reload to ensure data consistency
            loadProfile();
        } catch (error) {
            console.error("Update failed:", error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Could not save changes. Please try again.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    if (loading) return (
        <Layout>
            <div className="d-flex-center vh-100 flex-column gap-3">
                <div className="spinner-border text-primary" role="status"></div>
                <span className="text-secondary f-s-14">Synchronizing Profile Data...</span>
            </div>
        </Layout>
    );

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
                                            src={profileImage || (process.env.PUBLIC_URL + '/assets/images/avatar/5.png')}
                                            className="rounded-circle w-100 h-100 object-fit-cover"
                                            alt="Student avatar"
                                        />
                                    </div>
                                    {/* Edit Icon Overlay */}
                                    <label htmlFor="s-image-upload" className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 rounded-circle w-100 h-100 d-flex align-items-center justify-content-center cursor-pointer opacity-0 hover-opacity-100 transition-opacity">
                                        <i className="ph ph-camera text-white f-s-24"></i>
                                    </label>
                                    <input type="file" id="s-image-upload" className="d-none" accept="image/*" onChange={handleImageChange} />

                                    <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white border-3" style={{ width: '20px', height: '20px' }}></div>
                                </div>
                                <div className="text-white">
                                    <h3 className="mb-1 f-w-700 text-white">{userName}</h3>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-white-20 backdrop-blur px-3 py-2 text-uppercase f-s-10 text-white">Student</span>
                                        <span className="text-white f-s-14">| Academic ID: {profile?.student_id || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white p-4 border-0">
                            <h5 className="mb-0 f-w-700">Official Records</h5>
                            <p className="text-muted small mb-0">View your academic and personal details.</p>
                        </div>
                        <div className="card-body p-4">
                            <form className="app-form" onSubmit={handleUpdate}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label f-w-600 mb-2">Student Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-user"></i></span>
                                                <input className="form-control border-start-0 ps-3 text-muted custom-input" value={userName} readOnly type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label f-w-600 mb-2">Contact Email</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-envelope"></i></span>
                                                <input className="form-control border-start-0 ps-3 text-muted custom-input" value={profile?.user?.email || 'N/A'} readOnly type="email" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label f-w-600 mb-2">Mobile Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-phone"></i></span>
                                                <input
                                                    className="form-control border-start-0 ps-3 custom-input"
                                                    value={formData.phone_number}
                                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                    placeholder="+1 (555) 000-0000"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="form-label f-w-600 mb-2">Residential Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0 custom-input-icon"><i className="ph ph-map-pin"></i></span>
                                                <textarea
                                                    className="form-control border-start-0 ps-3 custom-input"
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    placeholder="Enter your current address"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 text-end mt-5">
                                        <button className="btn btn-primary btn-lg px-5 shadow-sm text-white f-w-600" style={{ borderRadius: '10px' }}>
                                            Update Profile
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
                .bg-white-20 { background-color: rgba(255, 255, 255, 0.2); }
                .backdrop-blur { backdrop-filter: blur(8px); }
                .object-fit-cover { object-fit: cover; }
                .hover-opacity-100:hover { opacity: 1 !important; }
                .cursor-pointer { cursor: pointer; }
                .transition-opacity { transition: opacity 0.3s ease; }
                
                /* Custom Input Fields */
                .custom-input {
                    border: 2px solid #0f626a !important;
                    border-radius: 0 10px 10px 0 !important;
                    padding: 12px 15px;
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

export default StudentProfile;
