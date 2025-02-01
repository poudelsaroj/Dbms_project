import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        head_of_department: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            alert('Error fetching departments');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/departments/${editingId}`, formData);
                alert('Department updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/departments', formData);
                alert('Department added successfully!');
            }
            setIsAdding(false);
            setEditingId(null);
            fetchDepartments();
            setFormData({
                name: '',
                code: '',
                head_of_department: ''
            });
        } catch (error) {
            console.error('Error saving department:', error);
            alert('Error saving department');
        }
    };

    const handleEdit = (department) => {
        setFormData({
            name: department.name,
            code: department.code,
            head_of_department: department.head_of_department
        });
        setEditingId(department.id);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await axios.delete(`http://localhost:5000/api/departments/${id}`);
                setDepartments(departments.filter(d => d.id !== id));
                alert('Department deleted successfully');
            } catch (error) {
                console.error('Error deleting department:', error);
                alert('Error deleting department');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Department Management</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setIsAdding(!isAdding);
                        setEditingId(null);
                        setFormData({
                            name: '',
                            code: '',
                            head_of_department: ''
                        });
                    }}
                >
                    {isAdding ? 'Cancel' : 'Add New Department'}
                </button>
            </div>

            {isAdding && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h4>{editingId ? 'Edit Department' : 'Add New Department'}</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Department Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Department Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Head of Department</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.head_of_department}
                                        onChange={(e) => setFormData({...formData, head_of_department: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success">
                                {editingId ? 'Update Department' : 'Add Department'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Department Name</th>
                                    <th>Code</th>
                                    <th>Head of Department</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map(department => (
                                    <tr key={department.id}>
                                        <td>{department.name}</td>
                                        <td>{department.code}</td>
                                        <td>{department.head_of_department}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={() => handleEdit(department)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(department.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentManagement; 