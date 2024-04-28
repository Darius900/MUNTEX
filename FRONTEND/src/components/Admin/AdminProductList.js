import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProductList.css';

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [updatedStock, setUpdatedStock] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Esti sigur ca vrei sa stergi acest produs?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
};


  const handleStockUpdate = async (productId, size, updatedStock) => {
    if (updatedStock < 0) {
      return;
    }
  
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}/stock`, {
        size,
        updatedStock,
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };
  

  const handleStockInputChange = (productId, size, e) => {
    setUpdatedStock((prevUpdatedStock) => ({
      ...prevUpdatedStock,
      [productId]: {
        ...prevUpdatedStock[productId],
        [size]: e.target.value,
      },
    }));
  };


  return (
    <div className="admin-product-list">
      <h1>Produse</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>Pret</th>
            <th>Stoc</th>
            <th>Actiuni</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
              {product.stock && Object.entries(product.stock).map(([size, stock]) => (
                 <div key={`${product.id}-${size}`} className="stock-container">
                  <span className="stock-label">
                    {size}: {stock}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={updatedStock[product.id]?.[size] !== undefined ? updatedStock[product.id][size] : stock || 0}
                    onChange={(e) => handleStockInputChange(product.id, size, e)}
                  />
                  <button onClick={() => handleStockUpdate(product.id, size, updatedStock[product.id]?.[size] ?? stock)}>Actualizare</button>
                </div>
              ))}
            </td>

              <td>
                
                <button onClick={() => handleDeleteProduct(product.id)}>Sterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductList;
