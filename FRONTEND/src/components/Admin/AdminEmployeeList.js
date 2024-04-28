import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const updateEmployee = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/employees/${id}`, {
        name: editingEmployee.name,
        email: editingEmployee.email,
        phoneNumber: editingEmployee.phoneNumber,
        position: editingEmployee.position,
      });
      fetchEmployees(); 
      setIsModalOpen(false); 
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState({ name: '', email: '', phoneNumber: '', position: '' });

  const openUpdateModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Esti sigur ca vrei sa stergi acest angajat?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchEmployees(); 
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingEmployee({ ...editingEmployee, [name]: value });
  };

  return (
    <div>
      <h2>Lista angajati</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.phoneNumber}</td>
              <td>{employee.position}</td>
              <td>
                <button onClick={() => openUpdateModal(employee)}>Editeaza</button>
                <button onClick={() => deleteEmployee(employee.id)}>Sterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Employee</h3>
            <form>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editingEmployee.name}
                onChange={handleInputChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editingEmployee.email}
                onChange={handleInputChange}
              />
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={editingEmployee.phoneNumber}
                onChange={handleInputChange}
              />
              <label>Position:</label>
              <input
                type="text"
                name="position"
                value={editingEmployee.position}
                onChange={handleInputChange}
              />
              <button type="button" onClick={() => updateEmployee(editingEmployee.id)}>
                Save
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeeList;

               
