import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import { fetchStudents, registerStudent, deleteStudent, updateStudent, toggleStudentStatus } from '../../api';
import Swal from 'sweetalert2';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        roleNumber: '',
        email: '',
        password: ''
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dataVersion, setDataVersion] = useState(0); // For forcing table remounts

    // Camera Enrollment States
    const [enrollmentMode, setEnrollmentMode] = useState('gallery'); // 'gallery' or 'camera'
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    const captureInstructions = [
        "Position your face in the center (FRONT VIEW)",
        "Turn your face slightly to the LEFT",
        "Turn your face slightly to the RIGHT",
        "Tilt your head slightly UP",
        "Tilt your head slightly DOWN",
        "Give a slight SMILE or neutral expression",
        "Move slightly CLOSER to the camera (Optional)",
        "Move slightly FURTHER back (Optional)",
        "Tilt head towards LEFT shoulder (Optional)",
        "Tilt head towards RIGHT shoulder (Optional)"
    ];

    const loadStudents = useCallback(async () => {
        try {
            const res = await fetchStudents();
            setStudents(res.data);
        } catch (error) {
            console.error("Error loading students:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => {
            const combined = [...prev, ...files].slice(0, 10);
            previews.forEach(url => URL.revokeObjectURL(url));
            const newPreviews = combined.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
            return combined;
        });
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
            });
            setCameraStream(stream);
            setIsCameraOn(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Camera Error',
                text: 'Unable to access camera. Please check permissions.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsCameraOn(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], `capture_${activeStep + 1}.jpg`, { type: 'image/jpeg' });

            setImages(prev => {
                const newImages = [...prev];
                newImages[activeStep] = file;

                // Cleanup old preview if it exists
                if (previews[activeStep]) URL.revokeObjectURL(previews[activeStep]);

                const newPreviews = [...previews];
                newPreviews[activeStep] = URL.createObjectURL(file);
                setPreviews(newPreviews);

                return newImages;
            });

            if (activeStep < 9) {
                setActiveStep(prev => prev + 1);
            } else {
                stopCamera();
                Swal.fire({
                    icon: 'success',
                    title: 'All Captures Done',
                    text: '10 images captured successfully. You can now enroll.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }, 'image/jpeg', 0.9);
    };

    const toggleMode = (mode) => {
        if (mode === 'camera') {
            // Validate basic details first
            if (!formData.name || !formData.roleNumber || !formData.email || !formData.username || !formData.password) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Details Required',
                    text: 'Please fill in all student details before starting live capture.',
                    confirmButtonColor: '#0f626a'
                });
                return;
            }
            if (!isCameraOn) startCamera();
        } else if (mode === 'gallery' && isCameraOn) {
            stopCamera();
        }
        setEnrollmentMode(mode);
        if (mode === 'camera') setActiveStep(images.filter(img => img).length);
    };

    // Fix: Ensure camera stream attaches when video element is ready
    useEffect(() => {
        if (isCameraOn && cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [isCameraOn, cameraStream]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Incomplete',
                text: 'Please provide at least 6 face images.',
                confirmButtonColor: '#0f626a'
            });
            return;
        }
        setSubmitting(true);
        const data = new FormData();
        data.append('student_id', formData.roleNumber);
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        const names = formData.name.split(' ');
        data.append('first_name', names[0] || '');
        data.append('last_name', names.slice(1).join(' ') || '');

        images.forEach(img => {
            data.append('images', img);
        });

        try {
            const res = await registerStudent(data);
            const newStudent = res.data;

            // Seamless AJAX update: Add the new student to the top of the list locally
            setStudents(prevStudents => [newStudent, ...prevStudents]);
            setDataVersion(v => v + 1);

            Swal.fire({
                icon: 'success',
                title: 'Enrolled!',
                text: 'Student has been registered and biometrics are saved.',
                confirmButtonColor: '#0f626a'
            });

            setFormData({ name: '', username: '', roleNumber: '', email: '', password: '' });
            setImages([]);
            setPreviews([]);
        } catch (error) {
            console.error("Registration error:", error);
            const errorMsg = error.response?.data?.error || "Failed to register student.";
            Swal.fire({
                icon: 'error',
                title: 'Enrollment Failed',
                text: errorMsg,
                confirmButtonColor: '#0f626a'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This student and all their biometrics will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0f626a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteStudent(id);
                // Locally update state for immediate feedback
                setStudents(prev => prev.filter(s => s.id !== id));
                setDataVersion(v => v + 1);

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Student has been removed.',
                    icon: 'success',
                    confirmButtonColor: '#0f626a'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: 'Unable to delete student record.',
                    confirmButtonColor: '#0f626a'
                });
            }
        }
    };

    const handleEdit = async (student) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Student Details',
            html: `
                <div class="text-start">
                    <label class="form-label f-w-600 mb-1">Full Name</label>
                    <input id="swal-input1" class="form-control mb-3" placeholder="Full Name" value="${student.user.first_name} ${student.user.last_name}">
                    
                    <label class="form-label f-w-600 mb-1">Registration ID</label>
                    <input id="swal-input2" class="form-control mb-3" placeholder="Registration ID" value="${student.student_id}">
                    
                    <label class="form-label f-w-600 mb-1">Address</label>
                    <textarea id="swal-input3" class="form-control mb-3" placeholder="Address">${student.address || ''}</textarea>
                    
                    <label class="form-label f-w-600 mb-1">Phone Number</label>
                    <input id="swal-input4" class="form-control mb-3" placeholder="Phone Number" value="${student.phone_number || ''}">

                    <label class="form-label f-w-600 mb-1">Email Address</label>
                    <input id="swal-input5" class="form-control mb-3" placeholder="Email" value="${student.user.email || ''}">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#0f626a',
            preConfirm: () => {
                return {
                    name: document.getElementById('swal-input1').value,
                    student_id: document.getElementById('swal-input2').value,
                    address: document.getElementById('swal-input3').value,
                    phone_number: document.getElementById('swal-input4').value,
                    email: document.getElementById('swal-input5').value
                }
            }
        });

        if (formValues) {
            try {
                const res = await updateStudent(student.id, formValues);
                setStudents(prev => prev.map(s => s.id === student.id ? res.data : s));
                setDataVersion(v => v + 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Student records updated successfully.',
                    confirmButtonColor: '#0f626a'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: error.response?.data?.error || 'Failed to sync updates to server.',
                    confirmButtonColor: '#0f626a'
                });
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await toggleStudentStatus(id);
            if (res.data.status === 'success') {
                setStudents(prev => prev.map(s => s.id === id ? { ...s, is_active: res.data.is_active } : s));
                setDataVersion(v => v + 1);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: 'Could not update student status.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    return (
        <Layout>
            <div className="row">
                <div className="col-lg-12 mb-4">
                    <div className="card shadow-lg border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-primary-grad p-4 border-0">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '50px', height: '50px' }}>
                                    <i className="ph ph-user-plus text-primary f-s-24"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0 text-white">Enroll New Student</h4>
                                    <p className="text-white mb-0 small f-w-400">Add profile details and face biometric data</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4 bg-light-soft">
                            <form className="row g-4" onSubmit={handleSubmit}>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label f-w-600 mb-2">Student Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0"><i className="ph ph-user"></i></span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 ps-0"
                                                placeholder="e.g. John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label f-w-600 mb-2">Registration / ID Number</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0"><i className="ph ph-identification-card"></i></span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 ps-0"
                                                placeholder="e.g. 2024-CS-01"
                                                value={formData.roleNumber}
                                                onChange={(e) => setFormData({ ...formData, roleNumber: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label f-w-600 mb-2">Institutional Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0"><i className="ph ph-envelope"></i></span>
                                            <input
                                                type="email"
                                                className="form-control border-start-0 ps-0"
                                                placeholder="student@university.edu"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label f-w-600 mb-2">System Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0"><i className="ph ph-at"></i></span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 ps-0"
                                                placeholder="username.student"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label f-w-600 mb-2">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0"><i className="ph ph-lock"></i></span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control border-start-0 ps-0"
                                                placeholder="Set secure password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className="btn border border-start-0 bg-white"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ borderLeft: 'none' }}
                                            >
                                                <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'} f-s-18`} style={{ color: '#0f626a' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="biometric-setup p-4 border border-dashed rounded-4 bg-white shadow-sm position-relative overflow-hidden">
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div>
                                                <h6 className="f-w-600 mb-0">Biometric Face Setup</h6>
                                                <p className="text-muted small mb-0">Select your preferred enrollment method</p>
                                            </div>
                                            <div className="btn-group shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${enrollmentMode === 'gallery' ? 'btn-primary' : 'btn-light'}`}
                                                    onClick={() => toggleMode('gallery')}
                                                >
                                                    <i className="ph ph-image me-1"></i> Gallery
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${enrollmentMode === 'camera' ? 'btn-primary' : 'btn-light'}`}
                                                    onClick={() => toggleMode('camera')}
                                                >
                                                    <i className="ph ph-camera me-1"></i> Live Capture
                                                </button>
                                            </div>
                                        </div>

                                        {enrollmentMode === 'gallery' ? (
                                            <div className="gallery-upload-area">
                                                <div className="image-uploader-zone text-center p-3 border rounded-3 bg-light-soft mb-3">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        id="face-upload"
                                                        className="d-none"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />
                                                    <label htmlFor="face-upload" className="mb-0 cursor-pointer d-block">
                                                        <i className="ph ph-cloud-arrow-up f-s-40 text-primary mb-2"></i>
                                                        <p className="mb-1 f-w-600">Click to Browse Images</p>
                                                        <p className="small text-muted mt-2 mb-0">At least 6 images required (Max 10)</p>
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="camera-capture-area">
                                                <div className="row g-3">
                                                    <div className="col-md-7">
                                                        <div className="position-relative bg-dark rounded-3 overflow-hidden shadow-inner" style={{ aspectRatio: '4/3' }}>
                                                            {isCameraOn ? (
                                                                <>
                                                                    <video ref={videoRef} autoPlay muted playsInline className="w-100 h-100 object-fit-cover" style={{ transform: 'scaleX(-1)' }} />
                                                                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                                                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3 pointer-events-none">
                                                                        <div className="d-flex justify-content-between">
                                                                            <span className="badge bg-danger-transparent backdrop-blur border border-danger-50 text-danger px-3 py-2 animate-pulse">
                                                                                LIVE CAM
                                                                            </span>
                                                                            <span className="badge bg-dark-transparent backdrop-blur text-white px-3 py-2">
                                                                                Capture Image {activeStep + 1} of 10
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <div className="instruction-box bg-dark-transparent backdrop-blur text-white p-2 rounded-3 border border-white-10 shadow-lg">
                                                                                <p className="mb-0 f-w-600 f-s-14">{captureInstructions[activeStep]}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="face-guide"></div>
                                                                </>
                                                            ) : (
                                                                <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white p-4 text-center">
                                                                    <i className="ph ph-video-camera-slash f-s-48 mb-3 opacity-20"></i>
                                                                    <p className="mb-3">Camera is currently inactive</p>
                                                                    <button type="button" onClick={startCamera} className="btn btn-primary btn-sm">Start Camera</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="mt-3 text-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-lg rounded-circle p-3 shadow-lg"
                                                                onClick={capturePhoto}
                                                                disabled={!isCameraOn || images.length >= 10}
                                                                style={{ width: '64px', height: '64px' }}
                                                            >
                                                                <i className="ph ph-camera f-s-28"></i>
                                                            </button>
                                                            <p className="mt-2 small text-muted">Click to capture Step {activeStep + 1}</p>
                                                        </div>
                                                        {images.length >= 6 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-warning rounded-pill mt-3 w-100 py-2 f-w-600 shadow-sm"
                                                                onClick={() => {
                                                                    stopCamera();
                                                                    Swal.fire({
                                                                        icon: 'success',
                                                                        title: 'Capture Complete',
                                                                        text: 'Minimum required images captured. You can now enroll.',
                                                                        timer: 2000,
                                                                        showConfirmButton: false
                                                                    });
                                                                }}
                                                            >
                                                                Finish Early & Enroll
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="col-md-5">
                                                        <h7 className="f-w-600 mb-2 d-block">Capture Progress</h7>
                                                        <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => (
                                                                <div
                                                                    key={step}
                                                                    className={`capture-thumb position-relative rounded-2 border ${activeStep === step ? 'border-primary ring-active' : 'border-light-subtle'}`}
                                                                    style={{ aspectRatio: '1/1', cursor: 'pointer', background: '#f8f9fa' }}
                                                                    onClick={() => setActiveStep(step)}
                                                                >
                                                                    {previews[step] ? (
                                                                        <img src={previews[step]} className="w-100 h-100 object-fit-cover rounded-2" alt={`Step ${step + 1}`} />
                                                                    ) : (
                                                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                                                                            {step + 1}
                                                                        </div>
                                                                    )}
                                                                    {previews[step] && (
                                                                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle m-1" style={{ width: '12px', height: '12px' }}></div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="alert alert-info mt-3 p-2 small border-0 bg-light-primary text-primary">
                                                            <i className="ph ph-info me-1"></i> Ensure good lighting and a plain background for best results.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="d-flex align-items-center justify-content-between mt-4 pb-2 border-top pt-3">
                                            <div className="text-muted small">
                                                <i className="ph ph-images-square me-1"></i>
                                                Captured: <strong>{images.filter(img => img).length}</strong> / 10
                                            </div>
                                            {previews.length > 0 && enrollmentMode === 'gallery' && (
                                                <div className="preview-gallery d-flex gap-2 overflow-auto ps-2" style={{ maxWidth: '70%' }}>
                                                    {previews.map((url, i) => (
                                                        <div key={i} className="preview-item flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                                                            <img src={url} alt="Preview" className="w-100 h-100 object-fit-cover rounded-3 border shadow-sm" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-primary f-w-600 px-5 btn-lg shadow-sm" disabled={submitting}>
                                        {submitting ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Enrolling...</>
                                        ) : 'Enroll Student'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white p-4 d-flex justify-content-between align-items-center border-bottom">
                            <h5 className="mb-0 f-w-700">Student Enrollment Directory</h5>
                        </div>
                        <div className="card-body p-4">
                            {loading ? (
                                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <DataTable key={dataVersion}>
                                    <thead className="table-light">
                                        <tr className="small text-uppercase text-muted">
                                            <th className="ps-4">Registration ID</th>
                                            <th>Full Name</th>
                                            <th>Biometric Data</th>
                                            <th>Acc. Status</th>
                                            <th className="text-end pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.id}>
                                                <td className="ps-4 f-w-600 text-primary">{student.student_id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="bg-light-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                            <span className="small f-w-700 text-primary">{student.user.first_name ? student.user.first_name[0] : student.student_id[0]}</span>
                                                        </div>
                                                        {student.user.first_name} {student.user.last_name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="progress flex-grow-1" style={{ height: '6px', width: '60px' }}>
                                                            <div
                                                                className={`progress-bar ${student.img6 ? 'bg-success' : 'bg-warning'}`}
                                                                style={{ width: `${student.img6 ? 100 : 50}%` }}
                                                            ></div>
                                                        </div>
                                                        <small className="f-w-600">{student.img6 ? '6/6' : 'Incomplete'}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className={`badge ${student.is_active ? 'bg-light-success text-success' : 'bg-light-danger text-danger'}`} style={{ minWidth: '70px' }}>
                                                            {student.is_active ? 'Active' : 'Disabled'}
                                                        </span>
                                                        <button
                                                            onClick={() => handleToggleStatus(student.id)}
                                                            className={`btn btn-sm btn-icon ${student.is_active ? 'btn-light-secondary' : 'btn-light-success'} border-0`}
                                                            title={student.is_active ? 'Disable' : 'Enable'}
                                                            style={{ padding: '2px 5px' }}
                                                        >
                                                            <i className={`ph ${student.is_active ? 'ph-toggle-left' : 'ph-toggle-right'} f-s-20`}></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <button
                                                        onClick={() => handleEdit(student)}
                                                        className="btn btn-icon btn-sm btn-light-primary me-2"
                                                    >
                                                        <i className="ph ph-note-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student.id)}
                                                        className="btn btn-icon btn-sm btn-light-danger"
                                                    >
                                                        <i className="ph ph-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </DataTable>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .bg-primary-grad { background: linear-gradient(135deg, #0f626a 0%, #0a4a50 100%); }
                .bg-light-soft { background-color: #f8fbff; }
                
                /* Teal Overrides */
                .text-primary { color: #0f626a !important; }
                .bg-primary { background-color: #0f626a !important; }
                .btn-primary { background-color: #0f626a !important; border-color: #0f626a !important; color: white !important; }
                .btn-primary:hover { background-color: #0a4a50 !important; border-color: #0a4a50 !important; }
                .bg-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; }
                .btn-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; border: 1px solid rgba(15, 98, 106, 0.2) !important; }
                .btn-light-primary:hover { background-color: #0f626a !important; color: white !important; }
                .spinner-border.text-primary { color: #0f626a !important; }
                
                .cursor-pointer { cursor: pointer; }
                .btn-lg { border-radius: 12px; }
                .btn-icon { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; }
                .object-fit-cover { object-fit: cover; }
                .biometric-setup { transition: transform 0.2s; }
                .biometric-setup:hover { transform: translateY(-2px); }
                .preview-gallery::-webkit-scrollbar { height: 4px; }
                .preview-gallery::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
                
                .bg-dark-transparent { background: rgba(0, 0, 0, 0.6); }
                .bg-danger-transparent { background: rgba(220, 53, 69, 0.2); }
                .instruction-box { min-width: 250px; }
                .face-guide {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50%; height: 60%;
                    border: 2px dashed rgba(255, 255, 255, 0.3);
                    border-radius: 50% / 50%;
                    pointer-events: none;
                }
                .ring-active { ring: 3px solid #0f626a; box-shadow: 0 0 0 3px rgba(15, 98, 106, 0.3); }
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}} />
        </Layout>
    );
};

export default StudentManagement;
