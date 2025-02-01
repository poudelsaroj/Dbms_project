import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInvigilator = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        email: '',
        phone: '',
        designation: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/invigilators', formData);
            alert('Invigilator added successfully!');
            navigate('/view-invigilators');
        } catch (error) {
            console.error('Error adding invigilator:', error);
            alert('Error adding invigilator');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3>Add New Invigilator</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                className="form-control"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Designation</label>
                            <select
                                className="form-control"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Designation</option>
                                <option value="Professor">Professor</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Assistant Professor">Assistant Professor</option>
                                <option value="Lecturer">Lecturer</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Add Invigilator
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddInvigilator;
