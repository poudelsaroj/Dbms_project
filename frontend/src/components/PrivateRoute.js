import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const PrivateRoute = ({ children, allowedUserType }) => {
  const navigate = useNavigate();
  const user = apiService.getCurrentUser();
  
  useEffect(() => {
    if (!user) {
      // Redirect to login if no user
      navigate('/login');
    } else if (allowedUserType && 
              (allowedUserType === 'admin' && user.role !== 'admin') ||
              (allowedUserType === 'invigilator' && user.role !== 'invigilator' && user.role !== 'admin')) {
      // Redirect to appropriate dashboard if wrong user type
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/invigilator/dashboard');
    }
  }, [user, allowedUserType, navigate]);
  
  // Show nothing while checking auth
  if (!user) return null;
  
  // Check if user has permission for this route
  if (allowedUserType === 'admin' && user.role !== 'admin') {
    return null;
  }
  
  if (allowedUserType === 'invigilator' && user.role !== 'invigilator' && user.role !== 'admin') {
    return null;
  }
  
  return children;
};

export default PrivateRoute;