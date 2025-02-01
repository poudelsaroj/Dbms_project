import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';

const Reports = () => {
    const [stats, setStats] = useState({
        departmentWiseCount: [],
        monthlyExams: [],
        dutyDistribution: [],
        examTypes: []
    });
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reports', {
                params: dateRange
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const departmentData = {
        labels: stats.departmentWiseCount.map(d => d.department),
        datasets: [{
            label: 'Invigilators per Department',
            data: stats.departmentWiseCount.map(d => d.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const monthlyData = {
        labels: stats.monthlyExams.map(m => m.month),
        datasets: [{
            label: 'Number of Exams',
            data: stats.monthlyExams.map(m => m.count),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Reports & Analytics</h2>
            
            {/* Date Range Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-5">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                            />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button 
                                className="btn btn-primary w-100"
                                onClick={fetchStats}
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Department-wise Distribution */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5>Invigilators by Department</h5>
                        </div>
                        <div className="card-body">
                            <Bar data={departmentData} />
                        </div>
                    </div>
                </div>

                {/* Monthly Exam Distribution */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5>Monthly Exam Distribution</h5>
                        </div>
                        <div className="card-body">
                            <Bar data={monthlyData} />
                        </div>
                    </div>
                </div>

                {/* Duty Distribution */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5>Duty Distribution</h5>
                        </div>
                        <div className="card-body">
                            <Pie 
                                data={{
                                    labels: stats.dutyDistribution.map(d => d.category),
                                    datasets: [{
                                        data: stats.dutyDistribution.map(d => d.count),
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.5)',
                                            'rgba(54, 162, 235, 0.5)',
                                            'rgba(255, 206, 86, 0.5)',
                                        ]
                                    }]
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5>Summary Statistics</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Total Exams</th>
                                            <td>{stats.examTypes.reduce((a, b) => a + b.count, 0)}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Duties Assigned</th>
                                            <td>{stats.dutyDistribution.reduce((a, b) => a + b.count, 0)}</td>
                                        </tr>
                                        <tr>
                                            <th>Average Duties per Invigilator</th>
                                            <td>{(stats.dutyDistribution.reduce((a, b) => a + b.count, 0) / (stats.departmentWiseCount.reduce((a, b) => a + b.count, 0) || 1)).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports; 