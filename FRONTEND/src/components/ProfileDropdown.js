
import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileDropdown.css';

function ProfileDropdown({ isOpen, handleToggle }) {
  return (
    <div className={`profile-dropdown ${isOpen ? 'open' : ''}`}>
      <div className="profile-dropdown-menu">
        <Link to="/my-orders" onClick={handleToggle}>
          My Orders
        </Link>
        <Link to="/my-account" onClick={handleToggle}>
          My Account
        </Link>
        <Link to="/my-addresses" onClick={handleToggle}>
          My Addresses
        </Link>
      </div>
    </div>
  );
}

export default ProfileDropdown;
