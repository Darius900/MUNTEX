import React from 'react';
import { useLocation } from 'react-router-dom';
import './OrderConfirmation2.css';

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state.order;

  const total = order.products.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  return (
    <div className="order-confirmation">
      <h2>Comanda plasata cu succes!</h2>
      <p>Vă mulțumim pentru comanda dumneavoastră. Am primit comanda și vom începe să o procesăm în curând. Informațiile despre comanda dvs. apar mai jos.</p>
      <p>Comanda : {order.id}</p>
      <ul>
        {order.products.map((product) => (
            <li key={product.id}>
            <img
              src={`http://localhost:5000/${product.imagePath}`}
              alt={product.name}
              style={{ width: '80px', height: '80px', marginRight: '1rem' }}
            />
            <div className="product-details">
              <span>Denumire Produs: {product.name}</span>
              <span> Marime: {product.selectedSize}</span>
              <span style={{ float: 'right' }}>Cantitate: {product.quantity}</span>
              <span style={{ float: 'right', marginRight: '1rem' }}>{product.price.toFixed(2)} Lei </span>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <h3>Total: {total.toFixed(2)} Lei </h3>
      </div>
    </div>
  );
}

export default OrderConfirmation;
