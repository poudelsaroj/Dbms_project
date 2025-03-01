const { validateDateTime } = require('../utils/validation');
const db = require('../config/db');

const validateExam = async (req, res, next) => {
    try {
        const {
            subject_name,
            department_id,
            exam_date,
            start_time,
            end_time,
            room_id,
            student_count,
            invigilator_ids
        } = req.body;

        // Required fields validation
        if (!subject_name || !department_id || !exam_date || 
            !start_time || !end_time || !room_id || !student_count) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        // Date and time validation
        if (!validateDateTime(exam_date, start_time, end_time)) {
            return res.status(400).json({
                message: 'Invalid date or time format'
            });
        }

        // Check room capacity
        const [[room]] = await db.query(
            'SELECT capacity FROM rooms WHERE id = ?',
            [room_id]
        );

        if (!room) {
            return res.status(400).json({
                message: 'Invalid room selected'
            });
        }

        if (student_count > room.capacity) {
            return res.status(400).json({
                message: 'Room capacity is less than student count'
            });
        }

        // Validate invigilator count
        const requiredInvigilators = Math.ceil(student_count / 30);
        if (!invigilator_ids || invigilator_ids.length < requiredInvigilators) {
            return res.status(400).json({
                message: `At least ${requiredInvigilators} invigilators required for ${student_count} students`
            });
        }

        next();
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ message: 'Error validating exam data' });
    }
};

module.exports = { validateExam }; 