const sequelize = require('./config/database');
const queryInterface = sequelize.getQueryInterface();
const DataTypes = require('sequelize').DataTypes;

(async () => {
  try {
    await queryInterface.addColumn('Users', 'isAdmin', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    console.log('Added isAdmin column to Users table');
    await sequelize.close();
  } catch (error) {
    console.error('Error adding isAdmin column:', error);
    await sequelize.close();
  }
})();
