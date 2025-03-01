import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const InvigilatorDashboard = () => {
  const [duties, setDuties] = useState([]);
  const [stats, setStats] = useState({
    upcomingDuties: 0,
    totalDuties: 0
  });
  const [loading, setLoading] = useState(true);
  const user = apiService.getCurrentUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!user || !user.id) return;
    
    try {
      setLoading(true);
      
      // Get invigilator's duties
      const response = await apiService.getInvigilatorDuties(user.id);
      const dutiesData = response.data || [];
      
      // Calculate upcoming duties (duties with date >= today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcoming = dutiesData.filter(duty => {
        const dutyDate = new Date(duty.date);
        return dutyDate >= today;
      });
      
      setStats({
        upcomingDuties: upcoming.length,
        totalDuties: dutiesData.length
      });

      // Get upcoming duties for display
      const upcomingDutiesData = upcoming
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setDuties(upcomingDutiesData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load your duties');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Invigilator Dashboard</h2>
      <p className="lead">Welcome, {user?.name || 'Invigilator'}!</p>
      
      {/* Stats */}
      <Row className="mb-4">
        <Col md={6} sm={6} className="mb-3">
          <Card className="shadow text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-warning">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <h3 className="h5">Upcoming Duties</h3>
              <div className="h3">{loading ? '...' : stats.upcomingDuties}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} className="mb-3">
          <Card className="shadow text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-info">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <h3 className="h5">Total Duties</h3>
              <div className="h3">{loading ? '...' : stats.totalDuties}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Upcoming Duties */}
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header>
              <h5 className="mb-0">Upcoming Duties</h5>
            </Card.Header>
            <Card.Body>
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
                        <td colSpan="4" className="text-center">
                          {loading ? 'Loading...' : 'No upcoming duties'}
                        </td>
                      </tr>
                    ) : (
                      duties.map((duty, index) => (
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InvigilatorDashboard;