import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import { fetchStats, fetchAttendanceRecords, deleteAttendanceRecord } from '../../api';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    present_today: 0,
    avg_attendance: 0,
    absent_today: 0,
    late_today: 0,
    avg_confidence: 0,
    intensity_matrix: []
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '1day', '1week', '1month'

  useEffect(() => {
    const loadData = async () => {
      try {
        setErrorStatus(null);
        const [statsRes, recordsRes] = await Promise.all([
          fetchStats(),
          fetchAttendanceRecords()
        ]);
        setStats(statsRes.data);
        setRecords(recordsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setErrorStatus("Failure to sync with secure server. Please re-login if this persists.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDeleteRecord = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Record?',
      text: "This will permanently remove this attendance entry.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteAttendanceRecord(id);
        // AJAX Update: Remove from local state
        setRecords(prev => prev.filter(r => r.id !== id));
        setDataVersion(v => v + 1);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Record has been removed.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Unable to sync deletion with server.'
        });
      }
    }
  };

  const getFilteredRecords = () => {
    if (timeFilter === 'all') return records;
    const now = new Date();
    return records.filter(record => {
      if (!record.session_detail || !record.session_detail.date) return false;
      const recordDate = new Date(record.session_detail.date);
      const diffTime = Math.abs(now - recordDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeFilter === '1day') return diffDays <= 1;
      if (timeFilter === '1week') return diffDays <= 7;
      if (timeFilter === '1month') return diffDays <= 30;
      return true;
    });
  };

  const exportToCSV = () => {
    const dataToExport = getFilteredRecords();
    if (dataToExport.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'There are no records to export.'
      });
      return;
    }

    const headers = ['Timestamp', 'Student Name', 'Student ID', 'Course Module', 'Status', 'Confidence', 'Late Status'];
    const csvRows = [headers.join(',')];

    dataToExport.forEach(record => {
      const date = record.session_detail ? new Date(record.session_detail.date).toLocaleDateString() : 'N/A';
      const time = record.check_in_time || 'N/A';
      const timestamp = `"${date} ${time}"`;
      const name = `"${record.student_name || 'N/A'}"`;
      const stuId = `"${record.student_id || 'N/A'}"`;
      const course = `"${record.session_detail ? record.session_detail.course_name : 'N/A'}"`;
      const status = `"${record.status}"`;
      const confidence = `"${record.confidence_score || 95}%"`;
      const late = `"${record.is_late ? 'Yes' : 'No'}"`;

      csvRows.push([timestamp, name, stuId, course, status, confidence, late].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = getFilteredRecords();

  return (
    <Layout>
      <div className="container-fluid px-0">
        {errorStatus && (
          <div className="alert alert-warning border-0 shadow-sm mb-4 d-flex align-items-center">
            <i className="ph ph-warning-circle f-s-20 me-2"></i>
            <div>{errorStatus}</div>
          </div>
        )}
        {/* Statistics Row */}
        <div className="row g-4 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
              <div className="card-body p-4 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-primary-grad p-3 rounded-4 shadow-sm">
                    <i className="ph ph-users-three text-white f-s-24"></i>
                  </div>
                  <span className="badge bg-light-primary text-primary px-3 py-2 border-primary-100 border">Total Pool</span>
                </div>
                <h2 className="mb-1 f-w-700">{loading ? '...' : stats.total_students}</h2>
                <p className="text-secondary mb-0 f-s-14">Enrolled Students</p>
                <div className="stats-decoration"></div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-success-grad p-3 rounded-4 shadow-sm">
                    <i className="ph ph-user-check text-white f-s-24"></i>
                  </div>
                  <span className="badge bg-light-success text-success px-3 py-2 border-success-100 border">Live Status</span>
                </div>
                <h2 className="mb-1 f-w-700 text-success">{loading ? '...' : stats.present_today}</h2>
                <p className="text-secondary mb-0 f-s-14">Marked Present Today</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-info-grad p-3 rounded-4 shadow-sm">
                    <i className="ph ph-target text-white f-s-24"></i>
                  </div>
                  <span className="badge bg-light-info text-info px-3 py-2 border-info-100 border">AI Precision</span>
                </div>
                <h2 className="mb-1 f-w-700 text-info">{loading ? '...' : `${stats.avg_confidence}%`}</h2>
                <p className="text-secondary mb-0 f-s-14">Average Match Score</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 overflow-hidden stats-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-danger-grad p-3 rounded-4 shadow-sm">
                    <i className="ph ph-user-minus text-white f-s-24"></i>
                  </div>
                  <span className="badge bg-light-danger text-danger px-3 py-2 border-danger-100 border">Absents</span>
                </div>
                <h2 className="mb-1 f-w-700 text-danger">{loading ? '...' : stats.absent_today}</h2>
                <p className="text-secondary mb-0 f-s-14">Marked Absent Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 f-w-700">Attendance Intensity Matrix</h5>
                <div className="badge bg-light text-dark-500 border">Weekly Overview</div>
              </div>
              <div className="card-body p-4 d-flex flex-column h-100">
                <div className="chart-container-premium d-flex align-items-end justify-content-between flex-grow-1" style={{ minHeight: '220px' }}>
                  {(stats.intensity_matrix && stats.intensity_matrix.length > 0 ? stats.intensity_matrix : [
                    { day: 'Mon', count: 0 }, { day: 'Tue', count: 0 }, { day: 'Wed', count: 0 },
                    { day: 'Thu', count: 0 }, { day: 'Fri', count: 0 }, { day: 'Sat', count: 0 }
                  ]).map((item, idx) => {
                    const total = stats.total_students || 1;
                    const percent = Math.min(100, Math.max(10, (item.count / total) * 100));
                    // Color coding: High > 80% (Green), Medium > 50% (Blue), Low (Orange)
                    let barColor = 'bg-primary';
                    if (percent > 80) barColor = 'bg-success-grad';
                    else if (percent < 50) barColor = 'bg-warning-grad';
                    else barColor = 'bg-primary-grad';

                    return (
                      <div key={idx} className="chart-bar-group text-center" style={{ width: '12%' }}>
                        <div className="bar-wrapper w-100 bg-light-soft rounded-3 position-relative" style={{ height: '180px' }}>
                          <div
                            className={`bar ${barColor} position-absolute bottom-0 w-100 rounded-3`}
                            style={{ height: `${percent}%`, transition: 'height 1s ease' }}
                            title={`${item.count} Present / ${total} Total`}
                          >
                            {/* Data Label on top of bar if tall enough, else above */}
                            {percent > 20 && (
                              <span className="position-absolute top-0 start-50 translate-middle-x text-white f-s-10 f-w-700 py-1">
                                {item.count}
                              </span>
                            )}
                          </div>
                          {percent <= 20 && item.count > 0 && (
                            <span className="position-absolute bottom-100 start-50 translate-middle-x text-dark f-s-10 f-w-700 pb-1">
                              {item.count}
                            </span>
                          )}
                        </div>
                        <small className="f-s-11 text-muted mt-2 d-block f-w-600">{item.day}</small>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-light-soft rounded-3">
                  <p className="mb-0 small text-secondary">
                    <i className="ph ph-info me-2 text-primary"></i>
                    Attendance Intensity shows detailed daily breakdown. <strong>Green</strong> indicates &gt;80% attendance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white p-4 border-0">
                <h5 className="mb-0 f-w-700">Participation Split</h5>
              </div>
              <div className="card-body p-4 d-flex-center flex-column">
                <div className="position-relative mb-4">
                  <svg width="200" height="200" viewBox="0 0 42 42" className="donut">
                    <circle className="donut-hole" cx="21" cy="21" r="14" fill="#fff"></circle>
                    <circle className="donut-ring" cx="21" cy="21" r="14" fill="transparent" stroke="#f1f3f9" strokeWidth="6"></circle>
                    <circle
                      className="donut-segment"
                      cx="21" cy="21" r="14"
                      fill="transparent"
                      stroke="#4e73df"
                      strokeWidth="6"
                      strokeDasharray={`${stats.avg_attendance} ${100 - stats.avg_attendance}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="donut-text text-center">
                    <h2 className="mb-0 f-w-700 display-6">{stats.avg_attendance}%</h2>
                    <small className="text-muted f-w-600">Total Presence</small>
                  </div>
                </div>

                {/* Explicit Legend */}
                <div className="w-100 mt-3 p-3 bg-light-soft rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                    <div className="d-flex align-items-center">
                      <span className="badge-dot bg-primary me-2" style={{ width: 10, height: 10 }}></span>
                      <span className="small f-w-600 text-dark">Present</span>
                    </div>
                    <span className="small f-w-700 text-dark">{stats.present_today} <span className="text-muted fw-normal">Students</span></span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <span className="badge-dot bg-light-500 me-2" style={{ width: 10, height: 10, backgroundColor: '#cbd5e0' }}></span>
                      <span className="small f-w-600 text-dark">Absent</span>
                    </div>
                    <span className="small f-w-700 text-dark">{stats.absent_today} <span className="text-muted fw-normal">Students</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Table Row */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 f-w-700">Attendance Log Engine</h5>
                    <p className="text-secondary mb-0 small">Real-time matching logs and historical records</p>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="dropdown">
                      <button className="btn btn-outline-light border text-dark btn-sm px-3 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="ph ph-funnel me-1"></i>
                        {timeFilter === '1day' ? 'Last 1 Day' : timeFilter === '1week' ? 'Last 1 Week' : timeFilter === '1month' ? 'Last 1 Month' : 'All Time'}
                      </button>
                      <ul className="dropdown-menu shadow-sm border-0" style={{ borderRadius: '10px' }}>
                        <li><button className={`dropdown-item ${timeFilter === 'all' ? 'active' : ''}`} onClick={() => setTimeFilter('all')}>All Time</button></li>
                        <li><button className={`dropdown-item ${timeFilter === '1day' ? 'active' : ''}`} onClick={() => setTimeFilter('1day')}>Last 1 Day</button></li>
                        <li><button className={`dropdown-item ${timeFilter === '1week' ? 'active' : ''}`} onClick={() => setTimeFilter('1week')}>Last 1 Week</button></li>
                        <li><button className={`dropdown-item ${timeFilter === '1month' ? 'active' : ''}`} onClick={() => setTimeFilter('1month')}>Last 1 Month</button></li>
                      </ul>
                    </div>
                    <button className="btn btn-primary text-white btn-sm px-3 shadow-sm" onClick={exportToCSV}>
                      <i className="ph ph-download-simple me-1"></i> Export Data
                    </button>
                  </div>
                </div>
                <div className="card-body p-4">
                  {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                  ) : (
                    <DataTable key={`${dataVersion}-${timeFilter}`} className="custom-premium-table">
                      <thead className="bg-light-soft">
                        <tr>
                          <th className="ps-4">Timestamp</th>
                          <th>Student / Roll</th>
                          <th>Course Module</th>
                          <th>Status</th>
                          <th>AI Reliability</th>
                          <th className="pe-4 text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((record, index) => (
                          <tr key={index}>
                            <td className="ps-4">
                              <div className="d-flex flex-column">
                                <span className="f-w-600 f-s-13">{record.session_detail ? new Date(record.session_detail.date).toLocaleDateString() : 'N/A'}</span>
                                <small className="text-muted">{record.check_in_time}</small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="avatar-sm bg-light-primary text-primary rounded-circle d-flex-center f-w-700">
                                  {record.student_name ? record.student_name.charAt(0) : 'S'}
                                </div>
                                <div>
                                  <span className="d-block f-w-600 text-dark-800">{record.student_name}</span>
                                  <small className="text-muted">ID: {record.student_id}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">{record.session_detail ? record.session_detail.course_name : 'N/A'}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {record.status === 'Present' ? (
                                  <span className="badge-dot bg-success"></span>
                                ) : (
                                  <span className="badge-dot bg-danger"></span>
                                )}
                                <span className={`f-s-13 f-w-600 ${record.status === 'Present' ? 'text-success' : 'text-danger'}`}>
                                  {record.status}
                                  {record.is_late && <small className="text-warning ms-1">(Late)</small>}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '80px' }}>
                                  <div className="progress-bar bg-primary-grad" style={{ width: `${record.confidence_score || 95}%` }}></div>
                                </div>
                                <span className="f-s-12 f-w-700">{record.confidence_score || 95}%</span>
                              </div>
                            </td>
                            <td className="pe-4 text-end">
                              <div className="btn-group">
                                <button
                                  className="btn btn-icon-sm btn-light-soft rounded-circle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ph ph-dots-three-vertical"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" style={{ borderRadius: '10px' }}>
                                  <li>
                                    <button
                                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                                      onClick={() => handleDeleteRecord(record.id)}
                                    >
                                      <i className="ph ph-trash"></i> Delete Record
                                    </button>
                                  </li>
                                </ul>
                              </div>
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
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-primary-grad { background: linear-gradient(135deg, #0f626a 0%, #0a4a50 100%); }
        .bg-success-grad { background: linear-gradient(135deg, #1cc88a 0%, #13855c 100%); }
        .bg-info-grad { background: linear-gradient(135deg, #36b9cc 0%, #258391 100%); }
        .bg-danger-grad { background: linear-gradient(135deg, #e74a3b 0%, #be2617 100%); }
        .bg-info-grad { background: linear-gradient(135deg, #36b9cc 0%, #258391 100%); }
        .bg-warning-grad { background: linear-gradient(135deg, #f6c23e 0%, #dda20a 100%); }
        .bg-danger-grad { background: linear-gradient(135deg, #e74a3b 0%, #be2617 100%); }
        .bg-light-soft { background-color: #f8fbff; }
        
        /* Teal Overrides */
        .text-primary { color: #0f626a !important; }
        .bg-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; }
        
        .stats-card { transition: all 0.3s ease; cursor: pointer; border-radius: 15px !important; }
        .stats-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        
        .bar-wrapper { height: 150px; width: 35px; background: #f1f3f9; border-radius: 20px; position: relative; display: flex; align-items: flex-end; overflow: hidden; }
        .bar { width: 100%; border-radius: 20px; transition: height 1s ease-in-out; }
        
        .donut-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        
        .custom-premium-table th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 15px 12px; color: #718096; }
        .custom-premium-table td { padding: 18px 12px; }
        .custom-premium-table tr:hover { background-color: #f8fbff; }
        
        .pagination .page-link { color: #0f626a; padding: 8px 15px; }
        .pagination .page-item.active .page-link { background-color: #0f626a !important; color: white !important; border-color: #0f626a !important; }
        
        .btn-icon-sm { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: none; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}} />
    </Layout >
  );
};

export default Dashboard;
