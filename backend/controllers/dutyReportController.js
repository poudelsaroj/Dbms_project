const db = require('../config/db');

// Create duty report
exports.createDutyReport = async (req, res) => {
    try {
        const { exam_id, invigilator_id, attendance_status, report_text } = req.body;

        const [result] = await db.query(
            `INSERT INTO duty_reports 
            (exam_id, invigilator_id, attendance_status, report_text) 
            VALUES (?, ?, ?, ?)`,
            [exam_id, invigilator_id, attendance_status, report_text]
        );

        res.status(201).json({
            message: 'Duty report created successfully',
            reportId: result.insertId
        });
    } catch (error) {
        console.error('Error creating duty report:', error);
        res.status(500).json({ message: 'Error creating duty report' });
    }
};

// Get duty reports for an exam
exports.getExamDutyReports = async (req, res) => {
    try {
        const [reports] = await db.query(`
            SELECT dr.*, i.name as invigilator_name 
            FROM duty_reports dr
            JOIN invigilators i ON dr.invigilator_id = i.id
            WHERE dr.exam_id = ?
            ORDER BY dr.created_at DESC`,
            [req.params.examId]
        );
        res.json(reports);
    } catch (error) {
        console.error('Error fetching duty reports:', error);
        res.status(500).json({ message: 'Error fetching duty reports' });
    }
};

// Get duty reports for an invigilator
exports.getInvigilatorDutyReports = async (req, res) => {
    try {
        const [reports] = await db.query(`
            SELECT dr.*, e.subject_name, e.exam_date
            FROM duty_reports dr
            JOIN exams e ON dr.exam_id = e.id
            WHERE dr.invigilator_id = ?
            ORDER BY dr.created_at DESC`,
            [req.params.invigilatorId]
        );
        res.json(reports);
    } catch (error) {
        console.error('Error fetching duty reports:', error);
        res.status(500).json({ message: 'Error fetching duty reports' });
    }
};

// Update duty report
exports.updateDutyReport = async (req, res) => {
    try {
        const { attendance_status, report_text } = req.body;

        await db.query(
            `UPDATE duty_reports 
             SET attendance_status = ?, report_text = ?
             WHERE id = ?`,
            [attendance_status, report_text, req.params.id]
        );

        res.json({ message: 'Duty report updated successfully' });
    } catch (error) {
        console.error('Error updating duty report:', error);
        res.status(500).json({ message: 'Error updating duty report' });
    }
};

// Delete duty report
exports.deleteDutyReport = async (req, res) => {
    try {
        await db.query('DELETE FROM duty_reports WHERE id = ?', [req.params.id]);
        res.json({ message: 'Duty report deleted successfully' });
    } catch (error) {
        console.error('Error deleting duty report:', error);
        res.status(500).json({ message: 'Error deleting duty report' });
    }
}; 