const express = require('express');
const Supplier = require('../models/Supplier');
const auth = require('../middleware/auth');
const Product = require('../models/Product');


const router = express.Router();

// obtine toti furnizorii
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      include: [Product],
    });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
});


// adauga furnizor
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const supplier = await Supplier.create({ name, email, phoneNumber });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error adding supplier', error: error.message });
  }
});

// actualizeaza furnizor
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await supplier.update({ name, email, phoneNumber });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error });
  }
});

// sterge furnizor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await supplier.destroy();
    res.status(200).json({ message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error });
  }
});

module.exports = router;
