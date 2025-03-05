const db = require('../config/db');

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const [schedules] = await db.query(`
      SELECT 
        s.id,
        i.name as invigilator_name,
        i.id as invigilator_id,
        e.subject_name as exam_name,
        e.id as exam_id,
        e.exam_date as date,
        e.start_time,
        e.end_time,
        e.room_number
      FROM exam_invigilators s
      JOIN invigilators i ON s.invigilator_id = i.id
      JOIN exams e ON s.exam_id = e.id
      ORDER BY e.exam_date, e.start_time
    `);
    
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules' });
  }
};

// Create schedule
exports.createSchedule = async (req, res) => {
  try {
    const { invigilator_id, exam_id } = req.body;
    
    // Check if already assigned
    const [existing] = await db.query(
      'SELECT * FROM exam_invigilators WHERE invigilator_id = ? AND exam_id = ?',
      [invigilator_id, exam_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'This invigilator is already assigned to this exam' });
    }
    
    // Check if invigilator is available for this exam time
    const [exam] = await db.query('SELECT exam_date, start_time, end_time FROM exams WHERE id = ?', [exam_id]);
    
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    const { exam_date, start_time, end_time } = exam[0];
    
    // Check for time conflicts
    const [conflicts] = await db.query(`
      SELECT e.*
      FROM exam_invigilators s
      JOIN exams e ON s.exam_id = e.id
      WHERE s.invigilator_id = ?
      AND e.exam_date = ?
      AND (
        (e.start_time <= ? AND e.end_time > ?) OR
        (e.start_time < ? AND e.end_time >= ?) OR
        (e.start_time >= ? AND e.end_time <= ?)
      )
    `, [invigilator_id, exam_date, end_time, start_time, end_time, start_time, start_time, end_time]);
    
    if (conflicts.length > 0) {
      return res.status(400).json({ 
        message: 'Time conflict with another assigned duty',
        conflict: conflicts[0]
      });
    }
    
    // Create schedule
    const [result] = await db.query(
      'INSERT INTO exam_invigilators (invigilator_id, exam_id) VALUES (?, ?)',
      [invigilator_id, exam_id]
    );
    
    res.status(201).json({
      id: result.insertId,
      invigilator_id,
      exam_id
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
    await db.query('DELETE FROM exam_invigilators WHERE invigilator_id = ? AND exam_id = ?', [req.params.id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule' });
  }
};

exports.getSchedules = async (req, res) => {
    try {
        const [schedules] = await db.query(`
            SELECT 
                ei.*,
                e.subject_name,
                e.subject_code,
                e.exam_date,
                e.start_time,
                e.end_time,
                e.room_id,
                r.room_number,
                i.name as invigilator_name,
                i.department as invigilator_department
            FROM exam_invigilators ei
            JOIN exams e ON ei.exam_id = e.id
            JOIN invigilators i ON ei.invigilator_id = i.id
            LEFT JOIN rooms r ON e.room_id = r.id
            ORDER BY e.exam_date, e.start_time
        `);
        
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Error fetching schedules' });
    }
};