const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Obtine utilizatorul actual
authRouter.get('/me', protect, async (req, res) => { 
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Inregistrare utilizator nou
authRouter.post('/register', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //  Verifica de utilizatorul exista
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  // Creeaza utilizator nou
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // Genereaza token
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = authRouter;
