const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const returnRoutes = require('./routes/returnRoutes');




require('dotenv').config();

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/returns', returnRoutes);

app.use('/api/employees', employeeRoutes);

// setam EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//  imagini statice din folderul public
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/suppliers', supplierRoutes);
sequelize.sync()
  .then(() => {
    console.log('Database models synchronized');

    app.get('/', (req, res) => {
      res.send('Mountain Equipment API');
    });

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database models:', error);
  });
