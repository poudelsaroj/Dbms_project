const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

// User login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log("email", email);
		// Check if user exists
		const [users] = await db.query(
			"SELECT * FROM invigilators WHERE email = ?",
			[email]
		);
        console.log(users);
        // console.log(users.length);

		if (users.length === 0) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const user = users[0];
        // console.log(user.password, password)

		// Check if password matches
		// const isPasswordValid = await bcrypt.compare(password, user.password);
		const isPasswordValid = password === user.password;
		// console.log(isPasswordValid);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Create token
		const token = jwt.sign({ id: user.id, role: user.designation?.toLowerCase() === "administrator" ? "admin" : "invigilator"}, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		// Return token and user data
		res.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.designation?.toLowerCase() === "administrator" ? "admin" : "invigilator",
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error during login" });
	}
};

// Token verification
exports.verifyToken = async (req, res) => {
	try {
		const [invigilator] = await db.query(
			"SELECT i.*, d.name as department_name FROM invigilators i LEFT JOIN departments d ON i.department_id = d.id WHERE i.id = ?",
			[req.user.id]
		);
		console.log(req.user);
		console.log(invigilator);
		if (!invigilator[0]) {
			return res.status(401).json({ message: "User not found" });
		}

		const user = invigilator[0];
		console.log(user);
		const isAdmin = user.designation?.toLowerCase() === "administrator";
		console.log(isAdmin + "post" + user.designation)
		res.json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: isAdmin ? "admin" : "invigilator",
				department: user.department_name,
				designation: user.designation,
			},
		});
	} catch (error) {
		console.error("Token verification error:", error);
		res.status(500).json({ message: "Error verifying token" });
	}
};

// Signup (only for testing, should be removed in production)
exports.signup = async (req, res) => {
	try {
		const { name, email, password, department_id, designation } = req.body;

		// Check if email exists
		const [existing] = await db.query(
			"SELECT id FROM invigilators WHERE email = ?",
			[email]
		);

		if (existing.length > 0) {
			return res.status(400).json({ message: "Email already registered" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create invigilator
		const [result] = await db.query(
			`INSERT INTO invigilators (name, email, password, department_id, designation) 
             VALUES (?, ?, ?, ?, ?)`,
			[name, email, hashedPassword, department_id, designation]
		);

		res.status(201).json({
			message: "Account created successfully",
			id: result.insertId,
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "Error creating account" });
	}
};

// Logout
exports.logout = (req, res) => {
	res.json({ message: "Logged out successfully" });
};
