import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPatient from './patients/SignupPatient';
import LoginPatient from './patients/LoginPatient';
import PatientDetails from './patients/PatientDetails';
import SignupDoctor from './doctors/SignupDoctor';
import LoginDoctor from './doctors/LoginDoctor';
import DoctorDetails from './doctors/DoctorDetails';
import Home from './Home';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* Patient Routes */}
        <Route path="/patient/signup" element={<SignupPatient />} />
        <Route path="/patient/login" element={<LoginPatient />} />
        <Route path="/patient/dashboard" element={<PatientDetails />} />

        {/* Doctor Routes */}
        <Route path="/doctor/signup" element={<SignupDoctor />} />
        <Route path="/doctor/login" element={<LoginDoctor />} />
        <Route path="/doctor/dashboard" element={<DoctorDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
