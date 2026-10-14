import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../../components/Layout';
import api, { fetchSessions, createSession, toggleSessionStatus, fetchAttendanceRecords, fetchStats, updateTeacherProfile } from '../../api';
import Swal from 'sweetalert2';

const AttendanceSession = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [newSession, setNewSession] = useState({
        camera_source: 'Webcam',
        camera_url: '',
        camera_port: '',
        start_time: '09:00',
        off_time: '17:00'
    });
    const [logs, setLogs] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const [cameraStream, setCameraStream] = useState(null);
    const isStoppingRef = useRef(false);
    const [showIPCameraModal, setShowIPCameraModal] = useState(false);
    const [cameraUrl, setCameraUrl] = useState('');
    const [cameraPort, setCameraPort] = useState('');
    const [testingConnection, setTestingConnection] = useState(false);

    // Dependencies need to be stable for useEffect
    const loadSessions = useCallback(async (preserveActive = false) => {
        try {
            const res = await fetchSessions();
            setSessions(res.data);

            // Only update active session if we're not forcefully preserving it (e.g. during creation)
            // or if we have no active session currently
            // Only update active session if we're not forcefully preserving it (e.g. during creation)
            if (!preserveActive) {
                const active = res.data.find(s => s.is_active);
                // Fix: Allow clearing active session (set to null) if none found
                // This ensures UI updates immediately when stopping a session
                setActiveSession(active || null);
            }

            // Fetch stats to get teacher defaults
            const statsRes = await fetchStats();
            if (statsRes.data.defaults) {
                setNewSession(prev => ({
                    ...prev,
                    start_time: statsRes.data.defaults.start_time.substring(0, 5),
                    off_time: statsRes.data.defaults.off_time.substring(0, 5)
                }));
            }
        } catch (error) {
            console.error("Error loading sessions or defaults:", error);
        }
    }, []);

    const loadLogs = useCallback(async () => {
        if (!activeSession) return;
        try {
            const res = await fetchAttendanceRecords();
            const currentRecords = activeSession
                ? res.data.filter(record => record.session === activeSession.id)
                : res.data;
            setLogs(currentRecords.slice(0, 8));
        } catch (error) {
            console.error("Error loading logs:", error);
        }
    }, [activeSession]);

    // Initial Load Only
    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    // Logs polling
    useEffect(() => {
        if (activeSession?.is_active) {
            loadLogs(); // Initial load
            const interval = setInterval(loadLogs, 5000);
            return () => clearInterval(interval);
        }
    }, [activeSession?.is_active, activeSession?.id, loadLogs]);


    const drawDetections = (detections) => {
        if (!overlayRef.current || !videoRef.current) return;
        const canvas = overlayRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        // Sync dimensions
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaleX = canvas.width / video.videoWidth;
        const scaleY = canvas.height / video.videoHeight;

        detections.forEach(det => {
            if (!det.box) return;
            const [x, y, w, h] = det.box;

            // Mirror coordinates for display (since video is mirrored)
            const mirroredX = canvas.width - (x * scaleX) - (w * scaleX);
            const rectY = y * scaleY;
            const rectW = w * scaleX;
            const rectH = h * scaleY;

            // Set styles
            ctx.strokeStyle = '#00f2ff'; // High-tech cyan
            ctx.lineWidth = 3;
            ctx.strokeRect(mirroredX, rectY, rectW, rectH);

            // Draw Label
            if (det.name || det.id) {
                ctx.fillStyle = '#00f2ff';
                ctx.font = 'bold 14px Lexend, Inter, sans-serif';
                const label = `${det.name || det.id} (${det.status})`;
                const textWidth = ctx.measureText(label).width;

                // Align label with the mirrored box
                const labelX = mirroredX;
                ctx.fillRect(labelX, rectY - 25, textWidth + 10, 25);
                ctx.fillStyle = '#000';
                ctx.fillText(label, labelX + 5, rectY - 7);
            }
        });

        // Fade out boxes after 2 seconds
        setTimeout(() => {
            if (overlayRef.current) {
                const clearCtx = overlayRef.current.getContext('2d');
                clearCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
            }
        }, 2000);
    };

    const captureAndSendFrame = useCallback(async () => {
        if (!videoRef.current || !activeSession || !activeSession.is_active) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frameData = canvas.toDataURL('image/jpeg', 0.6);

        try {
            const res = await api.post(`/sessions/${activeSession.id}/process_frame/`, { frame: frameData });

            if (res.data.detections) {
                drawDetections(res.data.detections);

                const marked = res.data.detections.some(d => d.status === 'Marked');
                if (marked) loadLogs();
            }
        } catch (error) {
            console.error("AI Processing Error:", error);
        }
    }, [activeSession, loadLogs]);

    // AI Frame Processing Logic
    useEffect(() => {
        console.log(`Frame Processing Check: isCameraOn=${isCameraOn}, activeSession=${activeSession?.id}, is_active=${activeSession?.is_active}`);

        if (isCameraOn && activeSession?.is_active) {
            console.log("Starting frame processing interval (every 3s)...");
            const interval = setInterval(captureAndSendFrame, 3000);

            return () => {
                console.log("Cleaning up frame processing interval");
                clearInterval(interval);
            };
        }
    }, [isCameraOn, activeSession?.is_active, activeSession?.id, captureAndSendFrame]);

    // Attach stream to video element when it mounts
    useEffect(() => {
        let timeout;
        if (isCameraOn && cameraStream && videoRef.current) {
            // Use a bit more aggressive polling/timeout to ensure mount
            const attachStream = () => {
                if (videoRef.current) {
                    videoRef.current.srcObject = cameraStream;
                    console.log("Camera stream attached to video element.");
                } else {
                    timeout = setTimeout(attachStream, 50);
                }
            };
            attachStream();
        }
        return () => { if (timeout) clearTimeout(timeout); };
    }, [isCameraOn, cameraStream]);

    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            setCameraStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    }, [cameraStream]);

    const startCamera = useCallback(async () => {
        // Clear existing stream tracks manually before requesting new one
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
        }

        const constraints = [
            { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } },
            { video: true } // Fallback
        ];

        let success = false;
        for (const constraint of constraints) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraint);
                setCameraStream(stream);
                setIsCameraOn(true);
                console.log("Hardware camera initialized successfully with:", constraint);
                success = true;
                break;
            } catch (e) {
                console.warn("Attempt failed for camera constraint:", constraint, e);
            }
        }

        if (!success) {
            Swal.fire({
                icon: 'error',
                title: 'Hardware Error',
                text: 'System could not initialize camera hardware. Please check if another app is using it or refresh.',
                confirmButtonColor: '#0f626a'
            });
        }
    }, [cameraStream]);

    // AUTO-ACTIVATION ENGINE: Check for scheduled sessions every minute
    useEffect(() => {
        const interval = setInterval(() => {
            if (!activeSession?.is_active && sessions.length > 0 && !isStoppingRef.current) {
                const now = new Date();
                const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

                const scheduled = sessions.find(s => {
                    // Fix: Exclude 'Manual Session' from auto-activation to prevent "zombie" restarts
                    // Only auto-start genuine scheduled classes
                    return s.is_active === false
                        && s.course_name !== 'Manual Session'
                        && currentTime >= s.start_time.substring(0, 5)
                        && currentTime <= s.off_time.substring(0, 5);
                });

                if (scheduled) {
                    console.log("Auto-activating scheduled session:", scheduled.course_name);
                    handleToggleSession(scheduled.id);
                }
            }
        }, 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession, sessions]);




    const handleCreateSession = async () => {
        // Immediate Start: Ignore time inputs, set for full day
        try {
            const profileId = localStorage.getItem('profile_id');
            const res = await createSession({
                ...newSession,
                camera_port: newSession.camera_port === "" ? null : newSession.camera_port,
                start_time: '00:00', // Manual session always allows full-day window
                off_time: '23:59',
                course_name: 'Manual Session',
                section_name: 'Default',
                teacher: profileId || 1,
                is_active: true
            });

            // Persist as defaults
            if (profileId) {
                const formData = new FormData();
                formData.append('default_start_time', newSession.start_time);
                formData.append('default_off_time', newSession.off_time);
                await updateTeacherProfile(profileId, formData);
            }
            setSessions([...sessions, res.data]);
            setActiveSession(res.data);

            // Auto-start camera
            await startCamera();

            Swal.fire({
                icon: 'success',
                title: 'Session Started',
                text: 'Live recognition session is now active.',
                confirmButtonColor: '#0f626a',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Session Start Error:", error.response || error);
            Swal.fire({
                icon: 'error',
                title: 'Session Failed',
                text: 'Failed to start session. Check console for details.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    const handleScheduleSession = async () => {
        if (!newSession.start_time || !newSession.off_time) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please set a valid time range for scheduling.',
                confirmButtonColor: '#0f626a'
            });
            return;
        }
        try {
            const profileId = localStorage.getItem('profile_id');
            const res = await createSession({
                ...newSession,
                camera_port: newSession.camera_port === "" ? null : newSession.camera_port,
                course_name: 'Scheduled Session',
                section_name: 'Default',
                teacher: profileId || 1,
                is_active: true
            });

            // Persist as defaults since user clicked "Set & Activate"
            if (profileId) {
                const formData = new FormData();
                formData.append('default_start_time', newSession.start_time);
                formData.append('default_off_time', newSession.off_time);
                await updateTeacherProfile(profileId, formData);
            }
            setSessions([...sessions, res.data]);
            setActiveSession(res.data);

            // Auto-start camera if within time range (simplified for now to just start)
            await startCamera();

            Swal.fire({
                icon: 'success',
                title: 'Session Scheduled',
                text: `Session active from ${newSession.start_time} to ${newSession.off_time}`,
                confirmButtonColor: '#0f626a'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Scheduling Failed',
                text: 'Failed to schedule session.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    const handleToggleSession = async (sessionId = null) => {
        const id = sessionId || activeSession?.id;
        if (!id) return;
        try {
            await toggleSessionStatus(id);
            await loadSessions();

            // If we just activated a session, start the camera
            const sessionsRes = await fetchSessions();
            const session = sessionsRes.data.find(s => s.id === id);
            if (session?.is_active) {
                await startCamera();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error toggling session status.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    const testCameraConnection = async () => {
        if (!cameraUrl) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Camera URL',
                text: 'Please enter camera URL first.',
                confirmButtonColor: '#0f626a'
            });
            return;
        }

        setTestingConnection(true);

        try {
            // Try to connect to camera stream
            const response = await api.post('/sessions/test-connection/', {
                camera_url: cameraUrl,
                camera_port: cameraPort || null
            });

            if (response.data.connected) {
                Swal.fire({
                    icon: 'success',
                    title: 'Connection Successful!',
                    text: 'Camera stream is reachable. You can now confirm and start session.',
                    confirmButtonColor: '#0f626a'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Connection Failed',
                    text: response.data.error || 'Could not connect to camera stream.',
                    confirmButtonColor: '#0f626a'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: error.response?.data?.error || 'Cannot reach camera stream',
                confirmButtonColor: '#0f626a'
            });
        } finally {
            setTestingConnection(false);
        }
    };

    return (
        <Layout>
            <div className="row g-4">
                {/* Header Section */}
                <div className="col-12">
                    <div className="card shadow-lg border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-primary-grad p-4 border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '55px', height: '55px' }}>
                                        <i className="ph ph-video-camera text-primary f-s-28"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-0 text-white f-w-700">AI Command Center</h4>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className={`badge ${activeSession?.is_active ? 'bg-success' : 'bg-white-20'} backdrop-blur px-3 text-white`}>
                                                {activeSession?.is_active ? '● LIVE MONITORING' : 'SYSTEM STANDBY'}
                                            </span>
                                            <span className="text-white small">| Advanced Facial Recognition Engine</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end d-none d-md-block">
                                    <h6 className="text-white mb-0">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h6>
                                    <small className="text-white-50">Local Intelligence Station</small>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4 bg-light-soft">
                            <div className="row g-4">

                                <div className="col-lg-2 col-md-6">
                                    <div className="form-group">
                                        <label className="form-label f-w-600 mb-2">Video Engine</label>
                                        <div className="input-group shadow-sm">
                                            <span className="input-group-text bg-white border-end-0"><i className="ph ph-webcam"></i></span>
                                            <select
                                                className="form-select border-start-0 ps-0"
                                                value={newSession.camera_source}
                                                onChange={(e) => {
                                                    if (e.target.value === 'IP_Camera') {
                                                        setShowIPCameraModal(true);
                                                    } else {
                                                        setNewSession({ ...newSession, camera_source: e.target.value, camera_url: '' });
                                                    }
                                                }}
                                            >
                                                <option value="Webcam">Webcam</option>
                                                <option value="IP_Camera" style={{ display: 'none' }}>IP Cam</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-6">
                                    <div className="form-group">
                                        <label className="form-label f-w-600 mb-2">Automatic Schedule</label>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="input-group shadow-sm flex-grow-1">
                                                <span className="input-group-text bg-white border-end-0"><i className="ph ph-clock"></i></span>
                                                <input type="time" className="form-control border-start-0 ps-0 border-end-0" value={newSession.start_time} onChange={(e) => setNewSession({ ...newSession, start_time: e.target.value })} />
                                                <span className="input-group-text bg-white border-start-0 border-end-0 p-1">-</span>
                                                <input type="time" className="form-control border-start-0 ps-0" value={newSession.off_time} onChange={(e) => setNewSession({ ...newSession, off_time: e.target.value })} />
                                            </div>
                                            <button onClick={handleScheduleSession} className="btn btn-light-primary border-primary-100 text-primary f-w-600 shadow-sm" style={{ whiteSpace: 'nowrap' }}>
                                                Set & Activate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 d-flex align-items-end justify-content-end gap-2">
                                    {activeSession?.is_active ? (
                                        <button
                                            onClick={async () => {
                                                isStoppingRef.current = true;
                                                stopCamera();
                                                await handleToggleSession();
                                                setTimeout(() => { isStoppingRef.current = false; }, 2000);
                                            }}
                                            className="btn btn-danger f-w-600 px-5 py-2 shadow-sm text-white"
                                        >
                                            <i className="ph ph-power me-1"></i> End Recognition Session
                                        </button>
                                    ) : (
                                        <button onClick={handleCreateSession} className="btn btn-primary f-w-600 px-5 py-2 shadow-sm text-white btn-lg-premium">
                                            <i className="ph ph-lightning me-1"></i> Start Recognition Session
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-lg-8">
                    <div className="card h-100 border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 f-w-700"><i className="ph ph-activity text-primary me-2"></i>Live Vision Dataset</h6>
                            <div className="badge bg-light-primary text-primary px-3 border border-primary-100">AI Active</div>
                        </div>
                        <div className="card-body p-0 position-relative bg-dark d-flex align-items-center justify-content-center" style={{ minHeight: '520px' }}>
                            {isCameraOn ? (
                                <div className="w-100 h-100 position-relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-100 h-100 object-fit-cover shadow-inner"
                                        style={{ transform: 'scaleX(-1)' }}
                                    />
                                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                                    <canvas
                                        ref={overlayRef}
                                        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
                                        style={{ zIndex: 5 }}
                                    />
                                    <div className="scan-line"></div>

                                    {/* Overlay Interface */}
                                    <div className="position-absolute top-0 start-0 w-100 h-100 p-4 d-flex flex-column justify-content-between pointer-events-none">
                                        <div className="d-flex justify-content-between">
                                            <div className="glass-panel text-white px-3 py-2 border border-white-10">
                                                <small className="d-block text-white-50 f-s-10 text-uppercase">AI Status</small>
                                                <span className="f-w-600 f-s-14">Processing 40ms</span>
                                            </div>
                                            <div className="glass-panel text-danger px-3 py-2 border border-danger-50 animate-pulse">
                                                <span className="f-w-700 f-s-14">LIVE ●</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto d-flex justify-content-center">
                                            <div className="glass-panel text-white px-4 py-2 border border-white-10 text-center">
                                                <i className="ph ph-scan f-s-24 mb-1"></i>
                                                <p className="mb-0 small">Scanning for Enrolled Biometrics</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-5">
                                    <div className="bg-white-10 rounded-circle p-4 mb-4 d-inline-flex backdrop-blur">
                                        <i className="ph ph-video-camera-slash text-white f-s-80 opacity-50"></i>
                                    </div>
                                    <h4 className="text-white f-w-600">Vision System Offline</h4>
                                    <p className="text-white-50 px-5">To begin facial identification, initialize your session settings and activate the hardware camera above.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="col-lg-4">
                    <div className="card h-100 border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white border-bottom p-3">
                            <h6 className="mb-0 f-w-700">Recognition Telemetry</h6>
                        </div>
                        <div className="card-body p-0">
                            <div className="p-3 bg-light-soft border-bottom">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <div className="p-3 bg-white rounded-3 shadow-sm border border-light">
                                            <h3 className="mb-0 text-primary f-w-700">{logs.length}</h3>
                                            <small className="text-muted text-uppercase f-s-10 f-w-700">Matched</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 bg-white rounded-3 shadow-sm border border-light">
                                            <h3 className="mb-0 text-success f-w-700">
                                                {logs.length > 0
                                                    ? Math.round(logs.reduce((acc, log) => acc + (log.confidence_score || 0), 0) / logs.length)
                                                    : 0}%
                                            </h3>
                                            <small className="text-muted text-uppercase f-s-10 f-w-700">Accuracy</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="telemetry-log p-0" style={{ maxHeight: '430px', overflowY: 'auto' }}>
                                <ul className="list-group list-group-flush">
                                    {logs.length > 0 ? logs.map((log, idx) => (
                                        <li key={idx} className="list-group-item d-flex align-items-center p-3 border-light-soft hover-bg-light transition-all">
                                            <div className="avatar-box me-3">
                                                <div className="bg-primary-grad text-white rounded-4 w-45 h-45 d-flex-center f-w-700 shadow-sm">
                                                    {log.student_name ? log.student_name.charAt(0) : 'S'}
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden">
                                                <div className="d-flex align-items-center gap-2">
                                                    <h6 className="mb-0 f-s-14 text-dark f-w-600 txt-ellipsis-1">{log.student_name}</h6>
                                                    <span className="badge bg-light-success text-success border border-success-subtle f-s-10 py-1">Matched</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                    <div className="progress flex-grow-1" style={{ height: '4px', maxWidth: '50px' }}>
                                                        <div className="progress-bar bg-success" style={{ width: `${log.confidence_score ? Math.round(log.confidence_score) : '90'}%` }}></div>
                                                    </div>
                                                    <small className="f-w-700 text-success" style={{ fontSize: '10px' }}>{log.confidence_score ? Math.round(log.confidence_score) : '90'}%</small>
                                                </div>
                                            </div>
                                            <div className="text-end ms-2">
                                                <span className="badge bg-light f-s-11 text-dark border border-light">{log.check_in_time}</span>
                                            </div>
                                        </li>
                                    )) : (
                                        <div className="text-center py-5 opacity-50">
                                            <div className="spinner-border text-primary spinner-border-sm mb-3"></div>
                                            <p className="mb-0 small f-w-500">Awaiting identifications...</p>
                                        </div>
                                    )}
                                </ul>
                            </div>
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
                .btn-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; border: 1px solid rgba(15, 98, 106, 0.2) !important; }
                .btn-light-primary:hover { background-color: #0f626a !important; color: white !important; }
                .border-primary-100 { border-color: rgba(15, 98, 106, 0.2) !important; }
                .bg-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; }
                .bg-light-success { background-color: rgba(40, 167, 69, 0.1) !important; color: #28a745 !important; }
                .spinner-border.text-primary { color: #0f626a !important; }
                
                .bg-white-20 { background-color: rgba(255, 255, 255, 0.2); }
                .glass-panel { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); border-radius: 12px; }
                .backdrop-blur { backdrop-filter: blur(8px); }
                .white-10 { border-color: rgba(255, 255, 255, 0.1); }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
                .btn-lg-premium { border-radius: 12px; padding: 12px 30px; }
                .w-45 { width: 45px; } .h-45 { height: 45px; }
                .scan-line {
                    position: absolute; width: 100%; height: 2px;
                    background: rgba(0, 255, 255, 0.5); box-shadow: 0 0 10px #0ff;
                    animation: scan 3s linear infinite; z-index: 10;
                }
                @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
                .hover-bg-light:hover { background-color: #f1f6ff; }
                .telemetry-log::-webkit-scrollbar { width: 4px; }
                .telemetry-log::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
            `}} />

            {/* IP Camera Modal */}
            {showIPCameraModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header bg-primary-grad border-0 p-4">
                                <div>
                                    <h5 className="modal-title text-white f-w-700 mb-0">
                                        <i className="ph ph-camera text-white me-2"></i>Connect Camera Stream
                                    </h5>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowIPCameraModal(false);
                                        setCameraUrl('');
                                        setCameraPort('');
                                        setNewSession({ ...newSession, camera_source: 'Webcam' });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <p className="text-muted mb-4">
                                    <i className="ph ph-info me-2"></i>
                                    Enter your camera stream URL and port to connect.
                                </p>

                                {/* Camera URL Input */}
                                <div className="mb-3">
                                    <label className="form-label f-w-600">Camera Stream URL</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="ph ph-link"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-0 border-primary-100"
                                            placeholder="e.g., rtsp://192.168.1.12:8554/stream"
                                            value={cameraUrl}
                                            onChange={(e) => setCameraUrl(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <small className="text-muted d-block mt-1">
                                        Enter the full URL including protocol (rtsp://, http://, etc.)
                                    </small>
                                </div>

                                {/* Port Input */}
                                <div className="mb-4">
                                    <label className="form-label f-w-600">Port (Optional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="ph ph-hash"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-0 border-primary-100"
                                            placeholder="Leave empty if included in URL"
                                            value={cameraPort}
                                            onChange={(e) => setCameraPort(e.target.value)}
                                        />
                                    </div>
                                    <small className="text-muted d-block mt-1">
                                        If URL doesn't include port, enter it here (e.g., 8554, 8080)
                                    </small>
                                </div>
                            </div>

                            <div className="modal-footer border-top p-4 bg-light-soft d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-light border-primary-100"
                                    onClick={() => {
                                        setShowIPCameraModal(false);
                                        setCameraUrl('');
                                        setCameraPort('');
                                        setNewSession({ ...newSession, camera_source: 'Webcam' });
                                    }}
                                >
                                    <i className="ph ph-x me-1"></i> Cancel
                                </button>
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        disabled={!cameraUrl || testingConnection}
                                        onClick={testCameraConnection}
                                    >
                                        {testingConnection ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Testing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ph ph-plugs me-1"></i> Test Connection
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={!cameraUrl}
                                        onClick={() => {
                                            setNewSession({
                                                ...newSession,
                                                camera_source: 'IP_Camera',
                                                camera_url: cameraUrl,
                                                camera_port: cameraPort || null
                                            });
                                            setShowIPCameraModal(false);
                                            setCameraUrl('');
                                            setCameraPort('');

                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Camera Connected',
                                                text: 'Your camera is configured. Click "Start Recognition Session" now!',
                                                confirmButtonColor: '#0f626a',
                                                timer: 2000
                                            });
                                        }}
                                    >
                                        <i className="ph ph-check me-1"></i> Connect Camera
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AttendanceSession;
