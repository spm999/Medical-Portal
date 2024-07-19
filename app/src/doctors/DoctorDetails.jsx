import React, { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Doctor/DoctorDetails.css'

const DoctorDetails = () => {
  const [doctor, setDoctor] = useState(null);
  const [availablePatients, setAvailablePatients] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [error, setError] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfMessage, setPdfMessage] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


    // Create a ref for the file input
    const fileInputRef = useRef(null);
    const token = localStorage.getItem('Dtoken');
// if(!token){
//   navigate('/')
// }
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const token = localStorage.getItem('Dtoken');

      if (!token) {
        navigate('/');
        return;
      }
      try {
        const response = await axios.get('https://medical-portal-l7pr.onrender.com/doctor/details', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctor(response.data.doctor);
      } catch (err) {
        setError('Error fetching doctor details');
      }
    };

    const fetchAvailablePatients = async () => {
      
      try {
        const token = localStorage.getItem('Dtoken');
        const response = await axios.get('https://medical-portal-l7pr.onrender.com/doctor/available-patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patientsArray = Object.keys(response.data.patients).map(key => ({
          id: key,
          ...response.data.patients[key]
        }));
        setAvailablePatients(patientsArray);
      } catch (err) {
        setError('Error fetching available patients');
      }
    };

    const fetchMyPatients = async () => {
      try {
        const token = localStorage.getItem('Dtoken');
        const response = await axios.get('https://medical-portal-l7pr.onrender.com/doctor/my-patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyPatients(response.data.patients);
      } catch (err) {
        setError('Error fetching my patients');
      }
    };

    const fetchPdfs = async () => {
      try {
        const token = localStorage.getItem('Dtoken');
        const response = await axios.get('https://medical-portal-l7pr.onrender.com/doctor/pdfs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPdfs(response.data.pdfs);
      } catch (err) {
        setError('Error fetching PDFs');
      }
    };

    fetchDoctorDetails();
    fetchAvailablePatients();
    fetchMyPatients();
    fetchPdfs();
  }, []);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handlePdfUpload = async (e) => {
    e.preventDefault();
    setError('');
    setPdfMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      const token = localStorage.getItem('Dtoken');
      const response = await axios.post('https://medical-portal-l7pr.onrender.com/doctor/upload-pdf', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setPdfMessage('PDF uploaded successfully!');
      setPdfs([...pdfs, response.data.pdf]); // Update state with new PDF
      // setPdfFile(null); // Clear the file input

            // Clear file input using ref
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Clear the file input value
            }

            setTimeout(() => {
              setPdfMessage('');
            }, 5000); // 5000 milliseconds = 5 seconds

    } catch (err) {
      setError('Error uploading PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePdf = async (pdfId) => {
    try {
      const token = localStorage.getItem('Dtoken');
      await axios.post(
        'https://medical-portal-l7pr.onrender.com/delete-pdf',
        { pdfId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedPdfs = pdfs.filter((pdf) => pdf.pdfid !== pdfId);
      setPdfs(updatedPdfs);
    } catch (err) {
      setError('Error deleting PDF');
    }
  };

  const handleLinkPatient = async (patientId) => {
    try {
      const token = localStorage.getItem('Dtoken');
      await axios.post(
        'https://medical-portal-l7pr.onrender.com/link-patient',
        { patientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the state to remove linked patient from availablePatients and add to myPatients
      const linkedPatient = availablePatients.find((patient) => patient.patientid === patientId);
      setAvailablePatients(availablePatients.filter((patient) => patient.patientid !== patientId));
      setMyPatients([...myPatients, linkedPatient]);
    } catch (err) {
      setError('Error linking patient');
    }
  };

  const handleUnlinkPatient = async (patientId) => {
    try {
      const token = localStorage.getItem('Dtoken');
      await axios.post(
        'https://medical-portal-l7pr.onrender.com/doctor/unlink-patient',
        { patientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the state to remove unlinked patient from myPatients
      const unlinkedPatient = myPatients.find((patient) => patient.patientid === patientId);
      setMyPatients(myPatients.filter((patient) => patient.patientid !== patientId));
      setAvailablePatients([...availablePatients, unlinkedPatient]);
    } catch (err) {
      setError('Error unlinking patient');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('Dtoken');
    navigate('/');
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <div className='main-container'>
        <div className="doctor-dashboard">
          <div className='doctor-dashboard-header'>
            <h2>Doctor Dashboard</h2>
            <button onClick={handleLogout} className="doctor-logout-button">Logout</button>
          </div>

          {doctor ? (
            <table className="doctor-all-details">
              <caption style={{ marginTop: "10px" }}>My Details</caption>
              <tbody>
                <tr>
                  <th>Name:</th>
                  <td>{doctor.name}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>{doctor.email}</td>
                </tr>
                <tr>
                  <th>Specialty:</th>
                  <td>{doctor.specialty}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Loading doctor details...</p>
          )}

          <div className="pdf-section">
            <h3 style={{ textAlign: "center" }}>Upload PDF</h3>
            <form onSubmit={handlePdfUpload} style={{ margin: "20px" }}>
              <input type="file" accept=".pdf" onChange={handleFileChange} required               ref={fileInputRef} // Assign the ref to the input element
              />
              <button type="submit" disabled={!pdfFile || loading} style={{ padding: "5px", borderRadius: "5px" }}>
                {loading ? 'Uploading...' : 'Upload PDF'}
              </button>
            </form>
            {pdfMessage && <p style={{color:"green"}} className="success-message-pdf">{pdfMessage}</p>}
            {error && <p style={{color:"red"}} className="error-message-pdf">{error}</p>}

            <h3>Uploaded PDFs</h3>
            <table className="pdf-list">
              <thead>
                <tr>
                  <th>PdfId</th>
                  <th>Uploaded Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pdfs.map((pdf) => (
                  <tr key={pdf.pdfid}>
                    <td>{pdf.pdfid}</td>
                    <td>{new Date(pdf.uploaddate).toLocaleString()}</td>
                    <td>
                      <a href={pdf.filepath} download className="pdf-download">Download</a>
                      <button onClick={() => handleDeletePdf(pdf.pdfid)} className="pdf-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="patients-section-doc">
            <div className='available' style={{ textAlign: "center", margin: "20px" }}>
              <h3>Available Patients</h3>
              <table className="patients-list-doc">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availablePatients.map((patient) => (
                    <tr key={patient.patientid}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td><button onClick={() => handleLinkPatient(patient.patientid)} className="link-button">Link</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ margin: "20px" }}>
              <h3 style={{ textAlign: "center" }}>My Patients</h3>
              <table className="patients-list-doc">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myPatients.map((patient) => (
                    <tr key={patient.patientid}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td><button onClick={() => handleUnlinkPatient(patient.patientid)} className="unlink-button">Unlink</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDetails;
