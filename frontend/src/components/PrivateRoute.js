import React from 'react';
import { Navigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const PrivateRoute = ({ children, allowedUserType }) => {
    const token = localStorage.getItem('token');
    const user = apiService.getCurrentUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedUserType && user.role !== allowedUserType && user.role !== 'admin') {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return children;
};

export default PrivateRoute;