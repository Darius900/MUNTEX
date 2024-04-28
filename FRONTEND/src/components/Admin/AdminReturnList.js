import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReturnList = () => {
  const [returns, setReturns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/returns');
        setReturns(data);
      } catch (err) {
        setError('Error fetching returns');
      }
    };

    fetchReturns();
  }, []);

  const handleStatusChange = async (returnId, newStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/returns/${returnId}`,
        { status: newStatus }
      );
      setReturns(returns.map(ret => ret.id === returnId ? data : ret));
    } catch (err) {
      setError('Error updating return status');
    }
  };

  const handleDelete = async (returnId) => {
    if (window.confirm('Esti sigur ca vrei sa stergi aceasta cerere?')) {
      try {
        await axios.delete(`http://localhost:5000/api/returns/${returnId}`);
        setReturns(returns.filter(ret => ret.id !== returnId));
      } catch (err) {
        setError('Error deleting return');
      }
    }
  };
  

  return (
    <div>
      <h2>Cereri returnare produs</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Retur ID</th>
            <th>Comanda ID</th>
            <th>ID Produs</th>
            <th>ID Utilizator</th>
            <th>Motiv</th>
            <th>Status</th>
            <th>Cantitate</th>
            <th>Actiune</th>
          </tr>
        </thead>
        <tbody>
          {returns.map(ret => (
            <tr key={ret.id}>
              <td>{ret.id}</td>
              <td>{ret.orderId}</td>
              <td>{ret.productId}</td>
              <td>{ret.userId}</td>
              <td>{ret.reason}</td>
              <td>{ret.status}</td>
              <td>{ret.quantity}</td>
              <td>
                {ret.status === 'in asteptare' && (
                  <>
                    <button onClick={() => handleStatusChange(ret.id, 'aprobat')}>Aproba</button>
                    <button onClick={() => handleStatusChange(ret.id, 'respins')}>Respinge</button>
                  </>
                )}
                <button onClick={() => handleDelete(ret.id)}>Sterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReturnList;
