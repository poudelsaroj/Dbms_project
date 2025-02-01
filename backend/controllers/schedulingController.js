const db = require('../config/db');

// Get all schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM schedules');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Error fetching schedules' });
    }
};

// Create new schedule
exports.createSchedule = async (req, res) => {
    try {
        const { invigilatorId, examId, date, startTime, endTime } = req.body;
        const [result] = await db.query(
            'INSERT INTO schedules (invigilator_id, exam_id, date, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
            [invigilatorId, examId, date, startTime, endTime]
        );
        res.status(201).json({
            id: result.insertId,
            invigilatorId,
            examId,
            date,
            startTime,
            endTime
        });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ message: 'Error creating schedule' });
    }
};

// Get single schedule
exports.getSchedule = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM schedules WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule' });
    }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
    try {
        const { invigilatorId, examId, date, startTime, endTime } = req.body;
        await db.query(
            'UPDATE schedules SET invigilator_id = ?, exam_id = ?, date = ?, start_time = ?, end_time = ? WHERE id = ?',
            [invigilatorId, examId, date, startTime, endTime, req.params.id]
        );
        res.json({ message: 'Schedule updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating schedule' });
    }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
    try {
        await db.query('DELETE FROM schedules WHERE id = ?', [req.params.id]);
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule' });
    }
}; 