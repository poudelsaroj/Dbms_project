import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Login = ({ onLogin }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		userType: "invigilator",
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const validate = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validate()) {
			setIsLoading(true);

			// Simulate API call
			setTimeout(() => {
				// In a real application, you would verify credentials with your backend
				// and get the user role from there
				onLogin(formData.userType);
				setIsLoading(false);
			}, 1000);
		}
	};

	return (
		<div className="auth-page">
			<Navbar />
			<div className="auth-container">
				<div className="auth-card">
					<div className="auth-header">
						<h2>Welcome Back</h2>
						<p>Login to access your dashboard</p>
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="email">Email Address</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="Enter your email"
								value={formData.email}
								onChange={handleChange}
								className={errors.email ? "error" : ""}
							/>
							{errors.email && (
								<div className="error-message">{errors.email}</div>
							)}
						</div>

						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								name="password"
								placeholder="Enter your password"
								value={formData.password}
								onChange={handleChange}
								className={errors.password ? "error" : ""}
							/>
							{errors.password && (
								<div className="error-message">{errors.password}</div>
							)}
						</div>

						<div className="form-group">
							<label htmlFor="userType">Login As</label>
							<select
								id="userType"
								name="userType"
								value={formData.userType}
								onChange={handleChange}
							>
								<option value="invigilator">Invigilator</option>
								<option value="admin">Exam Controller (Admin)</option>
							</select>
						</div>

						<div className="form-group forgot-password">
							<Link to="/forgot-password">Forgot Password?</Link>
						</div>

						<button type="submit" className="auth-button" disabled={isLoading}>
							{isLoading ? "Logging in..." : "Login"}
						</button>
					</form>

					<div className="auth-footer">
						<p>
							Don't have an account? <Link to="/signup">Sign Up</Link>
						</p>
					</div>
				</div>

				<div className="auth-image">
					<img src="/api/placeholder/500/600" alt="Login illustration" />
					<div className="auth-image-text">
						<h3>Efficient Exam Management</h3>
						<p>
							Streamline your invigilation process with our comprehensive
							solution
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
