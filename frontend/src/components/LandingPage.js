import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const LandingPage = () => {
	return (
		<div className="landing-page">
			<Navbar />
			<div className="hero-section">
				<div className="hero-content">
					<h1>Streamline Your Examination Process</h1>
					<p>Efficient invigilator management for seamless exam operations</p>
					<div className="cta-buttons">
						<Link to="/login" className="cta-button primary">
							Get Started
						</Link>
						<Link to="/about" className="cta-button secondary">
							Learn More
						</Link>
					</div>
				</div>
				<div className="hero-image">
					<img
						src="/api/placeholder/500/400"
						alt="Exam management illustration"
					/>
				</div>
			</div>

			<div className="features-section">
				<h2>Key Features</h2>
				<div className="features-grid">
					<div className="feature-card">
						<div className="feature-icon">📅</div>
						<h3>Easy Scheduling</h3>
						<p>Effortlessly schedule invigilators for multiple exams</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">👥</div>
						<h3>User Management</h3>
						<p>Different access levels for admins and invigilators</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">📊</div>
						<h3>Real-time Dashboard</h3>
						<p>Monitor exam activities and invigilator assignments</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">🔔</div>
						<h3>Notifications</h3>
						<p>Automated alerts for schedule changes and updates</p>
					</div>
				</div>
			</div>

			<div className="testimonials-section">
				<h2>What Our Users Say</h2>
				<div className="testimonials-container">
					<div className="testimonial-card">
						<p>
							"This system has revolutionized how we manage our examination
							process."
						</p>
						<div className="testimonial-author">
							- John D., University Exam Controller
						</div>
					</div>
					<div className="testimonial-card">
						<p>
							"The interface is intuitive and has saved me hours of
							administrative work."
						</p>
						<div className="testimonial-author">
							- Sarah M., Head Invigilator
						</div>
					</div>
				</div>
			</div>

			<footer className="footer">
				<div className="footer-content">
					<div className="footer-section">
						<h3>ExamGuard</h3>
						<p>Making exam management efficient and reliable</p>
					</div>
					<div className="footer-section">
						<h3>Quick Links</h3>
						<ul>
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/about">About</Link>
							</li>
							<li>
								<Link to="/contact">Contact</Link>
							</li>
							<li>
								<Link to="/login">Login</Link>
							</li>
						</ul>
					</div>
					<div className="footer-section">
						<h3>Contact Us</h3>
						<p>Email: info@examguard.com</p>
						<p>Phone: +1 (555) 123-4567</p>
					</div>
				</div>
				<div className="footer-bottom">
					<p>&copy; 2025 ExamGuard. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
