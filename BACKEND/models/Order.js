const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const ShippingAddress = require('./ShippingAddress');
const Employee = require('./Employee');

class Order extends Model {}

Order.init(
  {
    orderDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    total: { type: DataTypes.DOUBLE, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    employeeId: { type: DataTypes.INTEGER, allowNull: true }
  },
  {
    sequelize,
    modelName: 'Order',
  }
);

Order.hasOne(ShippingAddress, {
  foreignKey: 'orderId',
  as: 'shippingAddress',
});
ShippingAddress.belongsTo(Order, { as: 'order' });
Order.belongsTo(Employee, { as: 'employee' });  
module.exports = Order;
