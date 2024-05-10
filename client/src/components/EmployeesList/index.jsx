import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css'

const EmployeeListPage = () => {
  const navigate=useNavigate()
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch employee data
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/employees');
        setEmployees(response.data); // Assuming response.data is an array of employees
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (id) => {
    // Logic to delete an employee by ID
    try {
      await axios.delete(`http://localhost:8080/employees/${id}`);
      // Update the list of employees after deletion
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Perform search logic here
  };
const createEmployee=()=>{
  navigate('/create-employee')
}
const updateEmployee = (employee) => {
  navigate('/update-employee', { state: { ...employee } });
};

// Filter employees based on search term
const filteredEmployees = employees.filter((employee) => {
  const { f_Name, f_Email, f_Mobile, f_Designation, f_gender } = employee;
  const f_Course = Array.isArray(employee.f_Course) ? employee.f_Course.join(', ') : String(employee.f_Course);
  const lowerSearchTerm = searchTerm.toLowerCase();
  return (
    f_Name.toLowerCase().includes(lowerSearchTerm) ||
    f_Email.toLowerCase().includes(lowerSearchTerm) ||
    f_Mobile.toLowerCase().includes(lowerSearchTerm) ||
    f_Designation.toLowerCase().includes(lowerSearchTerm) ||
    f_gender.toLowerCase() === lowerSearchTerm ||
    f_Course.toLowerCase().includes(lowerSearchTerm)
  );
});


const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
  return (
    <div className='EmployeeList'>          
      <div className='d-flex flex-row justify-content-around ms-auto w-50'>
        <div className=''>
          <h6 className='mt-4 '>Total Count: {employees.length}</h6>          
        </div>  
        <div className='d-flex flex-column w-50'>
        <button onClick={createEmployee} className='btn btn-success m-3 '>Create Employee</button>
         <div className='d-flex flex-row '>
         <label htmlFor="searchInput" className="search-label">
         Search:
       </label>
       
        <input
            type="text"
            id="searchInput"
            placeholder="Enter search ketword"
            value={searchTerm}
          
            onChange={handleSearch}
            className='searchBox'
           
        />
         </div>
        
        
        </div>       
      </div>
         
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th >No.</th>
            <th >Image</th>
            <th >Name</th>
            <th >Email</th>
            <th >Mobile No</th>
            <th >Designation</th>
            <th >Gender</th>
            <th >Course</th>
            <th>Create date</th>
            <th >Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id}>
              <td >{index + 1}</td>
              <td >
              <img
                src={`http://localhost:8080/${employee.f_Image}`} // Replace with the actual image URL
                alt={`Image of ${employee.f_Name}`} // Provide a descriptive alt text
                style={{width:"50px",height:"50px" }} // Adjust the image size as needed
              />
            </td>
              <td >{employee.f_Name}</td>
              <td >
              <a href={`mailto:${employee.f_Email}`} style={{ color: 'blue', textDecoration: 'underline' }}>
              {employee.f_Email}
               </a></td>
              <td>{employee.f_Mobile}</td>
              <td >{employee.f_Designation}</td>
              <td>{employee.f_gender}</td>
              <td >{employee.f_Course}</td>
              <td>{formatDate(employee.f_Createdate)}</td>
              <td className='' >  
              <div className='d-flex flex-row' style={{cursor: 'pointer'}}>
              <p onClick={() => updateEmployee(employee)} className='fw-bold'>Edit -</p>
              <p onClick={() => handleDeleteEmployee(employee._id)} className='fw-bold'>
                Delete
              </p>
              </div>          
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeListPage;
