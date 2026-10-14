import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import { fetchTeachers, toggleTeacherStatus, clearAttendanceRecords } from '../../api';
import Swal from 'sweetalert2';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataVersion, setDataVersion] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

    const loadTeachers = useCallback(async () => {
        try {
            const res = await fetchTeachers();
            setTeachers(res.data);
        } catch (error) {
            console.error("Error loading teachers:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load teacher records. Make sure you have admin privileges.',
                confirmButtonColor: '#0f626a'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTeachers();
    }, [loadTeachers]);

    const handleToggleStatus = async (id) => {
        try {
            const res = await toggleTeacherStatus(id);
            if (res.data.status === 'success') {
                setTeachers(prev => prev.map(t => t.id === id ? { ...t, active: res.data.active } : t));
                setDataVersion(v => v + 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: res.data.message,
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: 'Could not update teacher status.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    const handleClearRecords = async () => {
        try {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Clear All Records?',
                html: '<p>This will permanently delete <strong>ALL</strong> attendance sessions and records from the database.</p><p class="text-danger"><strong>This action cannot be undone!</strong></p>',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, Clear All Records',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false
            });

            if (result.isConfirmed) {
                const res = await clearAttendanceRecords();
                if (res.data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Records Cleared',
                        text: res.data.message,
                        confirmButtonColor: '#0f626a'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: error.response?.data?.message || 'Could not clear attendance records.',
                confirmButtonColor: '#0f626a'
            });
        }
    };

    const viewTeacherData = (teacher) => {
        Swal.fire({
            title: `Teacher: ${teacher.user.first_name} ${teacher.user.last_name}`,
            html: `
                <div class="text-start">
                    <p><strong>Email:</strong> ${teacher.user.email}</p>
                    <p><strong>Department:</strong> ${teacher.department}</p>
                    <p><strong>Work Hours:</strong> ${teacher.default_start_time} - ${teacher.default_off_time}</p>
                    <p><strong>Joined:</strong> ${new Date(teacher.user.date_joined).toLocaleDateString()}</p>
                </div>
            `,
            confirmButtonColor: '#0f626a'
        });
    };

    const filteredTeachers = teachers.filter(t => {
        if (filterStatus === 'active') return t.active;
        if (filterStatus === 'inactive') return !t.active;
        return true;
    });

    const activeCount = teachers.filter(t => t.active).length;
    const inactiveCount = teachers.filter(t => !t.active).length;

    return (
        <Layout>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div
                        className={`card border-0 shadow-sm cursor-pointer ${filterStatus === 'active' ? 'border-primary ring-active' : ''}`}
                        onClick={() => setFilterStatus(filterStatus === 'active' ? 'all' : 'active')}
                        style={{ borderRadius: '15px', transition: 'all 0.3s ease' }}
                    >
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1 f-w-600">Active Teachers</h6>
                                <h3 className="mb-0 text-success f-w-700">{activeCount}</h3>
                            </div>
                            <div className="bg-light-success rounded-circle p-3 d-flex align-items-center justify-content-center">
                                <i className="ph ph-check-circle text-success f-s-28"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div
                        className={`card border-0 shadow-sm cursor-pointer ${filterStatus === 'inactive' ? 'border-primary ring-active' : ''}`}
                        onClick={() => setFilterStatus(filterStatus === 'inactive' ? 'all' : 'inactive')}
                        style={{ borderRadius: '15px', transition: 'all 0.3s ease' }}
                    >
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1 f-w-600">Inactive Teachers</h6>
                                <h3 className="mb-0 text-danger f-w-700">{inactiveCount}</h3>
                            </div>
                            <div className="bg-light-danger rounded-circle p-3 d-flex align-items-center justify-content-center">
                                <i className="ph ph-x-circle text-danger f-s-28"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card shadow-lg border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-primary-grad p-4 border-0">
                            <div className="d-flex align-items-center justify-content-between gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '50px', height: '50px' }}>
                                        <i className="ph ph-briefcase text-primary f-s-24"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-0 text-white">Teacher Management</h4>
                                        <p className="text-white mb-0 small f-w-400">Review and manage supervisor accounts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClearRecords}
                                    className="btn btn-danger"
                                    title="Clear all attendance records"
                                >
                                    <i className="ph ph-trash me-2"></i>
                                    Clear All Records
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            {loading ? (
                                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <DataTable key={`${dataVersion}-${filterStatus}`}>
                                    <thead className="table-light">
                                        <tr className="small text-uppercase text-muted">
                                            <th className="ps-4">Full Name</th>
                                            <th>Email / Username</th>
                                            <th>Department</th>
                                            <th>Status</th>
                                            <th className="text-end pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeachers.map((teacher) => (
                                            <tr key={teacher.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="bg-light-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                            <span className="small f-w-700 text-primary">{teacher.user.first_name ? teacher.user.first_name[0] : teacher.user.username[0]}</span>
                                                        </div>
                                                        <span className="f-w-600">{teacher.user.first_name} {teacher.user.last_name}</span>
                                                    </div>
                                                </td>
                                                <td>{teacher.user.email}</td>
                                                <td>{teacher.department}</td>
                                                <td>
                                                    <span className={`badge ${teacher.active ? 'bg-light-success text-success' : 'bg-light-danger text-danger'}`} style={{ minWidth: '80px' }}>
                                                        {teacher.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <button
                                                        onClick={() => handleToggleStatus(teacher.id)}
                                                        className={`btn btn-sm btn-icon ${teacher.active ? 'btn-light-danger' : 'btn-light-success'} me-2`}
                                                        title={teacher.active ? 'Deactivate' : 'Activate'}
                                                    >
                                                        <i className={`ph ${teacher.active ? 'ph-user-minus' : 'ph-user-plus'}`}></i>
                                                    </button>
                                                    <button
                                                        onClick={() => viewTeacherData(teacher)}
                                                        className="btn btn-icon btn-sm btn-light-primary"
                                                        title="View Details"
                                                    >
                                                        <i className="ph ph-eye"></i>
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
                .text-primary { color: #0f626a !important; }
                .bg-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; }
                .btn-light-primary { background-color: rgba(15, 98, 106, 0.1) !important; color: #0f626a !important; border: 1px solid rgba(15, 98, 106, 0.2) !important; }
                .btn-light-primary:hover { background-color: #0f626a !important; color: white !important; }
                .btn-light-success { background-color: rgba(25, 135, 84, 0.1) !important; color: #198754 !important; border: 1px solid rgba(25, 135, 84, 0.2) !important; }
                .btn-light-success:hover { background-color: #198754 !important; color: white !important; }
                .btn-light-danger { background-color: rgba(220, 53, 69, 0.1) !important; color: #dc3545 !important; border: 1px solid rgba(220, 53, 69, 0.2) !important; }
                .btn-light-danger:hover { background-color: #dc3545 !important; color: white !important; }
                .btn-icon { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; }
                .cursor-pointer { cursor: pointer; }
                .ring-active { border: 2px solid #0f626a !important; box-shadow: 0 0 0 3px rgba(15, 98, 106, 0.2) !important; }
            `}} />
        </Layout>
    );
};

export default TeacherManagement;
