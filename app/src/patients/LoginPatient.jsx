import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/Patient/LoginPatient.css'

const Login = () => {
  const [formData, setFormData] = useState({
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
      const response = await axios.post('https://medical-portal-l7pr.onrender.com/patient/login', formData);
      setMessage('Login successful');
    //   console.log(response.data.token)
      localStorage.setItem('token', response.data.token); // Save token to localStorage
      navigate('/patient/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.response.data.error || 'Error logging in');
    }
  };

  return (
    <div className="login-container">
    <h2 className="login-title">Patient Login</h2>
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-input" />
      </div>
      <button type="submit" className="login-button">Login</button>
    </form>
    {error && <p className="error-message">{error}</p>}
    {message && <p className="success-message">{message}</p>}

    <p className="signup-link">Don't have an account? <Link to="/patient/signup">Signup</Link></p>
  </div>
  );
};

export default Login;
