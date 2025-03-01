import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="logo">
				<Link to="/">
					<h1>ExamGuard</h1>
				</Link>
			</div>
			<div className="nav-links">
				<Link to="/" className="nav-link">
					Home
				</Link>
				<Link to="/about" className="nav-link">
					About
				</Link>
				<Link to="/contact" className="nav-link">
					Contact
				</Link>
				<Link to="/login" className="nav-link login-btn">
					Login
				</Link>
				<Link to="/signup" className="nav-link signup-btn">
					Sign Up
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
