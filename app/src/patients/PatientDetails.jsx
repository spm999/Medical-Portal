import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Patient/PatientDetails.css'

const PatientDetails = () => {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('https://medical-portal-l7pr.onrender.com/patient/doctor-details', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatient(response.data.patient);
        setDoctors(response.data.doctors);
      } catch (err) {
        setError('Error fetching patient details');
      }
    };

    fetchPatientDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Patient Dashboard</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      {patient ? (
        <div className="patient-details-container">
          <h3 className="section-title">Patient Details</h3>
          <p className="patient-detail">Name: {patient[0].name}</p>
          <p className="patient-detail">Email: {patient[0].email}</p>

          <h3 className="section-title">Linked Doctor</h3>
          <ul className="doctor-list">
            {doctors.map((doctor) => (
              <li key={doctor.email} className="doctor-item">
                <p className="doctor-detail">Name: {doctor.name}</p>
                <p className="doctor-detail">Email: {doctor.email}</p>
                <p className="doctor-detail">Specialty: {doctor.specialty}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
  );
};

export default PatientDetails;
