const { validateEmail, validatePhone } = require('../utils/validation');
const db = require('../config/db');

exports.validateInvigilator = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            department_id,
            phone,
            designation,
            max_duties_per_day,
            max_duties_per_week
        } = req.body;

        // Required fields validation
        if (!name || !email || (!req.params.id && !password)) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        // Email validation
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

        // Phone validation (if provided)
        if (phone && !validatePhone(phone)) {
            return res.status(400).json({
                message: 'Invalid phone number format'
            });
        }

        // Check if email already exists
        const [existingInvigilator] = await db.query(
            'SELECT id FROM invigilators WHERE email = ? AND id != ?',
            [email, req.params.id || 0]
        );

        if (existingInvigilator.length > 0) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        // Validate department
        if (department_id) {
            const [department] = await db.query(
                'SELECT id FROM departments WHERE id = ?',
                [department_id]
            );

            if (department.length === 0) {
                return res.status(400).json({
                    message: 'Invalid department selected'
                });
            }
        }

        // Validate duty limits
        if (max_duties_per_day && (max_duties_per_day < 1 || max_duties_per_day > 5)) {
            return res.status(400).json({
                message: 'Max duties per day must be between 1 and 5'
            });
        }

        if (max_duties_per_week && (max_duties_per_week < 1 || max_duties_per_week > 20)) {
            return res.status(400).json({
                message: 'Max duties per week must be between 1 and 20'
            });
        }

        next();
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ message: 'Error validating invigilator data' });
    }
}; 