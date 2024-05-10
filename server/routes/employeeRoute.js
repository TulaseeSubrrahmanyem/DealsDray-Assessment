// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeControllers');
const multer=require('multer');
const path = require('path');
const fs = require('fs'); // Import the file system module
// const upload=multer({dest:'uplads/'})

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = 'uploads/';
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });
  
// Route to fetch all employees
router.get('/', employeeController.getAllEmployees);

// Route to create a new employee
router.post('/',upload.single('f_Image'), employeeController.createEmployee);
// Update Employee
router.put('/update/:id',upload.single('f_Image'), employeeController.updateEmployee);

// Delete Employee
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
