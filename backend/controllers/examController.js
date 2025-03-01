const db = require('../config/db');

// Create new exam
exports.createExam = async (req, res) => {
    try {
        const { subject_name, exam_date, start_time, end_time, room_number, student_count, department, invigilator_ids } = req.body;
        // Check if the exams table exists, if not create it
        
        // Insert exam
        const [examResult] = await db.query(
            'INSERT INTO exams (subject_name, exam_date, start_time, end_time, room_number) VALUES (?, ?, ?, ?, ?)',
            [subject_name, exam_date, start_time, end_time, room_number]
        );
        
        const examId = examResult.insertId;
        
        // Assign invigilators
        if (invigilator_ids && invigilator_ids.length > 0) {
            const values = invigilator_ids.map(invigilatorId => [examId, invigilatorId]);
            await db.query(
                'INSERT INTO exam_invigilators (exam_id, invigilator_id) VALUES ?',
                [values]
            );
        }
        
        res.status(201).json({
            message: 'Exam created and invigilators assigned successfully',
            examId: examId
        });
    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ message: 'Error creating exam' });
    }
};

// Get all exams with assigned invigilators
exports.getAllExams = async (req, res) => {
    try {
        const [exams] = await db.query(`
            SELECT e.*, 
                   GROUP_CONCAT(i.name) as invigilator_names,
                   GROUP_CONCAT(i.id) as invigilator_ids
            FROM exams e
            LEFT JOIN exam_invigilators ei ON e.id = ei.exam_id
            LEFT JOIN invigilators i ON ei.invigilator_id = i.id
            GROUP BY e.id
            ORDER BY e.exam_date, e.start_time
        `);
        
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ message: 'Error fetching exams' });
    }
};

// Update exam and assignments
exports.updateExam = async (req, res) => {
    try {
        const { subject_name, exam_date, start_time, end_time, room_number, invigilator_ids } = req.body;
        const examId = req.params.id;

        // Update exam details
        await db.query(
            'UPDATE exams SET subject_name = ?, exam_date = ?, start_time = ?, end_time = ?, room_number = ? WHERE id = ?',
            [subject_name, exam_date, start_time, end_time, room_number, examId]
        );

        // Update invigilator assignments
        await db.query('DELETE FROM exam_invigilators WHERE exam_id = ?', [examId]);
        
        if (invigilator_ids && invigilator_ids.length > 0) {
            const values = invigilator_ids.map(invigilatorId => [examId, invigilatorId]);
            await db.query(
                'INSERT INTO exam_invigilators (exam_id, invigilator_id) VALUES ?',
                [values]
            );
        }

        res.json({ message: 'Exam updated successfully' });
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).json({ message: 'Error updating exam' });
    }
};

// Delete exam
exports.deleteExam = async (req, res) => {
    try {
        const examId = req.params.id;
        
        // Delete invigilator assignments first
        await db.query('DELETE FROM exam_invigilators WHERE exam_id = ?', [examId]);
        
        // Then delete the exam
        await db.query('DELETE FROM exams WHERE id = ?', [examId]);
        
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam:', error);
        res.status(500).json({ message: 'Error deleting exam' });
    }
}; 