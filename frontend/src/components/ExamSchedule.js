import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';

const ExamSchedule = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        department: '',
        date: '',
        status: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [examsRes, deptsRes] = await Promise.all([
                apiService.getExams(),
                apiService.getAllDepartments()
            ]);
            
            // Ensure we're setting arrays
            setExams(Array.isArray(examsRes) ? examsRes : []);
            setDepartments(Array.isArray(deptsRes) ? deptsRes : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load exam schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await apiService.deleteExam(id);
                toast.success('Exam deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete exam');
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredExams = exams.filter(exam => {
        return (
            (!filters.department || exam.department_id === parseInt(filters.department)) &&
            (!filters.date || exam.exam_date === filters.date) &&
            (!filters.status || exam.status === filters.status)
        );
    });

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h3>Exam Schedule</h3>
                    <Button 
                        variant="primary" 
                        onClick={() => navigate('/create-exam')}
                    >
                        Create New Exam
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Filter by Department</Form.Label>
                                <Form.Select
                                    name="department"
                                    value={filters.department}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Departments</option>
                                    {Array.isArray(departments) && departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {/* Add other filters as needed */}
                    </Row>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Department</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Room</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.subject_name}</td>
                                    <td>{departments.find(d => d.id === exam.department_id)?.name || 'N/A'}</td>
                                    <td>{new Date(exam.exam_date).toLocaleDateString()}</td>
                                    <td>{`${exam.start_time} - ${exam.end_time}`}</td>
                                    <td>{exam.room_number}</td>
                                    <td>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => navigate(`/edit-exam/${exam.id}`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(exam.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ExamSchedule;