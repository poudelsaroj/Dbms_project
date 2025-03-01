import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import {
  Container, Card, Table, Button, Badge,
  Form, Row, Col, Modal
} from 'react-bootstrap';

const InvigilatorList = () => {
  const [invigilators, setInvigilators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedInvigilator, setSelectedInvigilator] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchInvigilators();
  }, []);

  const fetchInvigilators = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInvigilators();
      setInvigilators(response.data);
    } catch (error) {
      console.error('Error fetching invigilators:', error);
      toast.error('Failed to load invigilators');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (invigilator, newStatus) => {
    try {
      await apiService.updateInvigilator(invigilator.id, {
        ...invigilator,
        status: newStatus
      });
      toast.success('Status updated successfully');
      fetchInvigilators();
      setShowStatusModal(false);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredInvigilators = invigilators.filter(inv => {
    return (
      (!filters.department || inv.department_id === parseInt(filters.department)) &&
      (!filters.status || inv.status === filters.status) &&
      (!filters.search || 
        inv.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        inv.email.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Invigilators</h5>
            <Link to="/add-invigilator" className="btn btn-light">
              <i className="fas fa-plus me-2"></i>Add Invigilator
            </Link>
          </div>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search invigilators..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  search: e.target.value
                }))}
              />
            </Col>
            {/* Add more filters as needed */}
          </Row>

          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Duties</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvigilators.map(invigilator => (
                <tr key={invigilator.id}>
                  <td>
                    {invigilator.name}
                    <small className="text-muted d-block">
                      {invigilator.designation}
                    </small>
                  </td>
                  <td>{invigilator.department_name}</td>
                  <td>
                    {invigilator.email}
                    <small className="text-muted d-block">
                      {invigilator.phone}
                    </small>
                  </td>
                  <td>
                    <Badge bg="primary" className="me-2">
                      Upcoming: {invigilator.upcoming_duties}
                    </Badge>
                    <Badge bg="success">
                      Completed: {invigilator.completed_duties}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={invigilator.status === 'active' ? 'success' : 'danger'}>
                      {invigilator.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/invigilator/${invigilator.id}`}
                        className="btn btn-sm btn-info"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Button
                        variant={invigilator.status === 'active' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => {
                          setSelectedInvigilator(invigilator);
                          setShowStatusModal(true);
                        }}
                      >
                        <i className={`fas fa-${invigilator.status === 'active' ? 'ban' : 'check'}`}></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Status Change Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Invigilator Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status of {selectedInvigilator?.name} to 
          {selectedInvigilator?.status === 'active' ? ' inactive' : ' active'}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button
            variant={selectedInvigilator?.status === 'active' ? 'danger' : 'success'}
            onClick={() => handleStatusChange(
              selectedInvigilator,
              selectedInvigilator.status === 'active' ? 'inactive' : 'active'
            )}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InvigilatorList;
