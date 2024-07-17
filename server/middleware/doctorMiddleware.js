const jwt = require('jsonwebtoken');
const sql = require('../utils/db');

const authenticateDoctor = (req, res, next) => {
  // Get the JWT token from the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
 
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is a doctor
    if (!decoded || !decoded.role || decoded.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized as Doctor' });
    }

    // Fetch doctor details from database using doctorId in decoded token
    sql`SELECT * FROM Doctors WHERE DoctorID = ${decoded.id}`.then((result) => {
      if (result.length === 0) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      req.doctorId=result[0].doctorid;
      req.email=result[0].email;

      next(); // Call next middleware
    }).catch((error) => {
      console.error('Error fetching doctor:', error);
      res.status(500).json({ error: 'Server error' });
    });

  } catch (error) {
    console.error('Error authenticating Doctor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = authenticateDoctor;
