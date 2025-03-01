const db = require('../config/db');
const { validateExamTiming } = require('../utils/validation');

// Create new exam with invigilator assignments
exports.createExam = async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const {
        subject_name,
        subject_code,
        department_id,
        exam_date,
        start_time,
        end_time,
        room_id,
        student_count,
        invigilator_ids
      } = req.body;

      // Validate exam timing
      const timingValidation = await validateExamTiming(
        exam_date,
        start_time,
        end_time,
        room_id,
        invigilator_ids
      );

      if (!timingValidation.isValid) {
        return res.status(400).json({
          message: 'Invalid exam timing',
          conflicts: timingValidation.conflicts
        });
      }

      // Insert exam
      const [result] = await connection.query(
        'INSERT INTO exams (subject_name, subject_code, exam_date, start_time, end_time, room_id, department_id, student_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [subject_name, subject_code, exam_date, start_time, end_time, room_id, department_id, student_count]
      );
      
      const examId = result.insertId;
      
      // Insert invigilator assignments if any
      if (invigilator_ids && invigilator_ids.length > 0) {
        const values = invigilator_ids.map(id => [examId, id]);
        await connection.query(
          'INSERT INTO exam_invigilators (exam_id, invigilator_id) VALUES ?',
          [values]
        );
      }
      
      await connection.commit();
      connection.release();
      
      res.status(201).json({
        message: 'Exam created successfully',
        examId: examId
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({
      message: 'Failed to create exam',
      error: error.message
    });
  }
};

// Get all exams with assigned invigilators
exports.getAllExams = async (req, res) => {
  try {
    const [exams] = await db.query(`
      SELECT 
        e.*,
        d.name as department_name,
        r.room_number,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', i.id,
            'name', i.name,
            'department', d2.name,
            'status', ei.duty_status
          )
        ) as invigilators
      FROM exams e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN rooms r ON e.room_id = r.id
      LEFT JOIN exam_invigilators ei ON e.id = ei.exam_id
      LEFT JOIN invigilators i ON ei.invigilator_id = i.id
      LEFT JOIN departments d2 ON i.department_id = d2.id
      GROUP BY e.id
      ORDER BY e.exam_date, e.start_time
    `);

    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Error fetching exams' });
  }
};

// Get single exam
exports.getExam = async (req, res) => {
  try {
    const [exam] = await db.query(`
      SELECT 
        e.*,
        d.name as department_name,
        r.room_number,
        GROUP_CONCAT(i.id) as invigilator_ids
      FROM exams e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN rooms r ON e.room_id = r.id
      LEFT JOIN exam_invigilators ei ON e.id = ei.exam_id
      LEFT JOIN invigilators i ON ei.invigilator_id = i.id
      WHERE e.id = ?
      GROUP BY e.id
    `, [req.params.id]);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Error fetching exam' });
  }
};

// Get exams by department
exports.getExamsByDepartment = async (req, res) => {
  try {
    const [exams] = await db.query(`
      SELECT * FROM exams 
      WHERE department_id = ?
      ORDER BY exam_date, start_time
    `, [req.params.departmentId]);

    res.json(exams);
  } catch (error) {
    console.error('Error fetching department exams:', error);
    res.status(500).json({ message: 'Error fetching department exams' });
  }
};

// Get exams by room
exports.getExamsByRoom = async (req, res) => {
  try {
    const [exams] = await db.query(`
      SELECT * FROM exams 
      WHERE room_id = ?
      ORDER BY exam_date, start_time
    `, [req.params.roomId]);

    res.json(exams);
  } catch (error) {
    console.error('Error fetching room exams:', error);
    res.status(500).json({ message: 'Error fetching room exams' });
  }
};

// Get exams by date
exports.getExamsByDate = async (req, res) => {
  try {
    const [exams] = await db.query(`
      SELECT * FROM exams 
      WHERE exam_date = ?
      ORDER BY start_time
    `, [req.params.date]);

    res.json(exams);
  } catch (error) {
    console.error('Error fetching date exams:', error);
    res.status(500).json({ message: 'Error fetching date exams' });
  }
};

// Update exam and assignments
exports.updateExam = async (req, res) => {
  const connection = await db.beginTransaction();
  try {
    const examId = req.params.id;
    const {
      subject_name,
      subject_code,
      department_id,
      exam_date,
      start_time,
      end_time,
      room_id,
      student_count,
      invigilator_ids
    } = req.body;

    // Update exam details
    await connection.query(
      `UPDATE exams SET 
        subject_name = ?, subject_code = ?, department_id = ?,
        exam_date = ?, start_time = ?, end_time = ?,
        room_id = ?, student_count = ?
      WHERE id = ?`,
      [subject_name, subject_code, department_id, exam_date,
       start_time, end_time, room_id, student_count, examId]
    );

    // Update invigilator assignments
    await connection.query('DELETE FROM exam_invigilators WHERE exam_id = ?', [examId]);
    
    if (invigilator_ids?.length > 0) {
      const values = invigilator_ids.map(id => [examId, id]);
      await connection.query(
        'INSERT INTO exam_invigilators (exam_id, invigilator_id) VALUES ?',
        [values]
      );
    }

    await connection.commit();
    res.json({ message: 'Exam updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating exam:', error);
    res.status(500).json({ message: 'Error updating exam' });
  } finally {
    connection.release();
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    await db.query('DELETE FROM exams WHERE id = ?', [req.params.id]);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: 'Error deleting exam' });
  }
};

// Get exam statistics
exports.getExamStats = async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        COUNT(*) as total_exams,
        COUNT(CASE WHEN exam_date >= CURDATE() THEN 1 END) as upcoming_exams,
        COUNT(CASE WHEN exam_date < CURDATE() THEN 1 END) as completed_exams
      FROM exams
    `);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching exam stats:', error);
    res.status(500).json({ message: 'Error fetching exam statistics' });
  }
};