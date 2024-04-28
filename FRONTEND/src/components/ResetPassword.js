import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

function ResetPassword() {
  const { token } = useParams(); 

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { newPassword, confirmPassword });
      alert('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    }
  };

  return (
    <div className="reset-password">
      <h2>Reseteaza-ti parola</h2>
      <form onSubmit={handleResetPassword}>
        <label htmlFor="newPassword">Parola noua:</label>
        <input type="password" id="newPassword" name="newPassword" required />

        <label htmlFor="confirmPassword">Confirma parola:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required />

        <button type="submit">Reseteaza-ti parola</button>
      </form>
    </div>
  );
}

export default ResetPassword;
