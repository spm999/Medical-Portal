import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Patient/SignupPatient.css';

const SignupPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post('http://localhost:3000/patient/signup', formData);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/patient/login'); // Redirect to the login page
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response.data.error || 'Error registering patient');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Patient Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-input" />
        </div>
        <button type="submit" className="signup-button">Signup</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <p className="login-link">Already have an account? <Link to="/patient/login">Login</Link></p>
    </div>
  );
};

export default SignupPatient;
