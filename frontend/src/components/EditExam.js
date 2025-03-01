import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const EditExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject_name: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        room_number: '',
        student_count: '',
        department: '',
        invigilator_ids: []
    });
    const [classes, setClasses] = useState([]);
    const [invigilators, setInvigilators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [examRes, classesRes, invigilatorsRes] = await Promise.all([
                apiService.getExam(id),
                apiService.getClasses(),
                apiService.getInvigilators()
            ]);

            // Format the exam data as needed
            const exam = examRes.data;
            setFormData({
                ...exam,
                invigilator_ids: exam.invigilator_ids ?
                    exam.invigilator_ids.split(',').map(id => parseInt(id)) : []
            });

            setClasses(classesRes.data);
            setInvigilators(invigilatorsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load exam data');
            navigate('/exam-schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateExam(id, formData);
            toast.success('Exam updated successfully!');
            navigate('/exam-schedule');
        } catch (error) {
            console.error('Error updating exam:', error);
            toast.error('Failed to update exam');
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
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({
            ...prev,
            invigilator_ids: selectedOptions
        }));
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
                    <h3>Edit Exam</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control"
                                name="subject_name"
                                value={formData.subject_name}
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
                            <Form.Label>Room</Form.Label>
                            <Form.Control
                                as="select"
                                name="room_number"
                                value={formData.room_number}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Room</option>
                                {classes.map(classroom => (
                                    <option key={classroom.id} value={classroom.room_number}>
                                        {classroom.room_number} (Capacity: {classroom.capacity})
                                    </option>
                                ))}
                            </Form.Control>
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
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Invigilators</Form.Label>
                            <Form.Control
                                as="select"
                                multiple
                                className="form-select"
                                name="invigilator_ids"
                                value={formData.invigilator_ids}
                                onChange={handleInvigilatorChange}
                                required
                            >
                                {Array.isArray(invigilators) ? (
                                    invigilators.map(invigilator => (
                                        <option key={invigilator.id} value={invigilator.id}>
                                            {invigilator.name} ({invigilator.department})
                                        </option>
                                    ))
                                ) : null}
                            </Form.Control>
                            <Form.Text className="text-muted">
                                Hold Ctrl (Windows) or Command (Mac) to select multiple invigilators
                            </Form.Text>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/exam-schedule')}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Update Exam
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditExam;