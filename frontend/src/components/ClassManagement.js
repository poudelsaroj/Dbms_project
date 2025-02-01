import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClassManagement = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        room_number: '',
        capacity: '',
        building: '',
        floor: ''
    });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            alert('Error fetching classes');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/classes', formData);
            alert('Class added successfully!');
            setIsAdding(false);
            fetchClasses();
            setFormData({
                room_number: '',
                capacity: '',
                building: '',
                floor: ''
            });
        } catch (error) {
            console.error('Error adding class:', error);
            alert('Error adding class');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await axios.delete(`http://localhost:5000/api/classes/${id}`);
                setClasses(classes.filter(c => c.id !== id));
                alert('Class deleted successfully');
            } catch (error) {
                console.error('Error deleting class:', error);
                alert('Error deleting class');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Class Management</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? 'Cancel' : 'Add New Class'}
                </button>
            </div>

            {isAdding && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h4>Add New Class</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Room Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.room_number}
                                        onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Capacity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Building</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.building}
                                        onChange={(e) => setFormData({...formData, building: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Floor</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.floor}
                                        onChange={(e) => setFormData({...formData, floor: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success">
                                Add Class
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Room Number</th>
                                    <th>Capacity</th>
                                    <th>Building</th>
                                    <th>Floor</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map(classroom => (
                                    <tr key={classroom.id}>
                                        <td>{classroom.room_number}</td>
                                        <td>{classroom.capacity}</td>
                                        <td>{classroom.building}</td>
                                        <td>{classroom.floor}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger me-2"
                                                onClick={() => handleDelete(classroom.id)}
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

export default ClassManagement; 