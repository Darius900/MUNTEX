import React from 'react';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDropdown.css';

function CartDropdown({ onClose }) {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  // Adăugarea confirmării de ștergere
  const handleRemoveFromCart = (item) => {
    if (window.confirm('Esti sigur ca vrei sa stergi produsul?')) {
      removeFromCart(item);
    }
  };

  return (
    <div className="cart-dropdown">
      {cart.length ? (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <img className="imagecart" src={`http://localhost:5000/${item.imagePath} `} alt={item.name} style={{ width: '50px', height: '50px' }}  />
                <span>{item.name} {item.selectedSize}</span> 
              
                <small>{item.price.toFixed(2)} Lei</small>
                <button onClick={() => handleRemoveFromCart(item)}>Sterge</button>
              </li>
            ))}
          </ul>
          
          <button className="close" onClick={onClose}>x</button>
          
          <button className="checkout" onClick={handleCheckoutClick}>Spre Checkout</button>
        </>
      ) : (
        <p className="empty">Cosul tau este gol.</p>
      )}
    </div>
  );
}

export default CartDropdown;
