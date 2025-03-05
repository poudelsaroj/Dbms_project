import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Remove any imports that might be causing circular dependencies
// Don't import components that might be importing App.js or other components that import Footer

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 pt-4 pb-3">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Invigilator management System</h5>
            <p className="mt-3">
              A comprehensive solution for managing exams, invigilators, 
              and classroom scheduling for educational institutions.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" className="text-light me-3">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="https://twitter.com" className="text-light me-3">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="https://linkedin.com" className="text-light">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </Col>
          
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/about" className="text-light">About Us</Link></li>
              <li><Link to="/exam-schedule" className="text-light">Exam Schedule</Link></li>
              <li><Link to="/contact" className="text-light">Contact Us</Link></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Contact Information</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                Pulchowk Campus, Kathmandu, Nepal
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>
                +977 01-1234567
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                info@invigilatormanagment.edu.np
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="mt-4 mb-3" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">Designed and developed by Prabesh Bashyal , Pratik Adhikari , Saroj Poudel and Spandan Bhandari </p>
            <p className="mb-0">&copy; {new Date().getFullYear()} Invigilator management System. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;