const db = require('../config/db');

// Email validation
exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation
exports.validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
};

// Exam timing validation
exports.validateExamTiming = async (examDate, startTime, endTime, roomId, invigilatorIds = []) => {
    try {
        // Check if room is available
        const [roomConflicts] = await db.query(`
            SELECT e.* FROM exams e
            WHERE e.room_id = ?
            AND e.exam_date = ?
            AND (
                (e.start_time <= ? AND e.end_time > ?)
                OR (e.start_time < ? AND e.end_time >= ?)
                OR (? <= e.start_time AND ? > e.start_time)
            )
        `, [roomId, examDate, startTime, startTime, endTime, endTime, startTime, endTime]);

        // Check if invigilators are available
        const [invigilatorConflicts] = await db.query(`
            SELECT e.*, i.name as invigilator_name 
            FROM exams e
            JOIN exam_invigilators ei ON e.id = ei.exam_id
            JOIN invigilators i ON ei.invigilator_id = i.id
            WHERE ei.invigilator_id IN (?)
            AND e.exam_date = ?
            AND (
                (e.start_time <= ? AND e.end_time > ?)
                OR (e.start_time < ? AND e.end_time >= ?)
                OR (? <= e.start_time AND ? > e.start_time)
            )
        `, [invigilatorIds, examDate, startTime, startTime, endTime, endTime, startTime, endTime]);

        return {
            isValid: roomConflicts.length === 0 && invigilatorConflicts.length === 0,
            conflicts: {
                room: roomConflicts,
                invigilators: invigilatorConflicts
            }
        };
    } catch (error) {
        console.error('Error validating exam timing:', error);
        throw error;
    }
};

// Date validation
exports.validateDate = (date) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
};

// Time validation
exports.validateTime = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}; 