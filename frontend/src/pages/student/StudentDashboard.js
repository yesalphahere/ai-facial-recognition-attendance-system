import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import { fetchAttendanceRecords } from '../../api';

const StudentDashboard = () => {
    const [personalRecords, setPersonalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorStatus, setErrorStatus] = useState(null);

    // Use the logged-in student's ID from localStorage
    const studentId = localStorage.getItem('student_id') || "";

    useEffect(() => {
        const loadData = async () => {
            try {
                setErrorStatus(null);
                const res = await fetchAttendanceRecords();
                const filtered = res.data.filter(r => r.student_id === studentId);
                setPersonalRecords(filtered);
            } catch (error) {
                console.error("Error loading student records:", error);
                setErrorStatus("Identity Sync Failed. Refresh or re-login.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [studentId]);

    const stats = {
        total: personalRecords.length,
        present: personalRecords.filter(r => r.status === 'Present').length,
        percent: personalRecords.length > 0
            ? Math.round((personalRecords.filter(r => r.status === 'Present').length / personalRecords.length) * 100) + "%"
            : "0%"
    };

    return (
        <Layout>
            <div className="row">
                {errorStatus && (
                    <div className="col-12 mb-3">
                        <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center">
                            <i className="ph ph-warning-circle f-s-20 me-2"></i>
                            <div>{errorStatus}</div>
                        </div>
                    </div>
                )}
                <div className="col-12 mb-4">
                    <h4 className="main-title">Student Dashboard</h4>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-primary-grad p-3 rounded-4 shadow-sm">
                                    <i className="ph ph-books text-white f-s-24"></i>
                                </div>
                                <span className="badge bg-light-primary text-primary px-3 py-2 border-primary-100 border">Total Classes</span>
                            </div>
                            <h2 className="mb-1 f-w-700">{stats.total}</h2>
                            <p className="text-secondary mb-0 f-s-14">Registered Sessions</p>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-success-grad p-3 rounded-4 shadow-sm">
                                    <i className="ph ph-check-circle text-white f-s-24"></i>
                                </div>
                                <span className="badge bg-light-success text-success px-3 py-2 border-success-100 border">Present</span>
                            </div>
                            <h2 className="mb-1 f-w-700 text-success">{stats.present}</h2>
                            <p className="text-secondary mb-0 f-s-14">Sessions Attended</p>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-danger-grad p-3 rounded-4 shadow-sm">
                                    <i className="ph ph-calendar-x text-white f-s-24"></i>
                                </div>
                                <span className="badge bg-light-danger text-danger px-3 py-2 border-danger-100 border">Today's Status</span>
                            </div>
                            {(() => {
                                const todayStr = new Date().toISOString().split('T')[0];
                                const todayRecord = personalRecords.find(r => r.session_detail && r.session_detail.date === todayStr);
                                let statusText = "No Class";
                                let statusColor = "text-secondary";

                                if (todayRecord) {
                                    if (todayRecord.status === 'Present') {
                                        statusText = "Present";
                                        statusColor = "text-success";
                                    } else {
                                        statusText = "Absent";
                                        statusColor = "text-danger";
                                    }
                                }

                                return (
                                    <>
                                        <h2 className={`mb-1 f-w-700 ${statusColor}`}>{statusText}</h2>
                                        <p className="text-secondary mb-0 f-s-14">Attendance Verification</p>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-info-grad p-3 rounded-4 shadow-sm">
                                    <i className="ph ph-trend-up text-white f-s-24"></i>
                                </div>
                                <span className="badge bg-light-info text-info px-3 py-2 border-info-100 border">Rate</span>
                            </div>
                            <h2 className="mb-1 f-w-700 text-info">{stats.percent}</h2>
                            <p className="text-secondary mb-0 f-s-14">Attendance Rate</p>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="col-12 mt-4">
                    <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 f-w-700">Weekly Attendance</h5>
                            <div className="badge bg-light text-dark-500 border">Last 7 Days</div>
                        </div>
                        <div className="card-body p-4">
                            <div className="chart-container-premium d-flex align-items-end justify-content-between h-200">
                                {(() => {
                                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    const last7Days = [];
                                    const today = new Date();
                                    for (let i = 6; i >= 0; i--) {
                                        const d = new Date();
                                        d.setDate(today.getDate() - i);
                                        const dayName = days[d.getDay()];
                                        const dateStr = d.toISOString().split('T')[0];
                                        // Check if present in ANY session that day
                                        const isPresent = personalRecords.some(r => r.session_detail && r.session_detail.date === dateStr && r.status === 'Present');
                                        const isAbsent = personalRecords.some(r => r.session_detail && r.session_detail.date === dateStr && r.status === 'Absent');

                                        let status = 'none';
                                        if (isPresent) status = 'present';
                                        else if (isAbsent) status = 'absent';

                                        last7Days.push({ day: dayName, status: status, date: dateStr });
                                    }

                                    return last7Days.map((item, idx) => {
                                        let barColor = 'bg-light-500';
                                        let height = '10%';
                                        let icon = null;

                                        if (item.status === 'present') {
                                            barColor = 'bg-success-grad';
                                            height = '100%';
                                            icon = <i className="ph ph-check text-white f-s-16"></i>;
                                        } else if (item.status === 'absent') {
                                            barColor = 'bg-danger-grad';
                                            height = '40%';
                                            icon = <i className="ph ph-x text-white f-s-16"></i>;
                                        }

                                        return (
                                            <div key={idx} className="chart-bar-group text-center" style={{ width: '12%' }}>
                                                <div className="bar-wrapper w-100 bg-light-soft rounded-3 position-relative d-flex justify-content-center" style={{ height: '150px' }}>
                                                    <div
                                                        className={`bar ${barColor} position-absolute bottom-0 w-100 rounded-3 d-flex align-items-center justify-content-center`}
                                                        style={{ height: height, transition: 'height 1s ease' }}
                                                        title={item.date}
                                                    >
                                                        {icon}
                                                    </div>
                                                </div>
                                                <small className="f-s-11 text-muted mt-2 d-block f-w-600">{item.day}</small>
                                            </div>
                                        )
                                    });
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .bg-primary-grad { background: linear-gradient(135deg, #0f626a 0%, #0a4a50 100%); }
                    .bg-success-grad { background: linear-gradient(135deg, #1cc88a 0%, #13855c 100%); }
                    .bg-info-grad { background: linear-gradient(135deg, #36b9cc 0%, #258391 100%); }
                    .bg-danger-grad { background: linear-gradient(135deg, #e74a3b 0%, #be2617 100%); }
                    .stats-card { transition: all 0.3s ease; cursor: pointer; border-radius: 15px !important; }
                    .stats-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
                    .bar-wrapper { height: 150px; width: 35px; background: #f1f3f9; border-radius: 20px; position: relative; display: flex; align-items: flex-end; overflow: hidden; }
                    .bar { width: 100%; border-radius: 20px; transition: height 1s ease-in-out; }
                    .h-200 { height: 200px; }
                `}} />

                <div className="col-12 mt-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">My Attendance History</h5>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <DataTable className="custom-premium-table">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Course Name</th>
                                            <th>Check-In Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personalRecords.map((record, index) => (
                                            <tr key={index}>
                                                <td>{record.session_detail ? new Date(record.session_detail.date).toLocaleDateString() : 'N/A'}</td>
                                                <td>{record.session_detail ? record.session_detail.course_name : 'N/A'}</td>
                                                <td>{record.check_in_time}</td>
                                                <td><span className="badge bg-light-success text-success">{record.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </DataTable>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
