const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const auth = require('../middleware/auth'); 
const Order = require('../models/Order');
const { Sequelize } = require('../config/database');






const router = express.Router();

// setam folder-ul unde uploadam imaginea si numele imaginii 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// toate produsele

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});


// Chart route

router.get('/sales', async (req, res) => {
  try {
    const salesData = await Product.findAll({
      attributes: [
        'name',
        [Sequelize.fn('sum', Sequelize.col('orders->OrderProduct.quantity')), 'sales'],
      ],
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: [],
          through: { attributes: [] },
        },
      ],
      group: ['Product.id'],
      order: Sequelize.literal('sales DESC'),
      raw: true,
    });
    res.json(salesData);
  } catch (error) {
    console.error('Error executing product sales query:', error);
    res.status(500).json({ error: 'Failed to fetch product sales data.' });
  }
});



// obtine un singur produs dupa ID

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});


// adaugare produs
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, subcategory, sizes, stock, supplierId } = req.body;

    const imagePath = req.file ? req.file.path : '';

    const stockData = {};

    const stockObject = JSON.parse(stock);
    sizes.split(',').forEach((size) => {
      const trimmedSize = size.trim();
      stockData[trimmedSize] = parseInt(stockObject[trimmedSize]);
    });

    const product = await Product.create({
      name,
      description,
      price,
      imagePath,
      category,
      subcategory,
      sizes: sizes.split(','),
      stock: stockData,
      supplierId,   
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});




// actualizare produs

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, subcategory, sizes, stock } = req.body; 
    const { id } = req.params;
    const imagePath = req.file ? req.file.path : ''; 

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedStockData = JSON.parse(stock);
await product.update({ name, description, price, imagePath: req.file ? req.file.path : product.imagePath, category, subcategory, sizes: sizes.split(','),
stock: updatedStockData, }); 

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});


// actualizare stock pentru produs
router.put('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { size, updatedStock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentStock = product.stock;
    currentStock[size] = updatedStock;

    await product.update({ stock: currentStock });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error });
  }
});


// stergere produs
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});


// obtine produse aleatorii

router.get('/random/:count', async (req, res) => {
  try {
    const { count } = req.params;
    const products = await Product.findAll({
      order: Sequelize.literal('RANDOM()'), 
      limit: parseInt(count, 10),
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random products', error });
  }
});

// raport produse furnizor
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;

    const products = await Product.findAll({ where: { supplierId } });

    if (!products) {
      return res.status(404).json({ message: 'Niciun produs gasit pentru acest furnizor' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products for supplier:', error);
    res.status(500).json({ message: 'Error fetching products for supplier', error: error.message });
  }
});



module.exports = router;
