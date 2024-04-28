const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Employee extends Model {}

Employee.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true } 
  },
  {
    sequelize,
    modelName: 'Employee',
  }
);


sequelize.sync({ force: false })
  .then(() => {
    console.log('Employee model synced');
  })
  .catch((err) => {
    console.error('Error syncing Employee model:', err);
  });

module.exports = Employee;
