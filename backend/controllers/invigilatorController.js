const bcrypt = require('bcrypt');
const db = require('../config/db');

// Get all invigilators
exports.getAllInvigilators = async (req, res) => {
    try {
        const [invigilators] = await db.query(`
            SELECT i.*, d.name as department_name 
            FROM invigilators i 
            LEFT JOIN departments d ON i.department_id = d.id
            ORDER BY i.name
        `);
        res.json(invigilators);
    } catch (error) {
        console.error('Error fetching invigilators:', error);
        res.status(500).json({ message: 'Error fetching invigilators' });
    }
};

// Create invigilator
exports.createInvigilator = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department_id,
            phone,
            designation,
            max_duties_per_day = 2,
            max_duties_per_week = 10
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !department_id) {
            return res.status(400).json({
                message: 'Name, email, password and department are required'
            });
        }

        // Check if email exists
        const [existing] = await db.query(
            'SELECT id FROM invigilators WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert invigilator
        const [result] = await db.query(
            `INSERT INTO invigilators 
            (name, email, password, department_id, phone, designation, max_duties_per_day, max_duties_per_week, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [name, email, hashedPassword, department_id, phone || null, designation || 'Invigilator', max_duties_per_day, max_duties_per_week]
        );
        
        res.status(201).json({
            message: 'Invigilator created successfully',
            invigilatorId: result.insertId
        });

    } catch (error) {
        console.error('Error creating invigilator:', error);
        res.status(500).json({ message: 'Error creating invigilator' });
    }
};

// Get single invigilator
exports.getInvigilator = async (req, res) => {
    try {
        const [invigilator] = await db.query(
            `SELECT i.*, d.name as department_name 
             FROM invigilators i 
             LEFT JOIN departments d ON i.department_id = d.id 
             WHERE i.id = ?`,
            [req.params.id]
        );

        if (!invigilator[0]) {
            return res.status(404).json({ message: 'Invigilator not found' });
        }

        res.json(invigilator[0]);
    } catch (error) {
        console.error('Error fetching invigilator:', error);
        res.status(500).json({ message: 'Error fetching invigilator' });
    }
};

// Update invigilator
exports.updateInvigilator = async (req, res) => {
    try {
        const { name, email, department_id, phone, designation, max_duties_per_day, max_duties_per_week, status } = req.body;

        await db.query(
            `UPDATE invigilators 
             SET name = ?, email = ?, department_id = ?, phone = ?, 
                 designation = ?, max_duties_per_day = ?, max_duties_per_week = ?, 
                 status = ?
             WHERE id = ?`,
            [name, email, department_id, phone, designation, 
             max_duties_per_day, max_duties_per_week, status, req.params.id]
        );

        res.json({ message: 'Invigilator updated successfully' });
    } catch (error) {
        console.error('Error updating invigilator:', error);
        res.status(500).json({ message: 'Error updating invigilator' });
    }
};

// Delete invigilator
exports.deleteInvigilator = async (req, res) => {
    try {
        await db.query('DELETE FROM invigilators WHERE id = ?', [req.params.id]);
        res.json({ message: 'Invigilator deleted successfully' });
    } catch (error) {
        console.error('Error deleting invigilator:', error);
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
                // Format time
                const formatTime = (timeString) => {
                    return timeString.slice(0, 5);
                };

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

// Add invigilator statistics
exports.getInvigilatorStats = async (req, res) => {
    try {
        const [[stats]] = await db.query(`
            SELECT COUNT(*) as total 
            FROM invigilators
        `);
        
        res.json({
            total: parseInt(stats.total) || 0
        });
    } catch (error) {
        console.error('Error fetching invigilator stats:', error);
        res.status(500).json({ message: 'Error fetching invigilator statistics' });
    }
};

// Register invigilator
exports.registerInvigilator = async (req, res) => {
    try {
        const { name, email, password, phone, department, designation } = req.body;

        // Check if email already exists
        const [existing] = await db.query(
            'SELECT id FROM invigilators WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO invigilators 
            (name, email, password, phone, department, designation) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone || null, department || null, designation || null]
        );

        res.status(201).json({
            message: 'Invigilator registered successfully',
            invigilatorId: result.insertId
        });
    } catch (error) {
        console.error('Error registering invigilator:', error);
        res.status(500).json({ message: 'Error registering invigilator' });
    }
};

exports.getInvigilatorSchedule = async (req, res) => {
    try {
        const invigilatorId = req.params.id;
        const [schedule] = await db.query(`
            SELECT 
                e.id as exam_id,
                e.subject_name,
                e.subject_code,
                e.exam_date,
                e.start_time,
                e.end_time,
                r.room_number,
                d.name as department_name,
                ei.duty_status
            FROM exam_invigilators ei
            JOIN exams e ON ei.exam_id = e.id
            JOIN rooms r ON e.room_id = r.id
            JOIN departments d ON e.department_id = d.id
            WHERE ei.invigilator_id = ?
            ORDER BY e.exam_date, e.start_time
        `, [invigilatorId]);

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching invigilator schedule:', error);
        res.status(500).json({ message: 'Error fetching schedule' });
    }
};

exports.updateInvigilatorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            'UPDATE invigilators SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ message: 'Invigilator status updated successfully' });
    } catch (error) {
        console.error('Error updating invigilator status:', error);
        res.status(500).json({ message: 'Error updating status' });
    }
};
