import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminOrderList.css';

function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('jwtToken');
  const [shippingAddress, setShippingAddress] = useState({ visible: false, data: null });



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Token before axios request:', token);
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Orders response:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    
    
    

    fetchOrders();
  }, [token]);


  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Esti sigur ca vrei sa stergi aceasta comanda?')) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(orders.filter((order) => order.id !== orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };
  

  const [orderedProducts, setOrderedProducts] = useState({ visible: false, data: null });

  const [visibleOrderId, setVisibleOrderId] = useState(null);

  const handleRowClick = (order) => {
    if (visibleOrderId === order.id) {
      setVisibleOrderId(null);
      setShippingAddress({ visible: false, data: null });
      setOrderedProducts({ visible: false, data: null });
    } else {
      setVisibleOrderId(order.id);
      setShippingAddress({ visible: true, data: order.shippingAddress });
      setOrderedProducts({ visible: true, data: order.products });
    }
  };
  


  

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(
        orders.map((order) => (order.id === orderId ? response.data : order))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      
    }
  };

  return (
    <div className="admin-product-list">
      <h1>Comenzi</h1>
      <table>
      <thead>
  <tr>
    <th>ID</th>
   
    <th>Total</th>
  <th>Status</th>
  <th>ID Angajat</th>  
  <th>Editeaza Status</th>
  <th>Actiuni</th>
  </tr>
</thead>

        <tbody>
        {orders.map((order) => (
  <>
<tr key={order.id} onClick={() => handleRowClick(order)}>
      <td>{order.id}</td>
      
      <td>{order.total} Lei</td>
      <td>{order.status}</td>
      <td>{order.employeeId}</td> 
      <td>
        <select
          value={order.status}
          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
        >
          <option value="Pending">In asteptare</option>
          <option value="Processing">In curs de procesare</option>
          <option value="Shipped">Expediat</option>
          <option value="Delivered">Livrat</option>
          <option value="Canceled">Anulata</option>
        </select>
      </td>
      <td>
        <button onClick={() => handleDeleteOrder(order.id)}>Sterge</button>
      </td>
    </tr>
    
    {shippingAddress.visible && shippingAddress.data && shippingAddress.data.orderId === order.id && (
  <tr>
    <td colSpan="6">
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <strong>Adresa de livrare:</strong>
          <p><strong>Prenume:</strong> {shippingAddress.data.firstName}</p>
          <p><strong>Nume:</strong> {shippingAddress.data.lastName}</p>
          <p><strong>Strada:</strong> {shippingAddress.data.street}</p>
          <p><strong>Oras:</strong> {shippingAddress.data.city}</p>
          <p><strong>Judet:</strong> {shippingAddress.data.county}</p>
          <p><strong>Cod postal:</strong> {shippingAddress.data.postalCode}</p>
          <p><strong>Numar de telefon:</strong> {shippingAddress.data.phone}</p>
          <p><strong>Email:</strong> {shippingAddress.data.email}</p>
        </div>
        <div>
          <strong>Produse comandate:</strong>
          <ul>
            {orderedProducts.data.map((product) => (
              <li key={product.id}>
                {product.name} - Produse Comandate: {product.OrderProduct.quantity} - Marimea {product.OrderProduct.size} Pret: {product.price}
                <img src={`http://localhost:5000/${product.imagePath}`} alt={product.name} style={{ width: '50px', height: '50px' }} />
              </li>
              
            ))}
          </ul>
        </div>
      </div>
    </td>
  </tr>
)}


  </>
))}


        </tbody>
      </table>
    </div>
  );
}

export default AdminOrderList;
