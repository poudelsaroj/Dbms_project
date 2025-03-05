import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the Footer component
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
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import ClassManagement from './components/ClassManagement';
import InvigilatorSchedule from './components/InvigilatorSchedule';
import DepartmentManagement from './components/DepartmentManagement';
import InvigilatorProfile from './components/InvigilatorProfile';
// import InvigilatorDuties from './components/InvigilatorDuties';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        {/* Public Routes */}
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        
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
                        
                        {/* <Route path="/invigilator/duties" element={
                            <PrivateRoute allowedUserType="invigilator">
                                <InvigilatorDuties />
                            </PrivateRoute>
                        } /> */}
                        
                        <Route path="/invigilator/profile" element={
                            <PrivateRoute allowedUserType="invigilator">
                                <InvigilatorProfile />
                            </PrivateRoute>
                        } />
                        
                        {/* Default route */}
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;

