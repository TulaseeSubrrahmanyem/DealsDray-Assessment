import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import './index.css'
import { useNavigate } from 'react-router-dom';

const UpdateEmployeeForm = () => {
  const navigate=useNavigate()
  // Destructure employeeData to get initial values
  const location = useLocation();
  const employeeData = location.state || {};
  const { _id,f_Image, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course} = employeeData;
  console.log("locatstate data fro courses",f_Course)
  
  //const initialCourses = Array.isArray(f_Course) ? f_Course : (typeof f_Course === 'string' ? f_Course.split(',') : []);
  // Check if f_Course is an array or a string and handle accordingly
  const initialCourses = Array.isArray(f_Course)
  ? f_Course.flatMap(course => (typeof course === 'string' ? course.split(',') : course))
  : [];



  console.log("initialCourses",initialCourses)

  // State for form data
  const [formData, setFormData] = useState({
    f_Name: f_Name || '', // Prefill Name
    f_Email: f_Email || '', // Prefill Email
    f_Mobile: f_Mobile || '', // Prefill Mobile No
    f_Designation: f_Designation || '', // Prefill Designation
    f_gender: f_gender || '', // Prefill Gender
    f_Course: initialCourses,
    f_Image:f_Image || null,
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Course: '',
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData((prevFormData) => {
      let newCourses;
      if (type === 'checkbox') {
        if (checked) {
          newCourses = [...prevFormData.f_Course, value];
        } else {
          newCourses = prevFormData.f_Course.filter((course) => course !== value);
        }
        return { ...prevFormData, [name]: newCourses };
      } else {
        return { ...prevFormData, [name]: value };
      }
    });
  };
  


  // Function to handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate the form data
  const newErrors = {};
  newErrors.f_Name = formData.f_Name.trim() ? '' : 'Name is required.';
  newErrors.f_Email = formData.f_Email.trim() ? '' : 'Email is required.';
  newErrors.f_Mobile = formData.f_Mobile.trim() ? '' : 'Mobile is required.';
  //newErrors.f_Course = Array.isArray(formData.f_Course) && formData.f_Course.length > 0 ? '' : 'Course is required.';
  newErrors.f_Course = formData.f_Course.length > 0 ? '' : 'Course is required.';
  setFormErrors(newErrors);
  const hasErrors = Object.values(newErrors).some((error) => error);
  if (hasErrors) {
    return; // Stop form submission if there are errors
  }

  // Prepare FormData for submission
  const formDataToSend = new FormData();
  formDataToSend.append('f_Name', formData.f_Name);
  formDataToSend.append('f_Email', formData.f_Email);
  formDataToSend.append('f_Mobile', formData.f_Mobile);
  formDataToSend.append('f_Designation', formData.f_Designation);
  formDataToSend.append('f_gender', formData.f_gender);
  formDataToSend.append('f_Course', formData.f_Course.join(','));
  // if (Array.isArray(formData.f_Course)) {
  //   formDataToSend.append('f_Course', formData.f_Course.join(','));
  // }
  if (formData.f_Image) {
    formDataToSend.append('f_Image', formData.f_Image);
  }

  try {
    const response = await axios.put(`http://localhost:8080/employees/update/${_id}`, formDataToSend);
    toast.success(response.data.message);
    // Reset form data after successful update
    //  navigate('/employee-list')
  } catch (error) {
    toast.error('Failed to update employee: ' + (error.response?.data?.message || error.message));
    console.error('Failed to update employee:', error);
  }
};


  return (
    <div className='EmployeeUpdate'>
    <h4 className='text-center m-5'>Update Employee Data</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="f_Name" value={formData.f_Name} onChange={handleChange} />
          {formErrors.f_Name && <p style={{ color: 'red' }}>{formErrors.f_Name}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input type="text" name="f_Email" value={formData.f_Email} onChange={handleChange} />
          {formErrors.f_Email && <p style={{ color: 'red' }}>{formErrors.f_Email}</p>}
        </div>
        <div>
          <label>Mobile No:</label>
          <input type="text" name="f_Mobile" value={formData.f_Mobile} onChange={handleChange} />
          {formErrors.f_Mobile && <p style={{ color: 'red' }}>{formErrors.f_Mobile}</p>}
        </div>
        <div>
          <label>Designation:</label>
          <select name="f_Designation" value={formData.f_Designation} onChange={handleChange}>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label>Gender:</label>
          <label><input type="radio" name="f_gender" value="Male" checked={formData.f_gender === 'Male'} onChange={handleChange} /> Male</label>
          <label><input type="radio" name="f_gender" value="Female" checked={formData.f_gender === 'Female'} onChange={handleChange} /> Female</label>
        </div>
        <div>
        <label>Course:</label>
        <label><input type="checkbox" name="f_Course" value="MCA" checked={formData.f_Course.includes('MCA')} onChange={handleChange} /> MCA</label>
        <label><input type="checkbox" name="f_Course" value="BCA" checked={formData.f_Course.includes('BCA')} onChange={handleChange} /> BCA</label>
        <label><input type="checkbox" name="f_Course" value="BSC" checked={formData.f_Course.includes('BSC')} onChange={handleChange} /> BSC</label>
        {formErrors.f_Course && <p style={{ color: 'red' }}>{formErrors.f_Course}</p>}
      </div>
        <div>
          <label>Img Upload:</label>
          <input type="file" name="f_Image" accept="image/png, image/jpeg" 
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({ ...formData, f_Image: file });
             
            }
          }}
          />
         
        </div>
        <button type="submit">Update</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateEmployeeForm;
