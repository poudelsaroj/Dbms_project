const db = require('../config/db');

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const [departments] = await db.query('SELECT * FROM departments ORDER BY name');
        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: 'Error fetching departments' });
    }
};

// Get single department
exports.getDepartment = async (req, res) => {
    try {
        const [department] = await db.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
        
        if (department.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        res.json(department[0]);
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).json({ message: 'Error fetching department' });
    }
};

// Create department
exports.createDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({ message: 'Name and code are required' });
        }

        const [result] = await db.query(
            'INSERT INTO departments (name, code) VALUES (?, ?)',
            [name, code]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            code
        });
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ message: 'Error creating department' });
    }
};

// Update department
exports.updateDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({ message: 'Name and code are required' });
        }

        await db.query(
            'UPDATE departments SET name = ?, code = ? WHERE id = ?',
            [name, code, req.params.id]
        );

        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ message: 'Error updating department' });
    }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
    try {
        await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ message: 'Error deleting department' });
    }
}; 