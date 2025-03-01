import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateExam = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		subject_name: "",
		exam_date: "",
		start_time: "",
		end_time: "",
		room_number: "",
		student_count: "",
		department: "",
		invigilator_ids: [],
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:5000/api/exams", formData);
			alert("Exam created successfully!");
			navigate("/");
		} catch (error) {
			console.error("Error creating exam:", error);
			alert("Error creating exam");
		}
	};

	return (
		<div className="container mt-4">
			<div className="card">
				<div className="card-header">
					<h3>Create New Exam</h3>
				</div>
				<div className="card-body">
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Subject Name</label>
							<input
								type="text"
								className="form-control"
								name="subject_name"
								value={formData.subject_name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="row mb-3">
							<div className="col">
								<label className="form-label">Exam Date</label>
								<input
									type="date"
									className="form-control"
									name="exam_date"
									value={formData.exam_date}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="col">
								<label className="form-label">Start Time</label>
								<input
									type="time"
									className="form-control"
									name="start_time"
									value={formData.start_time}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="col">
								<label className="form-label">End Time</label>
								<input
									type="time"
									className="form-control"
									name="end_time"
									value={formData.end_time}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label className="form-label">Room Number</label>
							<input
								type="text"
								className="form-control"
								name="room_number"
								value={formData.room_number}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Number of Students</label>
							<input
								type="number"
								className="form-control"
								name="student_count"
								value={formData.student_count}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Department</label>
							<input
								type="text"
								className="form-control"
								name="department"
								value={formData.department}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="d-flex justify-content-between">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => navigate("/")}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								onClick={handleSubmit}
							>
								Create Exam
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateExam;
