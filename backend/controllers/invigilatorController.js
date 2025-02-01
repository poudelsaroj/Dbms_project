const db = require('../config/db');

// Get all invigilators
exports.getAllInvigilators = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM invigilators');
        console.log('Fetched data:', rows); // Debug log
        res.status(200).json(rows); // Send array directly
    } catch (error) {
        console.error('Error fetching invigilators:', error);
        res.status(500).json([]);
    }
};

// Create invigilator
exports.createInvigilator = async (req, res) => {
    try {
        const { name, email, phone, department } = req.body;
        const [result] = await db.query(
            'INSERT INTO invigilators (name, email, phone, department) VALUES (?, ?, ?, ?)',
            [name, email, phone, department]
        );
        res.status(201).json({
            id: result.insertId,
            name,
            email,
            phone,
            department
        });
    } catch (error) {
        console.error('Error creating invigilator:', error);
        res.status(500).json({ message: 'Error creating invigilator' });
    }
};

// Get single invigilator
exports.getInvigilator = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM invigilators WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Invigilator not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invigilator' });
    }
};

// Update invigilator
exports.updateInvigilator = async (req, res) => {
    try {
        const { name, email, phone, department } = req.body;
        await db.query(
            'UPDATE invigilators SET name = ?, email = ?, phone = ?, department = ? WHERE id = ?',
            [name, email, phone, department, req.params.id]
        );
        res.json({ message: 'Invigilator updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating invigilator' });
    }
};

// Delete invigilator
exports.deleteInvigilator = async (req, res) => {
    try {
        await db.query('DELETE FROM invigilators WHERE id = ?', [req.params.id]);
        res.json({ message: 'Invigilator deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invigilator' });
    }
};

// Add this new method for checking availability
exports.checkAvailability = async (req, res) => {
    try {
        const { date, start_time, end_time } = req.query;
        
        // Get all invigilators with their exam assignments for the specified time
        const [assignments] = await db.query(`
            SELECT 
                i.id,
                i.name,
                i.department,
                e.subject_name,
                e.start_time,
                e.end_time,
                e.exam_date
            FROM invigilators i
            LEFT JOIN exam_invigilators ei ON i.id = ei.invigilator_id
            LEFT JOIN exams e ON ei.exam_id = e.id
            WHERE e.exam_date = ?
            AND (
                (e.start_time <= ? AND e.end_time > ?) OR
                (e.start_time < ? AND e.end_time >= ?) OR
                (e.start_time >= ? AND e.end_time <= ?)
            )
        `, [date, end_time, start_time, end_time, start_time, start_time, end_time]);

        // Get all invigilators
        const [allInvigilators] = await db.query('SELECT id FROM invigilators');

        // Create availability object
        const availability = {};
        allInvigilators.forEach(invigilator => {
            availability[invigilator.id] = {
                isAvailable: true,
                reason: null,
                assignments: []
            };
        });

        // Mark unavailable invigilators
        assignments.forEach(assignment => {
            if (assignment.exam_date) {
                availability[assignment.id] = {
                    isAvailable: false,
                    reason: `Assigned to ${assignment.subject_name} (${formatTime(assignment.start_time)} - ${formatTime(assignment.end_time)})`,
                    assignments: [{
                        subject: assignment.subject_name,
                        start_time: assignment.start_time,
                        end_time: assignment.end_time
                    }]
                };
            }
        });

        res.json(availability);
    } catch (error) {
        console.error('Error checking invigilator availability:', error);
        res.status(500).json({ message: 'Error checking availability' });
    }
};

// Helper function to format time
const formatTime = (timeString) => {
    return timeString.slice(0, 5);
};

// Add workload tracking
exports.getInvigilatorWorkload = async (req, res) => {
    try {
        const [workload] = await db.query(`
            SELECT 
                i.id,
                i.name,
                i.department,
                COUNT(ei.exam_id) as total_assignments,
                GROUP_CONCAT(
                    CONCAT(
                        e.subject_name, ' on ', 
                        DATE_FORMAT(e.exam_date, '%Y-%m-%d'), ' at ',
                        TIME_FORMAT(e.start_time, '%H:%i')
                    )
                ) as upcoming_exams
            FROM invigilators i
            LEFT JOIN exam_invigilators ei ON i.id = ei.invigilator_id
            LEFT JOIN exams e ON ei.exam_id = e.id
            WHERE e.exam_date >= CURDATE()
            GROUP BY i.id
            ORDER BY total_assignments DESC
        `);

        res.json(workload);
    } catch (error) {
        console.error('Error fetching invigilator workload:', error);
        res.status(500).json({ message: 'Error fetching workload' });
    }
};
