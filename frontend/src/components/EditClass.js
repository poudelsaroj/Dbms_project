import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { Container, Card, Form, Button } from 'react-bootstrap';

const EditClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        room_number: '',
        capacity: '',
        building: '',
        floor: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClassData();
    }, [id]);

    const fetchClassData = async () => {
        try {
            const response = await apiService.getClass(id);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching class:', error);
            toast.error('Class not found');
            navigate('/view-classes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateClass(id, formData);
            toast.success('Class updated successfully!');
            navigate('/view-classes');
        } catch (error) {
            console.error('Error updating class:', error);
            toast.error('Failed to update class');
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
            <Container className="mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h3>Edit Class</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Room Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="room_number"
                                value={formData.room_number}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Building</Form.Label>
                            <Form.Control
                                type="text"
                                name="building"
                                value={formData.building}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Floor</Form.Label>
                            <Form.Control
                                type="text"
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button type="button" className="btn btn-secondary" onClick={() => navigate('/view-classes')}>
                                Cancel
                            </Button>
                            <Button type="submit" className="btn btn-primary">
                                Update Class
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditClass;