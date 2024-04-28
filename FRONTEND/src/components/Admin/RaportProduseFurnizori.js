import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SupplierProductsReport() {
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState('');

  const fetchProducts = async () => {
    if (!supplierId) return;

    const response = await axios.get(`http://localhost:5000/api/products/supplier/${supplierId}`);
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [supplierId]);

  const handleSupplierIdChange = (event) => {
    setSupplierId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchProducts();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          ID-ul furnizorului:
          <input type="text" value={supplierId} onChange={handleSupplierIdChange} />
        </label>
        <button type="submit">Generează raport</button>
      </form>
      <h1>Raport produse de la furnizorul cu ID-ul: {supplierId}</h1>
      {products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Descriere</th>
              <th>Pret</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nu exista produse pentru acest furnizor.</p>
      )}
    </div>
  );
}
