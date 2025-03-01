const db = require('../config/db');

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const [classes] = await db.query(`
            SELECT c.*, d.name as department_name 
            FROM classes c 
            LEFT JOIN departments d ON c.department_id = d.id
        `);
        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ message: 'Error fetching classes' });
    }
};

// Get single class
exports.getClass = async (req, res) => {
    try {
        const [classes] = await db.query('SELECT * FROM classes WHERE id = ?', [req.params.id]);
        if (classes.length === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.json(classes[0]);
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({ message: 'Error fetching class' });
    }
};

// Create class
exports.createClass = async (req, res) => {
    try {
        const { name, department_id, semester, section, student_count } = req.body;

        // Validate required fields
        if (!name || !department_id || !semester || !student_count) {
            return res.status(400).json({ 
                message: 'Name, department, semester and student count are required' 
            });
        }

        // Insert the class
        const [result] = await db.query(
            'INSERT INTO classes (name, department_id, semester, section, student_count) VALUES (?, ?, ?, ?, ?)',
            [name, department_id, semester, section, student_count]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            department_id,
            semester,
            section,
            student_count
        });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Error creating class' });
    }
};

// Update class
exports.updateClass = async (req, res) => {
    try {
        const { name, department_id, semester, section, student_count } = req.body;
        
        if (!name || !department_id || !semester || !student_count) {
            return res.status(400).json({ 
                message: 'Name, department, semester and student count are required' 
            });
        }

        await db.query(
            'UPDATE classes SET name = ?, department_id = ?, semester = ?, section = ?, student_count = ? WHERE id = ?',
            [name, department_id, semester, section, student_count, req.params.id]
        );

        res.json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ message: 'Error updating class' });
    }
};

// Delete class
exports.deleteClass = async (req, res) => {
    try {
        await db.query('DELETE FROM classes WHERE id = ?', [req.params.id]);
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ message: 'Error deleting class' });
    }
};

// Get available classes for a specific time slot
exports.getAvailableClasses = async (req, res) => {
    try {
        const { date, start_time, end_time } = req.query;

        const [availableClasses] = await db.query(`
            SELECT c.* 
            FROM classes c
            WHERE c.id NOT IN (
                SELECT DISTINCT c2.id
                FROM classes c2
                JOIN exams e ON c2.room_number = e.room_number
                WHERE e.exam_date = ?
                AND (
                    (e.start_time <= ? AND e.end_time > ?) OR
                    (e.start_time < ? AND e.end_time >= ?) OR
                    (e.start_time >= ? AND e.end_time <= ?)
                )
            )
            ORDER BY c.building, c.floor, c.room_number
        `, [date, end_time, start_time, end_time, start_time, start_time, end_time]);

        res.json(availableClasses);
    } catch (error) {
        console.error('Error fetching available classes:', error);
        res.status(500).json({ message: 'Error fetching available classes' });
    }
};

exports.getClassStats = async (req, res) => {
    try {
        const [[stats]] = await db.query(`
            SELECT COUNT(*) as total 
            FROM classes
        `);

        res.json({
            total: parseInt(stats.total) || 0
        });
    } catch (error) {
        console.error('Error fetching class stats:', error);
        res.status(500).json({ message: 'Error fetching class statistics' });
    }
};