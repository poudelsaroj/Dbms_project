import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';

const InvigilatorProfile = () => {
  const navigate = useNavigate();
  const user = apiService.getCurrentUser();
  const [profile, setProfile] = useState({});
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: ''
  });

  useEffect(() => {
    if (!user || !user.id) {
      toast.error("Please login to view your profile");
      return;
    }
    
    fetchProfile();
    fetchDuties();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiService.getInvigilator(user.id);
      const profileData = response.data;
      setProfile(profileData);
      
      // Initialize form data with profile info
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        department: profileData.department || '',
        designation: profileData.designation || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };
  
  const fetchDuties = async () => {
    try {
      const response = await apiService.getInvigilatorDuties(user.id);
      setDuties(response.data || []);
    } catch (error) {
      console.error('Error fetching duties:', error);
      toast.error('Failed to load duty information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateInvigilator(user.id, formData);
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  if (!user || !user.id) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <p>Please login to view your profile</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Profile</h2>
      
      <Row>
        <Col md={6}>
          <Card className="shadow mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Personal Information</h5>
                {!editMode && (
                  <Button variant="primary" size="sm" onClick={() => setEditMode(true)}>
                    <i className="fas fa-edit me-1"></i> Edit
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {editMode ? (
                <Form onSubmit={handleUpdateProfile}>
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
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="department" 
                      value={formData.department} 
                      onChange={handleChange} 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="designation" 
                      value={formData.designation} 
                      onChange={handleChange} 
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
                  <p><strong>Department:</strong> {profile.department || "Not provided"}</p>
                  <p><strong>Designation:</strong> {profile.designation || "Not provided"}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow">
            <Card.Header>
              <h5 className="mb-0">Recent Duties</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Exam</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {duties.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">No duties assigned</td>
                        </tr>
                      ) : (
                        duties.slice(0, 5).map((duty, index) => (
                          <tr key={index}>
                            <td>{duty.exam_name}</td>
                            <td>{formatDate(duty.date)}</td>
                            <td>{formatTime(duty.start_time)} - {formatTime(duty.end_time)}</td>
                            <td>{duty.room_number}</td>
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
    </Container>
  );
};

export default InvigilatorProfile;