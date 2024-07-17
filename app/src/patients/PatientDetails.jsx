import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDetails = () => {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/patient/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/patient/doctor-details', {
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
    navigate('/patient/login');
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {patient ? (
        <div>
          <h3>Patient Details</h3>
          <p>Name: {patient[0].name}</p>
          <p>Email: {patient[0].email}</p>

          <h3>Linked Doctors</h3>
          <ul>
            {doctors.map((doctor) => (
              <li key={doctor.email}>
                <p>Name: {doctor.name}</p>
                <p>Email: {doctor.email}</p>
                <p>Specialty: {doctor.specialty}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientDetails;
