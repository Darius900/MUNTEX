import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

import CartDropdown from './CartDropdown';
import { useState } from 'react';

function Navbar(props) {
  const { isAuthenticated, user, onLogout } = props;
  const { cart } = useContext(CartContext);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  return (
    <nav>
      <div className="left">
        <Link to="/">Acasa</Link>
        <Link to="/men">Barbati</Link>
        <Link to="/women">Femei</Link>
        <Link to="/equipment">Echipament</Link>
        <Link to="/about-us">Despre noi</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="right">
        {isAuthenticated ? (
          <>
            <Link to="/my-account">
              <span className="user-greeting">
                Buna, {user && user.username}!
              </span>
            </Link>
            <Link to="/my-account" className="my-account-link">
              Contul meu
            </Link>
            <button onClick={onLogout}>Deconectează-te</button>
          </>
        ) : (
          <>
            <Link to="/register">
              <button>Creeaza cont</button>
            </Link>
            <Link to="/login">
              <button>Conectare</button>
            </Link>
          </>
        )}
        <button
          className="cart"
          onClick={() => {
            console.log('Cart button clicked');
            setShowCartDropdown((prevState) => !prevState);
          }}
        >
          Cos ({cart.length})
          <span className="navbar-button"></span>
          <span className="cart-count">{cart.length}</span>
        </button>
        {showCartDropdown && (
          <CartDropdown onClose={() => setShowCartDropdown(false)} />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
