import React, { useState } from 'react';
import axios from 'axios';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [position, setPosition] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/employees', {
        name,
        email,
        phoneNumber,
        position,
      });

      console.log(data);
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee', error);
    }
  };

  return (
    <div>
    <form onSubmit={submitHandler}>
      <h1>Adauga angajat</h1>
      <label>
        Nume:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Numar telefon:
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
      </label>
      <label>
        Pozitie:
        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />
      </label>
      <button type="submit">Adauga</button>
    </form>
    </div>
  );
};

export default AddEmployee;
