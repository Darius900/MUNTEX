import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyOrders from './MyOrders';
import './MyAccount.css';

function MyAccount() {
  
  const user = JSON.parse(localStorage.getItem('user')) || {
    username: 'Not logged in',
    email: 'Not logged in',
  };
  

  const [activeItem, setActiveItem] = useState('account');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
  
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
  
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put('http://localhost:5000/api/users/update-password', {
        oldPassword,
        newPassword,
      }, config);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };
  

  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    const email = e.target.resetEmail.value;
    try {
      await axios.post('http://localhost:5000/api/users/request-password-reset', { email });
      alert('Password reset email sent');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      alert('Error requesting password reset');
    }
  };

  function handleItemClick(item) {
    setActiveItem(item);
  }

  return (
    <div className="my-account">
      <div className="sidebar">
        <ul>
        <li className={activeItem === 'account' ? 'active' : ''}>
  <Link to="#" onClick={(e) => { e.preventDefault(); handleItemClick('account'); }}>
    Contul meu
  </Link>
</li>
<li className={activeItem === 'orders' ? 'active' : ''}>
  <Link to="#" onClick={(e) => { e.preventDefault(); handleItemClick('orders'); }}>
    Comenzile mele
  </Link>
</li>


        </ul>
      </div>
      <div className="content">
        {activeItem === 'account' && (
          <>
            
            <h2>My Account</h2>
            <div className="account-info">
  <div className="account-info-row">
    <span className="account-info-label">Email:</span>
    <span className="account-info-value"> {user.email}</span>
  </div>
  <div className="account-info-row">
    <span className="account-info-label">Nume:</span>
    <span className="account-info-value"> {user.username}</span>
  </div>
</div>


  

            <div className="change-password">
              <h2>Schimba parola:</h2>
              <form onSubmit={handleChangePassword}>
                <label htmlFor="oldPassword">Parola veche:</label>
                <input type="password" id="oldPassword" name="oldPassword" required />

                <label htmlFor="newPassword">Parola noua:</label>
                <input type="password" id="newPassword" name="newPassword" required />

                <label htmlFor="confirmPassword">Confirma parola noua:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />

                <button type="submit">Schimba parola</button>
              </form>
            </div>
            <div className="request-password-reset">
              <h2>Cere link de resetare parola pe email:</h2>
              <form onSubmit={handleRequestPasswordReset}>
                <label htmlFor="resetEmail">Email:</label>
                <input type="email" id="resetEmail" name="resetEmail" required />
                <button type="submit">Trimite</button>
              </form>
            </div>
          </>
        )}
        {activeItem === 'orders' && (
  <MyOrders />
)}

        
      </div>
    </div>
  );
}

export default MyAccount;
