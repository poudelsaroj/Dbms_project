const db = require('../config/db');

exports.validateExamSchedule = async (req, res, next) => {
    try {
        const { exam_date, start_time, end_time, room_number, invigilator_ids } = req.body;

        // Check room availability
        const [roomConflicts] = await db.query(`
            SELECT id, subject_name, start_time, end_time 
            FROM exams 
            WHERE room_number = ?
            AND exam_date = ?
            AND (
                (start_time <= ? AND end_time > ?) OR
                (start_time < ? AND end_time >= ?) OR
                (start_time >= ? AND end_time <= ?)
            )
        `, [room_number, exam_date, end_time, start_time, end_time, start_time, start_time, end_time]);

        if (roomConflicts.length > 0) {
            return res.status(400).json({
                message: 'Room is not available for the selected time slot',
                conflicts: roomConflicts
            });
        }

        // Check invigilator availability
        if (invigilator_ids && invigilator_ids.length > 0) {
            const [invigilatorConflicts] = await db.query(`
                SELECT 
                    i.id,
                    i.name,
                    e.subject_name,
                    e.start_time,
                    e.end_time
                FROM invigilators i
                JOIN exam_invigilators ei ON i.id = ei.invigilator_id
                JOIN exams e ON ei.exam_id = e.id
                WHERE i.id IN (?)
                AND e.exam_date = ?
                AND (
                    (e.start_time <= ? AND e.end_time > ?) OR
                    (e.start_time < ? AND e.end_time >= ?) OR
                    (e.start_time >= ? AND e.end_time <= ?)
                )
            `, [invigilator_ids, exam_date, end_time, start_time, end_time, start_time, start_time, end_time]);

            if (invigilatorConflicts.length > 0) {
                return res.status(400).json({
                    message: 'Some selected invigilators are not available',
                    conflicts: invigilatorConflicts
                });
            }
        }

        // Check workload balance
        const [workload] = await db.query(`
            SELECT 
                i.id,
                i.name,
                COUNT(ei.exam_id) as assignment_count
            FROM invigilators i
            LEFT JOIN exam_invigilators ei ON i.id = ei.invigilator_id
            LEFT JOIN exams e ON ei.exam_id = e.id
            WHERE i.id IN (?)
            AND e.exam_date >= CURDATE()
            GROUP BY i.id
            HAVING assignment_count >= 3
        `, [invigilator_ids]);

        if (workload.length > 0) {
            return res.status(400).json({
                message: 'Some invigilators have too many assignments',
                overloaded: workload
            });
        }

        next();
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ message: 'Validation error' });
    }
};