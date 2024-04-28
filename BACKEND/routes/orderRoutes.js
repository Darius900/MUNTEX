const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const OrderProduct = require('../models/OrderProduct');
const { protect, admin: isAdmin } = require('../middleware/authMiddleware'); 
const { Sequelize } = require('../config/database');
const sendEmail = require('../utils/email'); 
const ShippingAddress = require('../models/ShippingAddress');
const dotenv = require('dotenv');
const Employee = require('../models/Employee'); 

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();


const { Op } = require("sequelize");





function calculatePriceWithoutTva(priceWithTva) {
  const tvaRate = 0.19;
  return priceWithTva / (1 + tvaRate);
}





function calculateTva(total) {
  const tvaRate = 0.19;
  return total * tvaRate;
}

function createOrderSummaryHTML(order, total) {
  let orderItemsHTML = '';

  if (!order.products) {
    console.error('Error: order.products is undefined');
    return '';
  }

  for (const item of order.products) {
    const priceWithoutTva = calculatePriceWithoutTva(item.price);
    const tvaAmount = item.price - priceWithoutTva;
    orderItemsHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${tvaAmount.toFixed(2)}</td>
        <td>${priceWithoutTva.toFixed(2)}</td>
        <td>${item.selectedSize}</td> 
        <td>${item.quantity}</td>
        <td>${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
  }
  

  const orderSummaryHTML = `
<table>
<thead>
  <tr>
    <th>Produs</th>
    <th>Pret</th>
    <th>TVA</th>
    <th>Pret fara TVA</th>
    <th>Marime</th> 
    <th>Cantitate</th>
    <th>Total</th>
  </tr>
</thead>
      <tbody>
        ${orderItemsHTML}
      </tbody>
      <tfoot>
      <tr>
        <td colspan="7">Pret Transport: 19 lei</td>
      </tr>
      <tr>
        <td colspan="6">Total</td>
        <td>${total.toFixed(2)}</td>
      </tr>
  </tfoot>
</table>
`;

  return orderSummaryHTML;
}



// toate comenzile, adminii le vad pe toate, userii doar ale lor


router.get('/', protect, async (req, res) => {
  try {
    const isAdmin = req.user && req.user.isAdmin;
    const userId = req.user && req.user.id;

    let orders;

    if (isAdmin) {
      orders = await Order.findAll({
        include: [
          { model: User, as: 'user' },
          { 
            model: Product, 
            as: 'products', 
            attributes: ['id', 'name', 'imagePath', 'price'], 
            through: { 
              model: OrderProduct 
            } 
          },
          { model: ShippingAddress, as: 'shippingAddress' },
        ],
      });
      
    } else {
      orders = await Order.findAll({
        where: { userId: userId },
        include: [
          { model: User, as: 'user' },
          { 
            model: Product, 
            as: 'products', 
            attributes: ['id', 'name', 'imagePath', 'price'], 
            through: { 
              model: OrderProduct 
            } 
          },
          { model: ShippingAddress, as: 'shippingAddress' },
        ],
      });
      
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});



// adauga comanda
router.post('/', protect, async (req, res) => {
  try {
    const { products, total, cartItems, paymentMethod, stripeToken } = req.body;

    if (paymentMethod === 'stripe' && !stripeToken) {
      return res.status(400).json({ message: 'Stripe token is required for Stripe payments.' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const shippingAddressData = req.body.shippingAddress;

    // Alege un angajat pentru a atribui comanda
    const employee = await Employee.findOne({ where: { isAvailable: true } });

    // Daca există un angajat disponibil, îl setăm ca indisponibil
    if (employee) {
      employee.isAvailable = false;
      await employee.save();
    }

    const order = await Order.create({
      userId: user.id,
      paymentMethod,
      orderDate: new Date(),
      total,
      // Dacă există un angajat, îl atribuim comenzii; altfel, employeeId va fi null
      employeeId: employee ? employee.id : null,
    });


    if (paymentMethod === 'stripe') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), 
          currency: 'usd',
          payment_method: stripeToken,
          confirm: true,
        });
    
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({ message: 'Payment failed.' });
        }
      } catch (err) {
        // erori la payment
        console.error('Error creating payment intent:', err);
        return res.status(500).json({ message: 'Error processing payment', error: err.message });
      }
    }
    
    await updateProductStock(products); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user.id;

    const createdShippingAddress = await ShippingAddress.create({
      ...shippingAddressData,
      orderId: order.id,
    });

    const orderItems = products.map((product) => ({
      OrderId: order.id,
      ProductId: product.productId,
      quantity: product.quantity,
      size: product.size, 
    }));
    

    console.log('Received products:', products);
    console.log('Created orderItems:', orderItems);
    console.log('Attempting to insert orderItems:', JSON.stringify(orderItems, null, 2));
    console.log(employee)

    // folosim modelul OrderProduct 
     await OrderProduct.bulkCreate(orderItems);

    

    // dupa ce se salveaza comanda, se trimite e-mail
    try {
      const emailSubject = 'Order Confirmation';
      const orderSummaryHTML = createOrderSummaryHTML({ ...order, products: cartItems }, order.total);
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 5px;
      border: 1px solid black;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
    <h1>Multumim pentru comanda!</h1>
    <p>Comanda dvs. a fost plasata cu succes. Iata un rezumat:</p>
    ${orderSummaryHTML}
    
  </body>
</html>
`;



      await sendEmail(user.email, emailSubject, emailHtml);    
    } catch (error) {
      console.error('Error sending order confirmation email:', error.message, error.stack);
        }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error.message, error.stack);
    res.status(500).json({ message: "Error creating order", error });
  }
});



//update stoc

async function updateProductStock(products) {
  console.log('Updating product stock...');

  for (const product of products) {
    console.log(`Processing product ID: ${product.productId}`);
    const dbProduct = await Product.findByPk(product.productId);
    if (dbProduct) {
      const size = product.size ? product.size.toString() : 'not available'; 
      // Check if the size is not null before calling toString()

      if (size !== 'not available') {
        console.log(`Product ID: ${product.productId}, Size: ${size}, Current stock: ${dbProduct.stock[size]}, Quantity to reduce: ${product.quantity}`);

        const updatedStock = { ...dbProduct.stock, [size]: dbProduct.stock[size] - product.quantity };
        console.log('Updating stock in database:', { productId: dbProduct.id, updatedStock });
        await dbProduct.update({ stock: updatedStock });

        console.log(`Updated stock: ${dbProduct.stock[size]}`);
      } else {
        console.log(`Size not available for Product ID: ${product.productId}`);
      }
    } else {
      console.log(`Product not found for ID: ${product.productId}`);
    }
  }

  console.log('Product stock update completed.');
}









// actualizare status comanda
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'user' },
        { model: Product, as: 'products', through: { model: OrderProduct } },
        
        { model: Employee, as: 'employee' },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // If the new status is 'Shipped', set the employee as available
    if (status === 'Shipped' && order.employee) {
      order.employee.isAvailable = true;
      await order.employee.save();
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status', error });
  }
});





// sterge comanda

router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.destroy();

    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting order', error });
  }
});


//order volume chart

router.get('/volume', async (req, res) => {
  try {
    const orderVolume = await Order.findAll({
      attributes: [
        [Sequelize.fn('date', Sequelize.col('createdAt')), 'date'],
        [Sequelize.fn('count', Sequelize.col('id')), 'volume'],
      ],
      group: ['date'],
      order: Sequelize.literal('date ASC'),
      raw: true,
    });
    res.json(orderVolume);
  } catch (error) {
    console.error("Error executing order volume query:", error);
    res.status(500).json({ error: 'Failed to fetch order volume data.' });
  }
});


// order distribution chart

router.get('/distribution', async (req, res) => {
  try {
    const orderDistribution = await Order.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('status')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });
    res.json(orderDistribution);
  } catch (error) {
    console.error("Error executing order distribution query:", error);
    res.status(500).json({ error: 'Failed to fetch order distribution data.' });
  }
});

// chart payment
router.get('/payment-method-distribution', async (req, res) => {
  try {
    const paymentMethodDistribution = await Order.findAll({
      attributes: [
        'paymentMethod',
        [Sequelize.fn('COUNT', Sequelize.col('paymentMethod')), 'count'],
      ],
      group: ['paymentMethod'],
      raw: true,
    });
    res.json(paymentMethodDistribution);
  } catch (error) {
    console.error("Error executing payment method distribution query:", error);
    res.status(500).json({ error: 'Failed to fetch payment method distribution data.' });
  }
});


// numarul de comenzi intr-o anumita perioada de timp

router.get('/report', async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const orders = await Order.findAll({
      where: {
        orderDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        { model: User, as: 'user' },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'imagePath', 'price'],
          through: {
            model: OrderProduct
          }
        },
        { model: ShippingAddress, as: 'shippingAddress' },
      ],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating report', error });
  }
});

//raport

// detalii comanda dupa numarul acesteia
router.get('/details/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        { model: User, as: 'user' },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'imagePath', 'price'],
          through: {
            model: OrderProduct
          }
        },
        { model: ShippingAddress, as: 'shippingAddress' },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order details', error });
  }
});



// raport al tuturor produselor vândute într-o anumită perioadă de timp
router.get('/report/top/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const orders = await Order.findAll({
      where: {
        orderDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        },
      },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price'],
          through: {
            model: OrderProduct,
            as: 'orderProduct',
            attributes: ['quantity']
          }
        },
      ],
    });

    const soldProducts = {};

    orders.forEach(order => {
      order.products.forEach(product => {
        if (!soldProducts[product.id]) {
          soldProducts[product.id] = {
            name: product.name,
            price: product.price,
            quantitySold: 0
          };
        }
        soldProducts[product.id].quantitySold += product.orderProduct.quantity;
      });
    });

    // Identificarea produsului cu cea mai mare cantitate vândută
    const topProduct = Object.values(soldProducts).reduce((a, b) => a.quantitySold > b.quantitySold ? a : b);

    res.status(200).json(topProduct);
  } catch (error) {
    console.error('Error fetching top sold product:', error);
    res.status(500).json({ message: 'Error fetching top sold product', error: error.message });
  }
});

//rute raport produse vandute in interval de timp
router.get('/report/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const orders = await Order.findAll({
      where: {
        orderDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        },
      },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price'],
          through: {
            model: OrderProduct,
            as: 'orderProduct',
            attributes: ['quantity']
          }
        },
      ],
    });

    const soldProducts = [];

    orders.forEach(order => {
      order.products.forEach(product => {
        soldProducts.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantitySold: product.orderProduct.quantity,
          orderDate: order.orderDate,
        });
      });
    });

    res.status(200).json(soldProducts);
  } catch (error) {
    console.error('Error fetching products sold:', error);
    res.status(500).json({ message: 'Error fetching products sold', error: error.message });
  }
});


module.exports = router;