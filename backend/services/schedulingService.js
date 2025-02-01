const db = require('../config/db');

class SchedulingService {
    // Check optimal room assignment based on exam capacity
    static async findOptimalRoom(studentCount, date, startTime, endTime) {
        try {
            const [availableRooms] = await db.query(`
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
                AND c.capacity >= ?
                ORDER BY c.capacity ASC
                LIMIT 1
            `, [date, endTime, startTime, endTime, startTime, startTime, endTime, studentCount]);

            return availableRooms[0] || null;
        } catch (error) {
            console.error('Error finding optimal room:', error);
            throw error;
        }
    }

    // Find best invigilators based on workload and department
    static async findOptimalInvigilators(examDate, startTime, endTime, subjectDepartment, requiredCount) {
        try {
            const [availableInvigilators] = await db.query(`
                SELECT 
                    i.*,
                    COUNT(ei.exam_id) as current_workload
                FROM invigilators i
                LEFT JOIN exam_invigilators ei ON i.id = ei.invigilator_id
                LEFT JOIN exams e ON ei.exam_id = e.id
                WHERE i.id NOT IN (
                    SELECT DISTINCT i2.id
                    FROM invigilators i2
                    JOIN exam_invigilators ei2 ON i2.id = ei2.invigilator_id
                    JOIN exams e2 ON ei2.exam_id = e2.id
                    WHERE e2.exam_date = ?
                    AND (
                        (e2.start_time <= ? AND e2.end_time > ?) OR
                        (e2.start_time < ? AND e2.end_time >= ?) OR
                        (e2.start_time >= ? AND e2.end_time <= ?)
                    )
                )
                GROUP BY i.id
                ORDER BY 
                    CASE WHEN i.department = ? THEN 0 ELSE 1 END,
                    current_workload ASC
                LIMIT ?
            `, [examDate, endTime, startTime, endTime, startTime, startTime, endTime, subjectDepartment, requiredCount]);

            return availableInvigilators;
        } catch (error) {
            console.error('Error finding optimal invigilators:', error);
            throw error;
        }
    }

    // Calculate required number of invigilators based on student count
    static calculateRequiredInvigilators(studentCount) {
        if (studentCount <= 30) return 1;
        if (studentCount <= 60) return 2;
        if (studentCount <= 100) return 3;
        return Math.ceil(studentCount / 40); // One invigilator per 40 students for larger groups
    }

    // Check for back-to-back exams for students
    static async checkStudentScheduleConflicts(examDate, courseCode) {
        try {
            const [conflicts] = await db.query(`
                SELECT e.*
                FROM exams e
                JOIN course_students cs1 ON e.course_code = cs1.course_code
                JOIN course_students cs2 ON cs1.student_id = cs2.student_id
                WHERE cs2.course_code = ?
                AND e.exam_date = ?
                ORDER BY e.start_time
            `, [courseCode, examDate]);

            return conflicts;
        } catch (error) {
            console.error('Error checking student schedule conflicts:', error);
            throw error;
        }
    }

    // Generate optimal exam schedule for multiple exams
    static async generateOptimalSchedule(exams) {
        const schedule = [];
        for (const exam of exams) {
            try {
                // Find optimal room
                const room = await this.findOptimalRoom(
                    exam.student_count,
                    exam.preferred_date,
                    exam.preferred_start_time,
                    exam.preferred_end_time
                );

                if (!room) continue;

                // Calculate required invigilators
                const requiredInvigilators = this.calculateRequiredInvigilators(exam.student_count);

                // Find optimal invigilators
                const invigilators = await this.findOptimalInvigilators(
                    exam.preferred_date,
                    exam.preferred_start_time,
                    exam.preferred_end_time,
                    exam.department,
                    requiredInvigilators
                );

                if (invigilators.length < requiredInvigilators) continue;

                schedule.push({
                    ...exam,
                    assigned_room: room,
                    assigned_invigilators: invigilators,
                    status: 'scheduled'
                });
            } catch (error) {
                console.error(`Error scheduling exam ${exam.id}:`, error);
            }
        }

        return schedule;
    }

    // Check invigilator preferences and constraints
    static async checkInvigilatorPreferences(invigilatorId, examDate, startTime, endTime) {
        try {
            const [preferences] = await db.query(`
                SELECT 
                    preferred_days,
                    preferred_time_slots,
                    max_exams_per_day,
                    max_exams_per_week
                FROM invigilator_preferences
                WHERE invigilator_id = ?
            `, [invigilatorId]);

            if (preferences.length === 0) return true;

            const pref = preferences[0];

            // Check day preference
            const dayOfWeek = new Date(examDate).getDay();
            if (pref.preferred_days && !pref.preferred_days.includes(dayOfWeek)) {
                return false;
            }

            // Check time slot preference
            if (pref.preferred_time_slots) {
                const timeSlots = JSON.parse(pref.preferred_time_slots);
                const examTimeSlot = `${startTime}-${endTime}`;
                if (!timeSlots.includes(examTimeSlot)) {
                    return false;
                }
            }

            // Check daily limit
            const [dailyCount] = await db.query(`
                SELECT COUNT(*) as count
                FROM exam_invigilators ei
                JOIN exams e ON ei.exam_id = e.id
                WHERE ei.invigilator_id = ?
                AND e.exam_date = ?
            `, [invigilatorId, examDate]);

            if (dailyCount[0].count >= pref.max_exams_per_day) {
                return false;
            }

            // Check weekly limit
            const weekStart = new Date(examDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const [weeklyCount] = await db.query(`
                SELECT COUNT(*) as count
                FROM exam_invigilators ei
                JOIN exams e ON ei.exam_id = e.id
                WHERE ei.invigilator_id = ?
                AND e.exam_date BETWEEN ? AND ?
            `, [invigilatorId, weekStart, weekEnd]);

            if (weeklyCount[0].count >= pref.max_exams_per_week) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking invigilator preferences:', error);
            throw error;
        }
    }
}

module.exports = SchedulingService; 