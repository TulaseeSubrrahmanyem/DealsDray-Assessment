import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import "./index.css"
import Cookies from 'js-cookie';

const NavBar = () => {
  const { token, setToken } = useContext(AuthContext);
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the token from local storage or cookies
    const storedName = localStorage.getItem('adminName'); // Assuming token is stored as 'jwtToken'
    if (storedName) {
      // Decode the token to get the admin's name
      setAdminName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('adminName');
    Cookies.remove('jwtToken');
    Cookies.remove('adminName');
    // Perform logout operations
    setToken(null);
 
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top" className='navBar'>
      <Navbar.Brand as={Link} to="/home" className='logo'>LOGO</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {token ? (
          <>
        
          <Nav className="ml-auto">          

                <Nav.Link as={NavLink} to="/home" className='navPart1' exact>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/employee-list" >Employee List</Nav.Link>
           
           </Nav>
           <Nav className='ms-auto'>             
              <div className='d-flex flex-row part2'>
                {/* Render admin name if token exists */}
                {adminName && <Nav.Link as={NavLink} to="#" className='navPart' >{adminName}-</Nav.Link>}
                <Nav.Link as={NavLink} to="#" onClick={handleLogout}>Logout</Nav.Link>
                     
              </div>
          </Nav>
          </>
        ) : (
          // Render login link if user is not logged in
          <Nav>
            <Nav.Link as={NavLink} to="/login" exact>Login</Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
