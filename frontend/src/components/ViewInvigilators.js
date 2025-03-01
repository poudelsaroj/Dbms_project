import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner } from 'react-bootstrap';
import { apiService } from '../services/apiService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewInvigilators = () => {
    const [invigilators, setInvigilators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvigilators();
    }, []);

    const fetchInvigilators = async () => {
        try {
            setLoading(true);
            const response = await apiService.getInvigilators();
            console.log("Invigilator response:", response);
            
            // More flexible parsing of the response
            const invigilatorData = response.data?.data || 
                                   (Array.isArray(response.data) ? response.data : []);
            
            setInvigilators(invigilatorData);
        } catch (error) {
            console.error('Error fetching invigilators:', error);
            toast.error('Failed to load invigilators');
            setInvigilators([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invigilator?')) {
            try {
                await apiService.deleteInvigilator(id);
                toast.success('Invigilator deleted successfully');
                fetchInvigilators(); // Refresh the list
            } catch (error) {
                console.error('Error deleting invigilator:', error);
                toast.error('Failed to delete invigilator');
            }
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Invigilators List</h2>
                <Link to="/add-invigilator" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Invigilator
                </Link>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(invigilators) && invigilators.length > 0 ? (
                            invigilators.map((invigilator) => (
                                <tr key={invigilator.id}>
                                    <td>{invigilator.name}</td>
                                    <td>{invigilator.email}</td>
                                    <td>{invigilator.phone || '-'}</td>
                                    <td>{invigilator.department || '-'}</td>
                                    <td>{invigilator.designation || '-'}</td>
                                    <td>
                                        <Link 
                                            to={`/edit-invigilator/${invigilator.id}`}
                                            className="btn btn-sm btn-info me-2"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(invigilator.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No invigilators found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default ViewInvigilators;