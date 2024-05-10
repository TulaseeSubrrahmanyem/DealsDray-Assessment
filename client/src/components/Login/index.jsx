// LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import Cookies from 'js-cookie';
import axios from 'axios';
import './index.css';

const LoginPage = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/adminauth/login', {
        f_userName: username.trim(),
        f_Pwd: password.trim()
      });
      if (response && response.data) {
        const { token, AdminName } = response.data;
        // Store the token and admin name in local storage
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('adminName', AdminName);
        // Store the token and admin name in cookies
        Cookies.set('jwtToken', token, { expires: 7 });
        Cookies.set('adminName', AdminName, { expires: 7 });
        if (token && AdminName) {
          setToken(token);
          navigate('/home');
        }
        console.log("Login Success");
      }
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login failed:', error.response.data.message);
    }
  };

  return (
    <div className='loginContainer'> 
      <div className='login'>
       
        <form onSubmit={handleSubmit} className='formContainer'>
        <h2>Login</h2>
          <div className='d-flex flex-row justify-content-between'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder='Enter your username'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='d-flex flex-row justify-content-between'>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-danger">{error}</div>}
          <button type="submit" className='btn btn-primary w-100 mt-3'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
