// controllers/employeeController.js

const Employee = require('../models/Employee');
const path = require('path');

// Controller to fetch all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to create a new employee
exports.createEmployee = async (req, res) => {
  let {f_Image, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
  console.log('Request body:', req.body);
  
  if (Array.isArray(f_Course)) {
    f_Course = f_Course.join(', '); // Join array elements into a string
  }
  
  let imageFilePath = '';
  if (req.file) {
    console.log('Uploaded file:', req.file);
    imageFilePath = req.file.path; // The path will be saved in the format 'uploads/filename'
  }

  try {
    const newEmployee = new Employee({
      f_Image: imageFilePath, // Use the file path here
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course
    });

    await newEmployee.save();
    console.log('New employee:', newEmployee);
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.f_Email) {
      // Handle duplicate email error
      console.error('Email already exists:', error.keyValue.f_Email);
      res.status(400).json({ message: 'Email already exists' });
    } else {
      // Handle other errors
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};



// Controller to update an existing employee
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const updateData = req.body;

  if (Array.isArray(updateData.f_Course)) {
    updateData.f_Course = updateData.f_Course.join(', '); // Join array elements into a string
  }
  
  
  if (req.file) {
    console.log('Uploaded file:', req.file);
    updateData.f_Image = req.file.path; // The path will be saved in the format 'uploads/filename'
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to delete an employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully', employee: deletedEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
