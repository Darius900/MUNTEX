const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const Order = require('./Order');

class User extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    confirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, 
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true }, 
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
    sequelize,
    modelName: 'User',
  }
);


User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = User;
