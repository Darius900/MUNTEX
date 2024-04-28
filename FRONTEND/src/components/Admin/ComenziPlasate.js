import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderReport() {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState('2023-04-01');
  const [endDate, setEndDate] = useState('2023-07-31');

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get(`http://localhost:5000/api/orders/report?startDate=${startDate}&endDate=${endDate}`);
      setOrders(response.data);
    };
    fetchOrders();
  }, [startDate, endDate]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <div>
      <h1>Raport comenzi plasate</h1>
      <label>
        De la:
        <input type="date" value={startDate} onChange={handleStartDateChange} />
      </label>
      <label>
        la:
        <input type="date" value={endDate} onChange={handleEndDateChange} />
      </label>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Client</th>
            <th>Total</th>
            <th>Metoda plata</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.user.username}</td>
              <td>{order.total}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
