import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChalkboardTeacher, faCalendarAlt, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [stats, setStats] = useState({
    invigilators: 0,
    classes: 0,
    upcomingExams: 0,
    totalExams: 0
  });
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get counts
      const [invigilatorsRes, classesRes, examsRes] = await Promise.all([
        apiService.getInvigilators(),
        apiService.getClasses(),
        apiService.getExams()
      ]);

      // Ensure we have valid data arrays before processing
      const invigilatorsData = invigilatorsRes?.data || [];
      const classesData = classesRes?.data || [];
      const examsData = examsRes?.data || [];

      // Calculate upcoming exams (exams with date >= today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcoming = examsData.filter(exam => {
        const examDate = new Date(exam.exam_date);
        examDate.setHours(0, 0, 0, 0); // Set hours to 0 for proper date comparison
        return examDate.getTime() >= today.getTime();
      });

      setStats({
        invigilators: invigilatorsData.length,
        classes: classesData.length,
        upcomingExams: upcoming.length,
        totalExams: examsData.length
      });

      // Get recent/upcoming exams
      const recentExamsData = upcoming
        .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))
        .slice(0, 5)
        .map(exam => ({
          // Map the exam properties correctly
          subject: exam.subject_name,  // Changed from exam.subject 
          exam_date: exam.exam_date,
          exam_time: `${exam.start_time} - ${exam.end_time}`,  // Combined from start_time and end_time
          room: exam.room_number || exam.room_id  // Using room_number or room_id
        }));

      setRecentExams(recentExamsData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setStats({
        invigilators: 0,
        classes: 0,
        upcomingExams: 0,
        totalExams: 0
      });
      setRecentExams([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {/* Stats */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-primary">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="h5">Invigilators</h3>
              <div className="h3">{loading ? '...' : stats.invigilators}</div>
              <Link to="/view-invigilators" className="btn btn-sm btn-outline-primary mt-2">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-success">
                <FontAwesomeIcon icon={faChalkboardTeacher} />
              </div>
              <h3 className="h5">Classes/Rooms</h3>
              <div className="h3">{loading ? '...' : stats.classes}</div>
              <Link to="/view-classes" className="btn btn-sm btn-outline-success mt-2">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-warning">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <h3 className="h5">Upcoming Exams</h3>
              <div className="h3">{loading ? '...' : stats.upcomingExams}</div>
              <Link to="/exam-schedule" className="btn btn-sm btn-outline-warning mt-2">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-info">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <h3 className="h5">Total Exams</h3>
              <div className="h3">{loading ? '...' : stats.totalExams}</div>
              <Link to="/exam-schedule" className="btn btn-sm btn-outline-info mt-2">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/add-invigilator" className="btn btn-primary">
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Add New Invigilator
                </Link>
                <Link to="/class-management" className="btn btn-success">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
                  Add New Classroom
                </Link>
                <Link to="/create-exam" className="btn btn-warning">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Schedule New Exam
                </Link>
                <Link to="/invigilator-schedule" className="btn btn-info">
                  <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
                  Assign Duties
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Exams */}
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header>
              <h5 className="mb-0">Recent Exams</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExams.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">No recent exams</td>
                      </tr>
                    ) : (
                      recentExams.map((exam, index) => (
                        <tr key={index}>
                          <td>{exam.subject}</td>
                          <td>{formatDate(exam.exam_date)}</td>
                          <td>{formatTime(exam.exam_time)}</td>
                          <td>{exam.room}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;