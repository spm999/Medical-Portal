const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/doctorMiddleware.js');

// Route definitions using middleware
router.post('/signup', doctorController.signup);
router.post('/login', doctorController.login);
router.post('/upload-pdf', authMiddleware, doctorController.uploadPDF);
router.post('/link-patient', authMiddleware, doctorController.linkPatient);
router.get('/details', authMiddleware, doctorController.getDoctorDetails);
router.get('/available-patients', authMiddleware, doctorController.getAvailablePatients);
router.get('/my-patients', authMiddleware, doctorController.getMyPatients);
router.post('/unlink-patient', authMiddleware, doctorController.deleteLinkedPatient); // Add this route
// Other imports and routes
router.post('/delete-pdf', authMiddleware, doctorController.deletePDF); // Add this route

router.get('/pdfs', authMiddleware, doctorController.getPDFs); // Add this route

// Other routes

module.exports = router;


module.exports = router;
