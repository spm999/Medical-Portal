const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('../utils/db');
const cloudinary = require('../config/cloudinaryConfig'); // Use the configured Cloudinary instance
const multer = require('multer');
const upload = multer({ dest: 'stepsAI/uploads/' });

// Signup
exports.signup = async (req, res) => {
  const { name, email, password, specialty } = req.body;
  try {
    const doctor = await sql`SELECT * FROM Doctors WHERE email = ${email}`;
    if (doctor.length > 0) {
      return res.status(400).json({ error: 'Doctor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO Doctors (Name, Email, PasswordHash, Specialty) 
      VALUES (${name}, ${email}, ${hashedPassword}, ${specialty})
    `;
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering doctor' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await sql`SELECT * FROM Doctors WHERE email = ${email}`;
    if (doctor.length === 0) return res.status(404).json({ error: 'Doctor not found' });

    const isMatch = await bcrypt.compare(password, doctor[0].passwordhash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor[0].doctorid, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload PDF
exports.uploadPDF = [
  upload.single('pdf'),
  async (req, res) => {

    const file = req.file;
    const doctorId = req.doctorId; 

    if (!file) {
      return res.status(400).json({ error: 'No file found' });
    }
    const path = file.path;

    try {
      // Upload PDF to Cloudinary
      cloudinary.uploader.upload(path, 
        {
          folder: 'uploads/pdf'
        },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ error: 'PDF upload failed' });
          }
          console.log(doctorId, result.secure_url, new Date());

          try {
            // Create PDF record in the database
             await sql`
              INSERT INTO PDFs (DoctorID, FilePath, UploadDate)
              VALUES (${doctorId}, ${result.secure_url}, ${new Date()})
            `;

            res.status(201).json({message: 'PDF uploaded successfully' });
          } catch (dbError) {
            console.error('Error creating PDF record:', dbError);
            res.status(500).json({ error: 'Failed to create PDF record' });
          }
        }
      )
    } catch (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      res.status(500).json({ error: 'PDF upload failed' });
    }
  }
];

// Link Patient
exports.linkPatient = async (req, res) => {
  const { patientId } = req.body;
  try {
    await sql`
      INSERT INTO DoctorPatient (DoctorID, PatientID)
      VALUES (${req.doctorId}, ${patientId})
    `;
    res.status(201).json({ message: 'Patient linked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error linking patient' });
  }
};
