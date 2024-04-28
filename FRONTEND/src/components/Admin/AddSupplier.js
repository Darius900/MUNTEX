import React, { useState } from 'react';
import axios from 'axios';

const AddSupplier = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post('http://localhost:5000/api/suppliers', {
            name,
            email,  
            phoneNumber,
          });
          

      setName('');
      setEmail('');
      setPhoneNumber('');
      alert('Supplier added successfully!');
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier. Please try again.');
    }
  };

  return (
    <div>
      <h2>Adauga furnizor</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nume:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Numar telefon:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Adauga furnizor</button>
      </form>
    </div>
  );
};

export default AddSupplier;
