const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ShippingAddress extends Model {}

ShippingAddress.init(
  {
    lastName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    county: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    street: { type: DataTypes.STRING, allowNull: false },
    postalCode: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'ShippingAddress',
  }
);

module.exports = ShippingAddress;
