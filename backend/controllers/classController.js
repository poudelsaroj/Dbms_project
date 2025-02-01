const db = require('../config/db');

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM classes ORDER BY building, floor, name');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ message: 'Error fetching classes' });
    }
};

// Create new class
exports.createClass = async (req, res) => {
    try {
        const { name, capacity, building, floor } = req.body;
        
        // Validate input
        if (!name || !capacity) {
            return res.status(400).json({ message: 'Name and capacity are required' });
        }

        const [result] = await db.query(
            'INSERT INTO classes (name, capacity, building, floor) VALUES (?, ?, ?, ?)',
            [name, capacity, building, floor]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            capacity,
            building,
            floor
        });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Error creating class' });
    }
};

// Get single class
exports.getClass = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM classes WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({ message: 'Error fetching class' });
    }
};

// Update class
exports.updateClass = async (req, res) => {
    try {
        const { name, capacity, building, floor } = req.body;
        
        if (!name || !capacity) {
            return res.status(400).json({ message: 'Name and capacity are required' });
        }

        await db.query(
            'UPDATE classes SET name = ?, capacity = ?, building = ?, floor = ? WHERE id = ?',
            [name, capacity, building, floor, req.params.id]
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
        // Check if class is being used in any exams
        const [exams] = await db.query(
            'SELECT * FROM exams WHERE room_number IN (SELECT name FROM classes WHERE id = ?)',
            [req.params.id]
        );

        if (exams.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete class as it is being used in scheduled exams' 
            });
        }

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
                JOIN exams e ON c2.name = e.room_number
                WHERE e.exam_date = ?
                AND (
                    (e.start_time <= ? AND e.end_time > ?) OR
                    (e.start_time < ? AND e.end_time >= ?) OR
                    (e.start_time >= ? AND e.end_time <= ?)
                )
            )
            ORDER BY c.building, c.floor, c.name
        `, [date, end_time, start_time, end_time, start_time, start_time, end_time]);

        res.json(availableClasses);
    } catch (error) {
        console.error('Error fetching available classes:', error);
        res.status(500).json({ message: 'Error fetching available classes' });
    }
}; 