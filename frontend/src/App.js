import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/Dashboard'; // Rename existing Dashboard to AdminDashboard
import InvigilatorDashboard from './components/InvigilatorDashboard';
import ViewClasses from './components/ViewClasses';
import AddClass from './components/AddClass';
import EditClass from './components/EditClass';
import ViewInvigilators from './components/ViewInvigilators';
import AddInvigilator from './components/AddInvigilator';
import EditInvigilator from './components/EditInvigilator';
import ExamSchedule from './components/ExamSchedule';
import CreateExam from './components/CreateExam';
import EditExam from './components/EditExam';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.css';
import ClassManagement from './components/ClassManagement';
import InvigilatorSchedule from './components/InvigilatorSchedule';
import DepartmentManagement from './components/DepartmentManagement';
import NotFound from './components/NotFound';
import InvigilatorProfile from './components/InvigilatorProfile';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                    <PrivateRoute allowedUserType="admin">
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                
                <Route path="/view-classes" element={
                    <PrivateRoute allowedUserType="admin">
                        <ViewClasses />
                    </PrivateRoute>
                } />
                
                <Route path="/add-class" element={<AddClass />} />
                
                <Route path="/edit-class/:id" element={<EditClass />} />
                
                <Route path="/view-invigilators" element={<ViewInvigilators />} />
                
                <Route path="/add-invigilator" element={<AddInvigilator />} />
                
                <Route path="/edit-invigilator/:id" element={<EditInvigilator />} />
                
                <Route path="/exam-schedule" element={<ExamSchedule />} />
                
                <Route path="/create-exam" element={<CreateExam />} />
                
                <Route path="/edit-exam/:id" element={<EditExam />} />
                
                <Route path="/class-management" element={<ClassManagement />} />
                
                <Route path="/invigilator-schedule" element={<InvigilatorSchedule />} />
                
                <Route path="/departments" element={<DepartmentManagement />} />
                
                {/* Invigilator Routes */}
                <Route path="/invigilator/dashboard" element={
                    <PrivateRoute allowedUserType="invigilator">
                        <InvigilatorDashboard />
                    </PrivateRoute>
                } />
                
                <Route path="/invigilator/duties" element={<InvigilatorSchedule />} />
                
                <Route path="/invigilator/profile" element={<InvigilatorProfile />} />
                
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;

