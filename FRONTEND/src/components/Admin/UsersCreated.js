import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserReport() {
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchUsers = async () => {
    if (!startDate || !endDate) return;

    const response = await axios.get(`http://localhost:5000/api/users/createdBetween/${startDate}/${endDate}`);
    setUsers(response.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, [startDate, endDate]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchUsers();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Data de început:
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </label>
        <label>
          Data de sfârșit:
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </label>
        <button type="submit">Generează raport</button>
      </form>
      <h1>Raport utilizatori creati</h1>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Data crearii</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nu exista utilizatori in aceasta perioada.</p>
      )}
    </div>
  );
}
