import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = (props) => {
  const { onLoginSuccess } = props;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('E-mail sau parola gresita.');
      } else {
        setErrorMessage('A aparut o eroare. Va rugam sa incercati din nou.');
      }
    }
  };

  return (
    <div className="Login">
      <div className="Login-form">
        <h2>Conectează-te</h2>
        {errorMessage && <div className="Login-error">{errorMessage}</div>} 
        <form onSubmit={handleSubmit}>
          <div className="Login-form-input">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="Login-form-input">
            <label htmlFor="password">Parola:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="Login-form-forgot-password-wrapper">
            <a href="/forgot-password" className="Login-form-forgot-password">Ti-ai uitat parola?</a>
          </div>
          <button type="submit" className="Login-form-button">Conectează-te</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
