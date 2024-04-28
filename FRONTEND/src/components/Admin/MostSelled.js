import React, { useState, useEffect } from "react";
import axios from "axios";

const TopProductReport = () => {
  const [product, setProduct] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchTopProductInDateRange();
    }
  }, [startDate, endDate]);

  const fetchTopProductInDateRange = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/report/top/${startDate}/${endDate}`
      );
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Raport cel mai vândut produs</h1>
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

      {product && (
        <table>
          <thead>
            <tr>
              <th>Nume Produs</th>
              <th>Preț</th>
              <th>Cantitate vândută</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantitySold}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopProductReport;
