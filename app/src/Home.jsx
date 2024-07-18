import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h2 className="home-title">Welcome to Your Medical Portal</h2>
      <div className="section">
        <h3 className="section-title">For Doctors:</h3>
        <Link to="/doctor/login" className="home-link">Doctor Login</Link>

      </div>
      <div className="section">
        <h3 className="section-title">For Patients:</h3>
        <Link to="/patient/login" className="home-link">Patient Login</Link>

      </div>
      <div className="section">
        <h3 className="section-title">More Information:</h3>
        <Link to="/#" className="home-link">About Us</Link>
        <Link to="/#" className="home-link">Contact Us</Link>
        <Link to="/#" className="home-link">FAQ</Link>
      </div>
    </div>
  );
};

export default Home;
