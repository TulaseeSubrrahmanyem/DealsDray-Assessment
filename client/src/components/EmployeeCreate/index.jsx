import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

const CreateEmployeeForm = () => {
  const [formData, setFormData] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: 'HR',
    f_gender: 'Male',
    f_Image: null,
    f_Course: [],
  });
  
  const [formErrors, setFormErrors] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Course: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let newValue;
    if (type === 'checkbox') {
      if (checked) {
        // If checkbox is checked, add the value to the array
        newValue = [...formData[name], value];
      } else {
        // If checkbox is unchecked, remove the value from the array
        newValue = formData[name].filter((val) => val !== value);
      }
     
    } else {
      // For other input types, use the value directly
      newValue = value;
    }
  
    // Update the formData state with the new value
    setFormData({ ...formData, [name]: newValue });

    // Validate the field
    
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

   

    // Form submission logic
    const formDataToSend = new FormData();
    formDataToSend.append('f_Name', formData.f_Name);
    formDataToSend.append('f_Email', formData.f_Email);
    formDataToSend.append('f_Mobile', formData.f_Mobile);
    formDataToSend.append('f_Designation', formData.f_Designation);
    formDataToSend.append('f_gender', formData.f_gender);
    formDataToSend.append('f_Course', formData.f_Course.join(','));
    formDataToSend.append('f_Image', formData.f_Image);

    try {
      const newErrors = {};
      newErrors.f_Name = formData.f_Name.trim() ? '' : 'Name is required.';
      newErrors.f_Email = formData.f_Email.trim() ? '' : 'Email is required.';
      newErrors.f_Mobile = formData.f_Mobile.trim() ? '' : 'Mobile is required.';
      newErrors.f_Course = formData.f_Course.length > 0 ? '' : 'Course is required.';

      // Update the formErrors state with the new errors
      setFormErrors(newErrors);
      const hasErrors = Object.values(newErrors).some((error) => error);
      if (hasErrors) {
        // If there are errors, do not submit the form
        return;
      }
      const response = await axios.post('http://localhost:8080/employees/', formDataToSend);
      toast.success(response.data.message);

      // Reset form data
      setFormData({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: 'HR',
        f_gender: 'Male',
        f_Image: null,
        f_Course: [],
      });
      setFormErrors({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Course: '',
      });
    
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Email already exists'){
        toast.error('This email has already been used. Please use a different email.');
      } else {
        toast.error('Failed to create employee: ' + error.message);
      }
      console.error('Failed to create employee:', error);
    }
  };
  
  return (
    <div className='CreateEmplyoee'>
    <h4 className='text-center m-5'>Create Employee</h4>
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
        <input type="file" name="f_Image" accept="image/png, image/jpeg" onChange={(e) => setFormData({ ...formData, f_Image: e.target.files[0] })} />
      </div>
      <button type="submit">Submit</button>
    </form>
    <ToastContainer />
    </div>
  );
};

export default CreateEmployeeForm;
