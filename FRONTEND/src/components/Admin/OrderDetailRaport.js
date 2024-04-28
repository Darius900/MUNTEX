import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      const response = await axios.get(`http://localhost:5000/api/orders/details/${orderId}`);
      setOrder(response.data);
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleOrderIdChange = (event) => {
    setOrderId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOrder(null);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Introduceți numărul comenzii:
          <input type="text" value={orderId} onChange={handleOrderIdChange} />
        </label>
        <button type="submit">Caută</button>
      </form>
      {order ? (
        <div>
          <h1>Detalii comandă #{order.id}</h1>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Client</th>
                <th>Total</th>
                <th>Metoda de plată</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.user.username}</td>
                <td>{order.total}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.status}</td>
              </tr>
            </tbody>
          </table>
          <h2>Produse:</h2>
          <table>
            <thead>
              <tr>
                <th>Nume produs</th>
                <th>Preț</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Adresa de livrare:</h2>
          <table>
            <thead>
              <tr>
                <th>Stradă</th>
                <th>Oraș</th>
                <th>Județ</th>
                <th>Cod poștal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.shippingAddress.street}</td>
                <td>{order.shippingAddress.city}</td>
                <td>{order.shippingAddress.county}</td>
                <td>{order.shippingAddress.postalCode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Introduceți un număr de comandă pentru a vedea detaliile.</p>
      )}
    </div>
  );
}
