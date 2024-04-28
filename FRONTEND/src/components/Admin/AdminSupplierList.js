import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const updateSupplier = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/suppliers/${id}`, {
        name: editingSupplier.name,
        email: editingSupplier.email,
        phoneNumber: editingSupplier.phoneNumber,
      });
      fetchSuppliers(); 
      setIsModalOpen(false); 
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState({ name: '', email: '', phoneNumber: '' });

  const openUpdateModal = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const deleteSupplier = async (id) => {
    if (window.confirm('Esti sigur ca vrei sa stergi acest furnizor?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
        fetchSuppliers(); 
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingSupplier({ ...editingSupplier, [name]: value });
  };

  
  return (
    <div>
      <h2>Lista furnizori</h2>
      <table>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Email</th>
            <th>Numar telefon</th>
            <th>Produse</th>
            <th>Actiuni</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
            <td>{supplier.name}</td>
            <td>{supplier.email}</td>
            <td>{supplier.phoneNumber}</td>
            <td>
              {supplier.Products.map((product) => (
                <div key={product.id}>{product.name}</div>
              ))}
            </td>
            <td>
              <button onClick={() => openUpdateModal(supplier)}>Editeaza</button>
              <button onClick={() => deleteSupplier(supplier.id)}>Sterge</button>
            </td>
          </tr>
          
          ))}
        </tbody>
      </table>
  
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editeaza furnizor</h3>
            <form>
              <label>Nume:</label>
              <input
                type="text"
                name="name"
                value={editingSupplier.name}
                onChange={handleInputChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editingSupplier.email}
                onChange={handleInputChange}
              />
              <label>Numar telefon:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={editingSupplier.phoneNumber}
                onChange={handleInputChange}
              />
              <button type="button" onClick={() => updateSupplier(editingSupplier.id)}>
                Salveaza
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Anuleaza
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default AdminSupplierList;
