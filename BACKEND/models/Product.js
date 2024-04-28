const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const OrderProduct = require('./OrderProduct');
const Supplier = require('./Supplier');

class Product extends Model {}

Product.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    imagePath: { type: DataTypes.STRING, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: false },
    subcategory: { type: DataTypes.STRING, allowNull: false }, 
    stock: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}',
      get() {
        return JSON.parse(this.getDataValue('stock'));
      },
      set(val) {
        this.setDataValue('stock', JSON.stringify(val));
      },
    },
        
    sizes: {
      type: DataTypes.TEXT, 
      allowNull: false,
      get() {
        return JSON.parse(this.getDataValue('sizes'));
      },
      set(val) {
        this.setDataValue('sizes', JSON.stringify(val));
      },
    },
    supplierId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Suppliers', key: 'id' } },
  },
  {
    sequelize,
    modelName: 'Product',
  }
);

Product.belongsToMany(Order, {
  through: OrderProduct,
  as: 'orders',
});

Order.belongsToMany(Product, {
  through: OrderProduct,
  as: 'products',
});


Product.belongsTo(Supplier, { as: 'supplier' });
Supplier.hasMany(Product, { foreignKey: 'supplierId' });

sequelize.sync({ force: false })
  .then(() => {
    console.log('Product model synced');
  })
  .catch((err) => {
    console.error('Error syncing Product model:', err);
  });


module.exports = Product;
