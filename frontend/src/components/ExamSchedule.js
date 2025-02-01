import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExamSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        department: '',
        date: ''
    });

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/exam-schedules');
            setSchedules(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setLoading(false);
        }
    };

    const filteredSchedules = schedules.filter(schedule => {
        return (
            (!filter.department || schedule.department.toLowerCase().includes(filter.department.toLowerCase())) &&
            (!filter.date || schedule.exam_date === filter.date)
        );
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Exam Schedule</h2>
                <Link to="/create-exam" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Exam
                </Link>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Filter by Department</label>
                            <input
                                type="text"
                                className="form-control"
                                value={filter.department}
                                onChange={(e) => setFilter({...filter, department: e.target.value})}
                                placeholder="Enter department name"
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Filter by Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filter.date}
                                onChange={(e) => setFilter({...filter, date: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Room</th>
                                        <th>Invigilators</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchedules.map(schedule => (
                                        <tr key={schedule.id}>
                                            <td>{schedule.subject_name}</td>
                                            <td>{schedule.department}</td>
                                            <td>{schedule.exam_date}</td>
                                            <td>{`${schedule.start_time} - ${schedule.end_time}`}</td>
                                            <td>{schedule.room_number}</td>
                                            <td>
                                                {schedule.invigilators.map(inv => inv.name).join(', ')}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/edit-exam/${schedule.id}`}
                                                    className="btn btn-sm btn-primary me-2"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => {
                                                        if(window.confirm('Are you sure you want to delete this exam?')) {
                                                            // Handle delete
                                                        }
                                                    }}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamSchedule; 