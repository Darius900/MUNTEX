const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class OrderProduct extends Model {}

OrderProduct.init(
  {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: true }, 
  },
  {
    sequelize,
    modelName: 'OrderProduct',
  }
);

module.exports = OrderProduct;
