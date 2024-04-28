const User = require('./models/User');

const createAdmin = async () => {
  try {
    
    const adminUser = {
      username: 'darius',
      email: 'darius@gmail.com',
      password: 'darius',
      isAdmin: true,
      confirmed: true,
    };

    const existingUser = await User.findOne({ where: { email: adminUser.email } });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    await User.create(adminUser);
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdmin();
