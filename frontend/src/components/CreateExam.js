import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const CreateExam = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject_name: '',
        subject_code: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        room_id: '',
        department_id: '',
        student_count: '',
        invigilator_ids: []
    });
    const [rooms, setRooms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [invigilators, setInvigilators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [roomsRes, deptsRes, invigilatorsRes] = await Promise.all([
                apiService.getRooms(),
                apiService.getAllDepartments(),
                apiService.getInvigilators()
            ]);
            setRooms(roomsRes.data);
            setDepartments(deptsRes.data);
            setInvigilators(invigilatorsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load exam creation data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.subject_name || !formData.exam_date || 
                !formData.start_time || !formData.end_time || !formData.room_id) {
                toast.error('Please fill in all required fields');
                return;
            }

            const response = await apiService.createExam(formData);
            if (response) {
                toast.success('Exam created successfully!');
                navigate('/exam-schedule');
            }
        } catch (error) {
            console.error('Error creating exam:', error);
            toast.error(error.response?.data?.message || 'Error creating exam');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInvigilatorChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            invigilator_ids: selectedOptions
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h3>Create New Exam</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="subject_name"
                                value={formData.subject_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Department</Form.Label>
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
                            <Form.Label>Room</Form.Label>
                            <Form.Select
                                name="room_id"
                                value={formData.room_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Room</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.room_number} ({room.capacity} seats)
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Student Count</Form.Label>
                            <Form.Control
                                type="number"
                                className="form-control"
                                name="student_count"
                                value={formData.student_count}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Exam Date</Form.Label>
                            <Form.Control
                                type="date"
                                className="form-control"
                                name="exam_date"
                                value={formData.exam_date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    className="form-control"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col>
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    className="form-control"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Invigilators</Form.Label>
                            <Form.Select
                                multiple
                                name="invigilator_ids"
                                value={formData.invigilator_ids}
                                onChange={handleInvigilatorChange}
                            >
                                {invigilators.map(invigilator => (
                                    <option key={invigilator.id} value={invigilator.id}>
                                        {invigilator.name} ({invigilator.department_name})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/exam-schedule')}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Create Exam
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateExam;