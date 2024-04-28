const express = require('express');
const Return = require('../models/Return');
const auth = require('../middleware/auth');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// obtine toate cererile de retur 

router.get('/', async (req, res) => {
  try {
    const returns = await Return.findAll({
      include: ['user', 'order', 'product'],
    });
    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching return requests', error });
  }
});

//retur produs

router.post('/:orderId/products/:productId/return', protect, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const userId = req.user.id; 
    
    

    const returnData = {
      reason: req.body.reason,
      quantity: req.body.quantity,
      userId,
      orderId,
      productId
    };

    const newReturn = await Return.create(returnData);

    res.status(201).json(newReturn);
  } catch (error) {
    console.error("Error creating return:", error.message, error.stack);
    res.status(500).json({ message: "Error creating return", error });
  }
});

// adauga cerere retur
router.post('/', auth, async (req, res) => {
  try {
    const { reason, status, quantity, userId, orderId, productId } = req.body;
    const returnRequest = await Return.create({ 
      reason, 
      status, 
      quantity, 
      userId, 
      orderId, 
      productId 
    });
    res.status(201).json(returnRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error adding return request', error: error.message });
  }
});

// actualizeaza cerere retur
router.put('/:id', auth, async (req, res) => {
  try {
    const { reason, status, quantity } = req.body;
    const { id } = req.params;

    const returnRequest = await Return.findByPk(id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    await returnRequest.update({ reason, status, quantity });
    res.status(200).json(returnRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating return request', error });
  }
});

// sterge cerere retur
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const returnRequest = await Return.findByPk(id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    await returnRequest.destroy();
    res.status(200).json({ message: 'Return request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting return request', error });
  }
});

module.exports = router;
