const express = require('express');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

// toti angajatii
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});

// adauga angajat
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phoneNumber, position } = req.body;
    const employee = await Employee.create({ name, email, phoneNumber, position });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error adding employee', error: error.message });
  }
});

// actualizeaza angajat
router.put('/:id', async (req, res) => {
    try {
      const { name, email, phoneNumber, position } = req.body;
      const { id } = req.params;
  
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      await employee.update({ name, email, phoneNumber, position });
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee', error });
    }
  });
  

// sterge angajat
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      await employee.destroy();
      res.status(200).json({ message: 'Employee deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting employee', error });
    }
  });


module.exports = router;
