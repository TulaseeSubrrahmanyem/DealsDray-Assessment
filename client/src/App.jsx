import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Modal from "react-modal";
import NavBar from './components/Navbar';
import Home from './components/Home';
import EmployeeList from './components/EmployeesList';
import LoginPage from './components/Login';
import CreateEmployeeForm from './components/EmployeeCreate'; // Import the CreateEmployeeForm component
import EmployeeUpdate from './components/EmployeesEdit'
export const AuthContext = createContext();

const App = () => {
  Modal.setAppElement('#root');
  const [token, setToken] = useState(() => {
    // Retrieve token from local storage on initial render
    return localStorage.getItem('token') || null;
  });

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate replace to="/" />;
    }
    return children;
  };

  // Update local storage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <Router>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/home" /> : <LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><NavBar /><Home /></ProtectedRoute>} />
          <Route path="/employee-list" element={<ProtectedRoute><NavBar /><EmployeeList /></ProtectedRoute>} />
          {/* Define route for the CreateEmployeeForm component */}
          <Route path="/create-employee" element={<ProtectedRoute><NavBar /><CreateEmployeeForm /></ProtectedRoute>} />
          <Route path="/update-employee" element={<ProtectedRoute><NavBar /><EmployeeUpdate /></ProtectedRoute>} />
         
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
