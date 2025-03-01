import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { Container, Form, Button } from 'react-bootstrap';

const ClassForm = () => {
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
            setDepartments(response.data);
        } catch (error) {
            toast.error('Failed to load departments');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.createClass(formData);
            navigate('/class-management');
        } catch (error) {
            console.error('Error creating class:', error);
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
        <Container>
            <h2 className="mb-4">Add New Class</h2>
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

                <Form.Group className="mb-3">
                    <Form.Label>Section</Form.Label>
                    <Form.Control
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                    />
                </Form.Group>

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

                <Button variant="primary" type="submit">
                    Create Class
                </Button>
            </Form>
        </Container>
    );
};

export default ClassForm; 