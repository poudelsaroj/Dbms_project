import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { Container, Table, Spinner } from 'react-bootstrap';

const ViewClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await apiService.getClasses();
            // Ensure that response.data is always an array
            const classesData = Array.isArray(response.data) ? response.data : [];
            setClasses(classesData);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error('Failed to load classes');
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await apiService.deleteClass(id);
                toast.success('Class deleted successfully');
                fetchClasses();
            } catch (error) {
                console.error('Error deleting class:', error);
                toast.error('Failed to delete class');
            }
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Classes List</h2>
                <Link to="/add-class" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Class
                </Link>
            </div>

            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Room Number</th>
                                        <th>Capacity</th>
                                        <th>Building</th>
                                        <th>Floor</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center">No classes found</td>
                                        </tr>
                                    ) : (
                                        classes.map(classroom => (
                                            <tr key={classroom.id}>
                                                <td>{classroom.name}</td>
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
                                                    <Link
                                                        to={`/edit-class/${classroom.id}`}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ViewClasses;