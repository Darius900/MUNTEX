
import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/request-password-reset', { email });
      
    } catch (error) {
      console.error('Error requesting password reset:', error);
      
    }
  };

  return (
    <div className="ForgotPassword">
      <div className="ForgotPassword-form">
        <h2>Ti-ai uitat parola?</h2>
        <form onSubmit={handleSubmit}>
          <div className="ForgotPassword-form-input">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="ForgotPassword-form-button">Trimite link de resetare</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
