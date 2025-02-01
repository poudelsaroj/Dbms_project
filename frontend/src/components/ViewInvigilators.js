import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewInvigilators = () => {
    const [invigilators, setInvigilators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInvigilators();
    }, []);

    const fetchInvigilators = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/invigilators');
            setInvigilators(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invigilators:', error);
            setError('Error fetching invigilators');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invigilator?')) {
            try {
                await axios.delete(`http://localhost:5000/api/invigilators/${id}`);
                setInvigilators(invigilators.filter(inv => inv.id !== id));
                alert('Invigilator deleted successfully');
            } catch (error) {
                console.error('Error deleting invigilator:', error);
                alert('Error deleting invigilator');
            }
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error) return <div className="container mt-4 text-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Invigilators</h2>
                <Link to="/add-invigilator" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Invigilator
                </Link>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invigilators.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No invigilators found</td>
                                    </tr>
                                ) : (
                                    invigilators.map(invigilator => (
                                        <tr key={invigilator.id}>
                                            <td>{invigilator.name}</td>
                                            <td>{invigilator.department}</td>
                                            <td>{invigilator.designation}</td>
                                            <td>{invigilator.email}</td>
                                            <td>{invigilator.phone}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger me-2"
                                                    onClick={() => handleDelete(invigilator.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                                <Link
                                                    to={`/edit-invigilator/${invigilator.id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewInvigilators; 