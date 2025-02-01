import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddInvigilator from './components/AddInvigilator';
import ViewInvigilators from './components/ViewInvigilators';
import CreateExam from './components/CreateExam';
import NotFound from './components/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.css';
import ClassManagement from './components/ClassManagement';
import InvigilatorSchedule from './components/InvigilatorSchedule';
import ExamSchedule from './components/ExamSchedule';
import DepartmentManagement from './components/DepartmentManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <i className="fas fa-graduation-cap me-2"></i>
              Invigilator Management System
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <i className="fas fa-home me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/exam-schedule">
                    <i className="fas fa-calendar-alt me-1"></i> Exams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/view-invigilators">
                    <i className="fas fa-users me-1"></i> Invigilators
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reports">
                    <i className="fas fa-chart-bar me-1"></i> Reports
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-invigilator" element={<AddInvigilator />} />
          <Route path="/view-invigilators" element={<ViewInvigilators />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/class-management" element={<ClassManagement />} />
          <Route path="/invigilator-schedule" element={<InvigilatorSchedule />} />
          <Route path="/exam-schedule" element={<ExamSchedule />} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

