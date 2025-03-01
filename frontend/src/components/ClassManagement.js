import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';

const ClassManagement = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        room_number: '',
        capacity: '',
        building: '',
        floor: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await apiService.getClasses();
            console.log("Classes response:", response);

            // More robust handling of response data
            let classesData = [];
            if (response && response.data) {
                classesData = Array.isArray(response.data) ? response.data :
                    (response.data.data ? response.data.data : []);
            }

            setClasses(classesData);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error('Failed to load classes');
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            const response = await apiService.createClass(formData);
            toast.success('Class added successfully');
            setShowAddModal(false);
            resetForm();
            fetchClasses();
        } catch (error) {
            console.error('Error adding class:', error);
            toast.error('Failed to add class');
        }
    };

    const handleDeleteClass = async () => {
        if (!selectedClass) return;

        try {
            await apiService.deleteClass(selectedClass.id);
            toast.success('Class deleted successfully');
            setShowDeleteModal(false);
            fetchClasses();
        } catch (error) {
            console.error('Error deleting class:', error);
            toast.error('Failed to delete class');
        }
    };

    const handleEditClass = async (e) => {
        e.preventDefault();
        if (!selectedClass) return;

        try {
            await apiService.updateClass(selectedClass.id, formData);
            toast.success('Class updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchClasses();
        } catch (error) {
            console.error('Error updating class:', error);
            toast.error('Failed to update class');
        }
    };

    const openEditModal = (classItem) => {
        setSelectedClass(classItem);
        setFormData({
            name: classItem.name || '',
            room_number: classItem.room_number || '',
            capacity: classItem.capacity || '',
            building: classItem.building || '',
            floor: classItem.floor || ''
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (classItem) => {
        setSelectedClass(classItem);
        setShowDeleteModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            room_number: '',
            capacity: '',
            building: '',
            floor: ''
        });
        setSelectedClass(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Ensure classes is always an array before rendering
    const classesArray = Array.isArray(classes) ? classes : [];

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Class Management</h2>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <i className="fas fa-plus me-1"></i> Add Class
                </Button>
            </div>

            <Row>
                <Col>
                    <Card className="shadow">
                        <Card.Header>
                            <h5 className="mb-0">Classes/Rooms</h5>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <p className="text-center">Loading...</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
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
                                            {classesArray.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center">No classes found</td>
                                                </tr>
                                            ) : (
                                                classesArray.map((classItem) => (
                                                    <tr key={classItem.id}>
                                                        <td>{classItem.name}</td>
                                                        <td>{classItem.room_number}</td>
                                                        <td>{classItem.capacity}</td>
                                                        <td>{classItem.building}</td>
                                                        <td>{classItem.floor}</td>
                                                        <td>
                                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEditModal(classItem)}>
                                                                <i className="fas fa-edit"></i>
                                                            </Button>
                                                            <Button variant="outline-danger" size="sm" onClick={() => openDeleteModal(classItem)}>
                                                                <i className="fas fa-trash"></i>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddClass}>
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
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Floor</Form.Label>
                            <Form.Control
                                type="text"
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Class
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditClass}>
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
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Floor</Form.Label>
                            <Form.Control
                                type="text"
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Update Class
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the class "{selectedClass?.name}"?</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteClass}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ClassManagement;