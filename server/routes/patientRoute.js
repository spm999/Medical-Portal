// doctorRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/patientMiddleware.js');

// Route definitions using middleware
router.post('/signup', patientController.signup);
router.post('/login', patientController.login);
router.get('/doctor-details',authMiddleware, patientController.getDoctorDetails);

module.exports = router;
