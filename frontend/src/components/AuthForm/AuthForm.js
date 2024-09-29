import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import './AuthForm.css';

function AuthForm({ isLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const url = isLogin ? '/api/login' : '/api/register';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check for specific error messages
        if (data.error) {
          setErrorMessage(data.error); // Use the error message from the response
        } else {
          setErrorMessage('Invalid credentials'); // Default error message
        }
        return;
      }

      // Store the JWT in localStorage
      localStorage.setItem('token', data.token);

      // Handle successful login or registration
      if (isLogin) {
        dispatch(login({ token: data.token, user: { email } }));
        navigate('/');
      } else {
        navigate('/login', { state: { message: 'Registration successful. Please log in.' } });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p className="switch-auth">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link to={isLogin ? "/register" : "/login"}>
          {isLogin ? 'Register' : 'Login'}
        </Link>
      </p>
    </div>
  );
}

export default AuthForm;
