const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');
const Product = require('./Product');

class Return extends Model {}

Return.init(
  {
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Return',
  }
);

Return.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Return.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

Return.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

module.exports = Return;
