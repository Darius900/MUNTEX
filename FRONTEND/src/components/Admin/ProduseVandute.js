import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductReport = () => {
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchProductsSoldInDateRange();
    }
  }, [startDate, endDate]);

  const fetchProductsSoldInDateRange = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/report/${startDate}/${endDate}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Raport produse vândute</h1>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      />

      <table>
        <thead>
          <tr>
            <th>Nume produs</th>
            <th>Preț</th>
            <th>Cantitate vândută</th>
            <th>Data vânzării</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantitySold}</td>
              <td>{new Date(product.orderDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductReport;
