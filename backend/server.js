const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const invigilatorRoutes = require('./routes/invigilatorRoutes');
const examRoutes = require('./routes/examRoutes');
const classRoutes = require('./routes/classRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');

// Configure environment variables
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Routes
app.use('/api/invigilators', invigilatorRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/scheduling', schedulingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Database connection initialized');
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});


