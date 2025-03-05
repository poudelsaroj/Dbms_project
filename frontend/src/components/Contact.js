import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Contact Us</h1>
      
      <Row>
        <Col lg={4} md={5} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h3 className="mb-4">Get in Touch</h3>
              
              <div className="d-flex mb-4">
                <div className="me-3 text-primary">
                  <i className="fas fa-map-marker-alt fa-lg"></i>
                </div>
                <div>
                  <h5>Our Location</h5>
                  <p className="mb-0">Pulchowk Engineering Campus, Kathmandu, Nepal</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="me-3 text-primary">
                  <i className="fas fa-phone fa-lg"></i>
                </div>
                <div>
                  <h5>Phone Number</h5>
                  <p className="mb-0">+977 ********</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="me-3 text-primary">
                  <i className="fas fa-envelope fa-lg"></i>
                </div>
                <div>
                  <h5>Email Address</h5>
                  <p className="mb-0">info@exammanagement.edu.np</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h3 className="mb-4">Send Us a Message</h3>
              
              {submitted ? (
                <div className="alert alert-success">
                  Your message has been sent successfully. We'll get back to you soon!
                </div>
              ) : null}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;