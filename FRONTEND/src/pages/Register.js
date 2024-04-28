import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      console.log(response.data);
      //  redirectioneaza catre login page 
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      // arata mesaj eroare
    }
  };

  return (
    <div className="Register">
      <div className="Register-form">
        <h2>Creeaza cont</h2>
        <form onSubmit={handleSubmit}>
          <div className="Register-form-input">
            <label htmlFor="username">Nume:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div className="Register-form-input">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="Register-form-input">
            <label htmlFor="password">Parola:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="Register-form-button">Creeaza cont</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
