import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const AddClass = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        department_id: '',
        semester: '',
        section: '',
        student_count: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await apiService.getAllDepartments();
            setDepartments(response.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to load departments');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate required fields
            if (!formData.name || !formData.department_id || !formData.semester || !formData.student_count) {
                toast.error('Please fill in all required fields');
                return;
            }

            await apiService.createClass(formData);
            toast.success('Class added successfully!');
            navigate('/classes');
        } catch (error) {
            console.error('Error adding class:', error);
            toast.error(error.response?.data?.message || 'Failed to add class');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h4>Add New Class</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Class Name*</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Department*</Form.Label>
                            <Form.Select
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Semester*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="8"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Section</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="section"
                                        value={formData.section}
                                        onChange={handleChange}
                                        placeholder="A, B, C, etc."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Student Count*</Form.Label>
                            <Form.Control
                                type="number"
                                name="student_count"
                                value={formData.student_count}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => navigate('/classes')}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Class
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddClass;