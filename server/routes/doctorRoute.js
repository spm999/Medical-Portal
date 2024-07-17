// doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/doctorMiddleware.js');

// Route definitions using middleware
router.post('/signup', doctorController.signup);
router.post('/login', doctorController.login);
router.post('/upload-pdf',authMiddleware, doctorController.uploadPDF);
router.post('/link-patient', authMiddleware, doctorController.linkPatient);

module.exports = router;
