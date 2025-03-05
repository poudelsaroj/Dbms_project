import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = apiService.getCurrentUser();
  const isLoggedIn = !!user;
  const userType = user?.role;
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';

  const handleLogout = () => {
    apiService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to={isLoggedIn ? (userType === 'admin' ? '/admin/dashboard' : '/invigilator/dashboard') : '/'}>
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
          <ul className="navbar-nav me-auto">
            {/* Public links visible to all */}
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            
            {/* Admin links */}
            {isLoggedIn && userType === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/view-invigilators">Invigilators</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/view-classes">Classes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/exam-schedule">Exams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invigilator-schedule">Scheduling</Link>
                </li>
              </>
            )}
            
            {/* Invigilator links */}
            {isLoggedIn && userType === 'invigilator' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/invigilator/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invigilator/duties">My Duties</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invigilator/profile">My Profile</Link>
                </li>
              </>
            )}
          </ul>
          {isLoggedIn && !isAuthPage && (
            <div className="d-flex">
              <span className="navbar-text me-3">
                Welcome, {user.name} ({userType})
              </span>
              <button 
                className="btn btn-outline-light btn-sm" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
          {!isLoggedIn && !isAuthPage && (
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
              <Link to="/signup" className="btn btn-outline-light">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;