const db = require('../config/db');

exports.getAllRooms = async (req, res) => {
    try {
        const [rooms] = await db.query('SELECT * FROM rooms ORDER BY room_number');
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Error fetching rooms' });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const [room] = await db.query(
            'SELECT * FROM rooms WHERE id = ?',
            [req.params.id]
        );
        
        if (!room[0]) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        res.json(room[0]);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ message: 'Error fetching room' });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const { room_number, capacity, building, floor } = req.body;
        
        if (!room_number || !capacity) {
            return res.status(400).json({ message: 'Room number and capacity are required' });
        }
        
        const [result] = await db.query(
            'INSERT INTO rooms (room_number, capacity, building, floor) VALUES (?, ?, ?, ?)',
            [room_number, capacity, building, floor]
        );
        
        res.status(201).json({
            id: result.insertId,
            room_number,
            capacity,
            building,
            floor
        });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Error creating room' });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const { room_number, capacity, building, floor } = req.body;
        
        if (!room_number || !capacity) {
            return res.status(400).json({ message: 'Room number and capacity are required' });
        }
        
        await db.query(
            'UPDATE rooms SET room_number = ?, capacity = ?, building = ?, floor = ? WHERE id = ?',
            [room_number, capacity, building, floor, req.params.id]
        );
        
        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Error updating room' });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        await db.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Error deleting room' });
    }
};

exports.getRoomSchedule = async (req, res) => {
    try {
        const [schedule] = await db.query(`
            SELECT 
                e.*,
                GROUP_CONCAT(i.name) as invigilator_names
            FROM exams e
            LEFT JOIN exam_invigilators ei ON e.id = ei.exam_id
            LEFT JOIN invigilators i ON ei.invigilator_id = i.id
            WHERE e.room_id = ?
            GROUP BY e.id
            ORDER BY e.exam_date, e.start_time
        `, [req.params.id]);
        
        res.json(schedule);
    } catch (error) {
        console.error('Error fetching room schedule:', error);
        res.status(500).json({ message: 'Error fetching room schedule' });
    }
}; 