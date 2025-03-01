import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';

const EditInvigilator = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        email: '',
        phone: '',
        designation: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvigilator();
    }, [id]);

    const fetchInvigilator = async () => {
        try {
            const response = await apiService.getInvigilator(id);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching invigilator:', error);
            toast.error('Invigilator not found');
            navigate('/view-invigilators');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateInvigilator(id, formData);
            toast.success('Invigilator updated successfully!');
            navigate('/view-invigilators');
        } catch (error) {
            console.error('Error updating invigilator:', error);
            toast.error('Failed to update invigilator');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3>Edit Invigilator</h3>
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
                            <input
                                type="text"
                                className="form-control"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={() => navigate('/view-invigilators')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Update Invigilator
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditInvigilator;
