import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';

const InvigilatorSchedule = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [invigilators, setInvigilators] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [formData, setFormData] = useState({
        invigilator_id: '',
        exam_id: ''
    });
    const user = apiService.getCurrentUser();
    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Get all data needed
            const [schedulesRes, invigilatorsRes, examsRes] = await Promise.all([
                apiService.getSchedules(),
                isAdmin ? apiService.getInvigilators() : Promise.resolve({ data: [] }),
                isAdmin ? apiService.getExams() : Promise.resolve({ data: [] })
            ]);

            // Ensure that schedulesRes.data is always an array
            const schedulesData = Array.isArray(schedulesRes.data) ? schedulesRes.data : [];
            setSchedules(schedulesData);

            if (isAdmin) {
                // Ensure that invigilatorsRes.data is always an array
                const invigilatorsData = Array.isArray(invigilatorsRes.data) ? invigilatorsRes.data : [];
                setInvigilators(invigilatorsData);

                // Ensure that examsRes.data is always an array
                const examsData = Array.isArray(examsRes.data) ? examsRes.data : [];
                setExams(examsData);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            toast.error('Failed to load schedule data');
            setSchedules([]);
            setInvigilators([]);
            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDuty = async (e) => {
        e.preventDefault();
        try {
            await apiService.createSchedule(formData);
            toast.success('Duty assigned successfully');
            setShowAssignModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error assigning duty:', error);
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || 'Failed to assign duty');
            } else {
                toast.error('Failed to assign duty');
            }
        }
    };

    const handleDeleteDuty = async () => {
        if (!selectedSchedule) return;
        try {
            await apiService.deleteSchedule(selectedSchedule.id);
            toast.success('Duty deleted successfully');
            setShowDeleteModal(false);
            setSelectedSchedule(null);
            fetchData();
        } catch (error) {
            console.error('Error deleting duty:', error);
            toast.error('Failed to delete duty');
        }
    };

    const resetForm = () => {
        setFormData({
            invigilator_id: '',
            exam_id: ''
        });
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2 className="mb-4">Invigilator Schedule</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Card>
                            <Card.Body>
                                <Button variant="primary" onClick={() => setShowAssignModal(true)}>
                                    Assign Duty
                                </Button>
                                <div className="table-responsive mt-4">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Invigilator</th>
                                                <th>Exam</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(schedules) ? (
                                                schedules.map(schedule => (
                                                    <tr key={schedule.id}>
                                                        <td>{schedule.invigilator_name}</td>
                                                        <td>{schedule.exam_name}</td>
                                                        <td>{schedule.date}</td>
                                                        <td>{`${schedule.start_time} - ${schedule.end_time}`}</td>
                                                        <td>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedSchedule(schedule);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : null}
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Assign Duty Modal */}
            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Duty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAssignDuty}>
                        <Form.Group controlId="invigilator_id">
                            <Form.Label>Invigilator</Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.invigilator_id}
                                onChange={(e) => setFormData({ ...formData, invigilator_id: e.target.value })}
                                required
                            >
                                <option value="">Select Invigilator</option>
                                {Array.isArray(invigilators) ? (
                                    invigilators.map(inv => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.name} - {inv.department}
                                        </option>
                                    ))
                                ) : null}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exam_id" className="mt-3">
                            <Form.Label>Exam</Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.exam_id}
                                onChange={(e) => setFormData({ ...formData, exam_id: e.target.value })}
                                required
                            >
                                <option value="">Select Exam</option>
                                {Array.isArray(exams) ? (
                                    exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.subject_name} - {exam.exam_date}
                                        </option>
                                    ))
                                ) : null}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Assign Duty
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Duty Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Duty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this duty?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteDuty}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default InvigilatorSchedule;