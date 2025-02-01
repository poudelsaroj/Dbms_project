import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InvigilatorSchedule = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [invigilators, setInvigilators] = useState([]);
    const [exams, setExams] = useState([]);
    const [formData, setFormData] = useState({
        invigilator_id: '',
        exam_id: '',
        date: '',
        start_time: '',
        end_time: '',
        room_number: ''
    });

    useEffect(() => {
        fetchSchedules();
        fetchInvigilators();
        fetchExams();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/schedules');
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const fetchInvigilators = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/invigilators');
            setInvigilators(response.data);
        } catch (error) {
            console.error('Error fetching invigilators:', error);
        }
    };

    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/exams');
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/schedules', formData);
            alert('Schedule added successfully!');
            fetchSchedules();
            setFormData({
                invigilator_id: '',
                exam_id: '',
                date: '',
                start_time: '',
                end_time: '',
                room_number: ''
            });
        } catch (error) {
            console.error('Error adding schedule:', error);
            alert('Error adding schedule');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                await axios.delete(`http://localhost:5000/api/schedules/${id}`);
                setSchedules(schedules.filter(s => s.id !== id));
                alert('Schedule deleted successfully');
            } catch (error) {
                console.error('Error deleting schedule:', error);
                alert('Error deleting schedule');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Invigilator Schedule</h2>

            <div className="card mb-4">
                <div className="card-header">
                    <h4>Add New Schedule</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Invigilator</label>
                                <select 
                                    className="form-control"
                                    value={formData.invigilator_id}
                                    onChange={(e) => setFormData({...formData, invigilator_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select Invigilator</option>
                                    {invigilators.map(inv => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.name} - {inv.department}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Exam</label>
                                <select
                                    className="form-control"
                                    value={formData.exam_id}
                                    onChange={(e) => setFormData({...formData, exam_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select Exam</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.subject_name} - {exam.exam_date}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Start Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">End Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Add Schedule
                        </button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Invigilator</th>
                                    <th>Exam</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map(schedule => (
                                    <tr key={schedule.id}>
                                        <td>{schedule.invigilator_name}</td>
                                        <td>{schedule.exam_name}</td>
                                        <td>{schedule.date}</td>
                                        <td>{`${schedule.start_time} - ${schedule.end_time}`}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(schedule.id)}
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
        </div>
    );
};

export default InvigilatorSchedule; 