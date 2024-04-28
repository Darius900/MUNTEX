import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedReturnReason, setSelectedReturnReason] = useState({});  
  const [returningItems, setReturningItems] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  
  
  const handleReturn = async (orderId, productId, returnReason) => {  
    setReturningItems(items => ({
        ...items,
        [`${orderId}_${productId}`]: true,
    }));

    try {
        const reason = returnReason; 
        const quantity = 1;
      
        const { data } = await axios.post(
            `http://localhost:5000/api/returns/${orderId}/products/${productId}/return`,
            { reason, quantity },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            }
        );
    } catch (error) {
        console.error("Error returning product:", error);
    }
};

  
  
  const updateSelectedReturnReason  = (orderId, productId, reason) => {
    setSelectedReturnReason((prevState) => ({
      ...prevState,
      [`${orderId}_${productId}`]: reason,
    }));
  };

  return (
    <div className="my-account">
      <div className="content">
        <h2>Comenzile mele</h2>
        {orders.length === 0 ? (
          <p>You have no orders.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Comanda</th>
                <th>Data</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr onClick={() => toggleOrderDetails(order.id)}>
                    <td>{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.total.toFixed(2)} Lei</td>
                    <td>{order.status}</td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan="4">
                        <table className="order-details">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Name</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Retur</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((product) => (
                             <tr key={`${order.id}_${product.id}`}>
                             <td>
                               <img
                                 src={`http://localhost:5000/${product.imagePath}`}
                                 alt={`${product.name} (${product.imagePath})`}
                                 className="product-image"
                                 width="50"
                                 height="50"
                               />
                             </td>
                             <td>{product.name}</td>
                             <td>{product.OrderProduct.quantity}</td>
                             <td>{product.price ? product.price.toFixed(2) : 'N/A'} Lei</td>
                             
                             <td>
                             {order.status === "Delivered" && !product.OrderProduct.returned && (
    <>
        <select
            defaultValue=""
            onChange={(e) => updateSelectedReturnReason(order.id, product.id, e.target.value)}
        >
            <option value="" disabled hidden>
                Alege motiv
            </option>
            <option value="Marime gresita.">Marime gresita.</option>
            <option value="Nu mai vreau produsul.">Nu mai vreau produsul.</option>
            <option value="Produs gresit.">Produs gresit.</option>
            <option value="Produs defect.">Produs defect.</option>
        </select>
        {returningItems[`${order.id}_${product.id}`] ? (
            <span>Cerere trimisa, urmeaza sa fiti contacati telefonic de un angajat.</span>
        ) : (
            <button onClick={() => handleReturn(order.id, product.id, selectedReturnReason[`${order.id}_${product.id}`])}>
                Returneaza
            </button>
        )}
    </>
)}


                             </td>
                           </tr>
                           
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
