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
      return res.status(400).json({ error: 'Doctor already exists with same email.' });
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
// exports.uploadPDF = [
//   upload.single('pdf'),
//   async (req, res) => {

//     const file = req.file;
//     const doctorId = req.doctorId;

//     if (!file) {
//       return res.status(400).json({ error: 'No file found' });
//     }
//     const path = file.path;

//     try {
//       // Upload PDF to Cloudinary
//       cloudinary.uploader.upload(path,
//         {
//           folder: 'uploads/pdf'
//         },
//         async (error, result) => {
//           if (error) {
//             console.error('Cloudinary upload error:', error);
//             return res.status(500).json({ error: 'PDF upload failed' });
//           }
//           // console.log(doctorId, result.secure_url, new Date());

//           try {
//             // Create PDF record in the database
//             await sql`
//               INSERT INTO PDFs (DoctorID, FilePath, UploadDate)
//               VALUES (${doctorId}, ${result.secure_url}, ${new Date()})
//             `;

//             res.status(201).json({ message: 'PDF uploaded successfully' });
//           } catch (dbError) {
//             console.error('Error creating PDF record:', dbError);
//             res.status(500).json({ error: 'Failed to create PDF record' });
//           }
//         }
//       )
//     } catch (uploadError) {
//       console.error('Error uploading PDF:', uploadError);
//       res.status(500).json({ error: 'PDF upload failed' });
//     }
//   }
// ];


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
      cloudinary.uploader.upload(path, {
        folder: 'uploads/pdf'
      }, async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'PDF upload failed' });
        }

        try {
          // Create PDF record in the database
          const uploadDate = new Date();
          const dbResponse = await sql`
            INSERT INTO PDFs (DoctorID, FilePath, UploadDate)
            VALUES (${doctorId}, ${result.secure_url}, ${uploadDate})
            RETURNING *
          `;

          const newPdf = dbResponse[0];

          res.status(201).json({
            message: 'PDF uploaded successfully',
            pdf: {
              pdfid: newPdf.PDFID,
              filepath: newPdf.FilePath,
              uploaddate: uploadDate
            }
          });
        } catch (dbError) {
          console.error('Error creating PDF record:', dbError);
          res.status(500).json({ error: 'Failed to create PDF record' });
        }
      });
    } catch (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      res.status(500).json({ error: 'PDF upload failed' });
    }
  }
];


// Fetch PDFs
exports.getPDFs = async (req, res) => {
  const doctorId = req.doctorId;

  try {
    const pdfs = await sql`
      SELECT PDFID, FilePath, UploadDate
      FROM PDFs
      WHERE DoctorID = ${doctorId};
    `;

    res.status(200).json({ pdfs });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching PDFs' });
  }
};

// Delete PDF
exports.deletePDF = async (req, res) => {
  const { pdfId } = req.body;
  const doctorId = req.doctorId;

  try {
    const pdf = await sql`
      SELECT FilePath
      FROM PDFs
      WHERE PDFID = ${pdfId} AND DoctorID = ${doctorId};
    `;

    if (pdf.length === 0) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Delete the PDF record from the database
    await sql`
      DELETE FROM PDFs
      WHERE PDFID = ${pdfId} AND DoctorID = ${doctorId};
    `;

    // Optionally, we can also delete the file from Cloudinary
    // const publicId = pdf[0].FilePath.split('/').pop().split('.')[0];
    // await cloudinary.uploader.destroy(`uploads/pdf/${publicId}`);

    res.status(200).json({ message: 'PDF deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting PDF' });
  }
};



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




// Controller for fetching doctor details
exports.getDoctorDetails = async (req, res) => {
  const doctorId = req.doctorId;

  try {
    const doctor = await sql`
      SELECT Name, Email, Specialty
      FROM Doctors
      WHERE DoctorID = ${doctorId};
    `;

    if (doctor.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({ doctor: doctor[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctor details' });
  }
};

// Controller for fetching patients not linked to the doctor
exports.getAvailablePatients = async (req, res) => {
  const doctorId = req.doctorId;

  try {
    const patients = await sql`
      SELECT p.PatientID, p.Name, p.Email
      FROM Patients p
      LEFT JOIN DoctorPatient dp ON p.PatientID = dp.PatientID AND dp.DoctorID = ${doctorId}
      WHERE dp.DoctorID IS NULL;
    `;

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching available patients' });
  }
};

// Get My Patients
exports.getMyPatients = async (req, res) => {
  const doctorId = req.doctorId;

  try {
    const patients = await sql`
      SELECT p.PatientID, p.Name, p.Email
      FROM Patients p
      JOIN DoctorPatient dp ON p.PatientID = dp.PatientID 
      WHERE dp.DoctorID = ${doctorId}
    `;
    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient details' });
  }
};

// doctorController.js
exports.deleteLinkedPatient = async (req, res) => {
  const doctorId = req.doctorId;
  const { patientId } = req.body;

  try {
    await sql`
      DELETE FROM DoctorPatient
      WHERE DoctorID = ${doctorId} AND PatientID = ${patientId}
    `;
    res.status(200).json({ message: 'Patient unlinked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error unlinking patient' });
  }
};
