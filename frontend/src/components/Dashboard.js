import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>Dashboard</h2>
                        <div>
                            <Link to="/create-exam" className="btn btn-success me-2">
                                <i className="fas fa-plus-circle me-2"></i>Create Exam
                            </Link>
                            <Link to="/add-invigilator" className="btn btn-primary">
                                <i className="fas fa-user-plus me-2"></i>Add Invigilator
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="card bg-primary text-white mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">0</h3>
                                    <div>Total Invigilators</div>
                                </div>
                                <i className="fas fa-users fa-2x opacity-50"></i>
                            </div>
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link to="/view-invigilators" className="small text-white stretched-link">View Details</Link>
                            <i className="fas fa-angle-right text-white"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">0</h3>
                                    <div>Active Exams</div>
                                </div>
                                <i className="fas fa-clipboard-list fa-2x opacity-50"></i>
                            </div>
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link to="/exam-schedule" className="small text-white stretched-link">View Details</Link>
                            <i className="fas fa-angle-right text-white"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">0</h3>
                                    <div>Departments</div>
                                </div>
                                <i className="fas fa-building fa-2x opacity-50"></i>
                            </div>
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link to="/departments" className="small text-white stretched-link">View Details</Link>
                            <i className="fas fa-angle-right text-white"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">0</h3>
                                    <div>Duties Assigned</div>
                                </div>
                                <i className="fas fa-tasks fa-2x opacity-50"></i>
                            </div>
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link to="/invigilator-schedule" className="small text-white stretched-link">View Details</Link>
                            <i className="fas fa-angle-right text-white"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Quick Actions</h5>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                <Link to="/create-exam" className="list-group-item list-group-item-action">
                                    <i className="fas fa-plus-circle me-2 text-success"></i>Create New Exam
                                </Link>
                                <Link to="/add-invigilator" className="list-group-item list-group-item-action">
                                    <i className="fas fa-user-plus me-2 text-primary"></i>Add New Invigilator
                                </Link>
                                <Link to="/class-management" className="list-group-item list-group-item-action">
                                    <i className="fas fa-chalkboard me-2 text-info"></i>Manage Classes
                                </Link>
                                <Link to="/invigilator-schedule" className="list-group-item list-group-item-action">
                                    <i className="fas fa-calendar-alt me-2 text-warning"></i>Schedule Duties
                                </Link>
                                <Link to="/reports" className="list-group-item list-group-item-action">
                                    <i className="fas fa-chart-bar me-2 text-danger"></i>View Reports
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Upcoming Exams</h5>
                                <Link to="/exam-schedule" className="btn btn-sm btn-primary">View All</Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Room</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan="4" className="text-center">No upcoming exams</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 