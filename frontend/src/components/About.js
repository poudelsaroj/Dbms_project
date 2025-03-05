import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faCalendarAlt, faUsers, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">About Invigilator management System</h1>
          <div className="text-center mb-4">
            <img 
              src="/logo.png" 
              alt="Invigilator Management Logo"
              style={{ maxHeight: '120px' }}
              className="mb-3" 
            />
          </div>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <p className="lead text-center mb-4">
                Our comprehensive Invigilator management solution streamlines the entire examination process 
                for educational institutions of all sizes.
              </p>
              <p>
                The Invigilator management System was developed to address the challenges faced by educational institutions
                in organizing and conducting examinations efficiently. Our system provides tools to manage everything
                from exam scheduling and invigilator assignments to room allocation and reporting.
              </p>
              <p>
                With our user-friendly interface and robust features, administrators can easily organize exams,
                assign invigilators, manage classrooms, and generate reports. Invigilators can view their duties,
                access exam information, and update their profiles seamlessly.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="text-center mb-4">Our Features</h2>
      <Row>
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3 text-primary">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <h4>Exam Scheduling</h4>
              <p>Create and manage exam schedules with ease, avoiding time conflicts.</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3 text-success">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h4>Invigilator Management</h4>
              <p>Track invigilator availability and assign duties fairly.</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3 text-warning">
                <FontAwesomeIcon icon={faChalkboardTeacher} />
              </div>
              <h4>Room Allocation</h4>
              <p>Efficiently manage classroom resources based on student count.</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3 text-info">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <h4>Duty Reports</h4>
              <p>Generate comprehensive reports on exam schedules and invigilator duties.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Our Mission</h2>
              <p className="lead text-center">
                To simplify and streamline the examination management process, making it more efficient, 
                transparent, and stress-free for educational institutions.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;