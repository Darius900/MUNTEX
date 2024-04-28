const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

const admin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send('User not found.');
    if (!user.isAdmin) return res.status(403).send('Access denied. User is not an admin.');

    next();
  } catch (error) {
    res.status(500).send('Error checking admin status.');
  }
};

module.exports = {
  protect,
  admin
};
