const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Supplier extends Model {}

Supplier.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Supplier',
  }
);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Supplier model synced');
  })
  .catch((err) => {
    console.error('Error syncing Supplier model:', err);
  });

module.exports = Supplier;
