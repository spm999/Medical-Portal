const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('../utils/db');
// const cloudinary = require('../config/cloudinaryConfig'); // Use the configured Cloudinary instance
// const multer = require('multer');
// const upload = multer({ dest: 'stepsAI/uploads/' });

// Signup
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const patient = await sql`SELECT * FROM Patients WHERE email = ${email}`;
        if (patient.length > 0) {
            return res.status(400).json({ error: 'Patient already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await sql`
      INSERT INTO Patients (Name, Email, PasswordHash) 
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering Patient' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const patient = await sql`SELECT * FROM patients WHERE email = ${email}`;
        if (patient.length === 0) return res.status(404).json({ error: 'Patient not found' });

        const isMatch = await bcrypt.compare(password, patient[0].passwordhash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: patient[0].patientid, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Fetch Doctor Details for Patient Dashboard
exports.getDoctorDetails = async (req, res) => {
    const patientId = req.patientId; 

    try {
        const doctors = await sql`
        SELECT d.Name, d.Email, d.Specialty
        FROM Doctors d
        JOIN DoctorPatient dp ON d.DoctorID = dp.DoctorID
        WHERE dp.PatientID = ${patientId};
        `;
        res.status(200).json({ doctors });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching doctor details' });
    }

};
