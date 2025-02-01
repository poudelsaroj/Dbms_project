import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvigilatorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [duties, setDuties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        specialization: '',
        experience: ''
    });

    useEffect(() => {
        fetchProfile();
        fetchDuties();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/invigilators/${id}`);
            setProfile(response.data);
            setFormData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const fetchDuties = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/invigilators/${id}/duties`);
            setDuties(response.data);
        } catch (error) {
            console.error('Error fetching duties:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/invigilators/${id}`, formData);
            alert('Profile updated successfully!');
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-user-circle fa-5x text-primary"></i>
                            </div>
                            <h4>{profile.name}</h4>
                            <p className="text-muted">{profile.designation}</p>
                            <p className="text-muted">{profile.department}</p>
                            {!isEditing && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="card mt-3">
                        <div className="card-header">
                            <h5>Contact Information</h5>
                        </div>
                        <div className="card-body">
                            <p><i className="fas fa-envelope me-2"></i>{profile.email}</p>
                            <p><i className="fas fa-phone me-2"></i>{profile.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    {isEditing ? (
                        <div className="card">
                            <div className="card-header">
                                <h5>Edit Profile</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label className="form-label">Department</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.department}
                                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Designation</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.designation}
                                                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Upcoming Duties */}
                            <div className="card mb-3">
                                <div className="card-header">
                                    <h5>Upcoming Duties</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Exam</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Room</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {duties.filter(duty => new Date(duty.date) >= new Date()).map(duty => (
                                                    <tr key={duty.id}>
                                                        <td>{duty.exam_name}</td>
                                                        <td>{duty.date}</td>
                                                        <td>{`${duty.start_time} - ${duty.end_time}`}</td>
                                                        <td>{duty.room_number}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Past Duties */}
                            <div className="card">
                                <div className="card-header">
                                    <h5>Past Duties</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Exam</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Room</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {duties.filter(duty => new Date(duty.date) < new Date()).map(duty => (
                                                    <tr key={duty.id}>
                                                        <td>{duty.exam_name}</td>
                                                        <td>{duty.date}</td>
                                                        <td>{`${duty.start_time} - ${duty.end_time}`}</td>
                                                        <td>{duty.room_number}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvigilatorProfile; 