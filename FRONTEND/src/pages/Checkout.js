import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import './Checkout.css';
import { loadStripe } from '@stripe/stripe-js';


import { Elements } from '@stripe/react-stripe-js';


import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe('pk_test_51MtiX9AHBiilH46o6vV22YOho29hMiSRTokNeOkFI4e5UPs6B5ZFnQ3myn70j07yAdCi5sESN6zfheqAMM5eJgkx000pnH2M1j');


function createOrderSummaryHTML(order) {
  let orderItemsHTML = '';

  if (!order.items) {
    console.error('Error: order.items is undefined');
    return '';
  }

  for (const item of order.items) {
    orderItemsHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.price * item.quantity}</td>
      </tr>
    `;
  }

  const orderSummaryHTML = `
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${orderItemsHTML}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Total</td>
          <td>${order.total}</td>
        </tr>
      </tfoot>
    </table>
  `;

  return orderSummaryHTML;
}

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const shippingCost = 19;
  console.log('CartContext values:', { cart, setCart });
  const [shippingAddress, setShippingAddress] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    county: "",
    city: "",
    street: "",
    postalCode: "",
  });
  
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + price * quantity;
  }, 0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };


  const [paymentMethod, setPaymentMethod] = useState('payOnDelivery');
  const stripe = useStripe();
  const elements = useElements();



  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // initializeaza stripetoken cu null
    let stripeToken = null;
  
    // stripe payment
    if (paymentMethod === 'stripe') {
      if (!stripe || !elements) {
        // Stripe nu s a incarcat
        return;
      }
  
      const cardElement = elements.getElement(CardElement);
  
      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (error) {
        console.log('[error]', error);
      } else {
        console.log('[PaymentMethod]', stripePaymentMethod);
        // seteaza stripetoken la metoda platii
        stripeToken = stripePaymentMethod.id;
      }
  
      if (paymentMethod === 'stripe' && error) {
        console.error('Error generating Stripe token:', error);
        return; // impiedica form submission daca e o eroare cu stripe token generation
      }
    }

    const token = localStorage.getItem('jwtToken');
    console.log(token);

   // merge produse cu acelasi productid
   const mergedProducts = cart.reduce((acc, product) => {
    const existingProductIndex = acc.findIndex((p) => p.productId === product.productId && p.size === product.size); 
    if (existingProductIndex > -1) {
      acc[existingProductIndex].quantity += product.quantity;
    } else {
      acc.push(product);
    }
    return acc;
  }, []);
  
  
  const requestData = {
    products: mergedProducts.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.selectedSize.toString(),
    })),
    total: totalPrice + shippingCost, 
    shippingAddress,
    cartItems: cart,
    paymentMethod,
    stripeToken, 
  };
  
  
    
  
    console.log('Request data:', requestData);
  
    try {
      const response = await axios.post('http://localhost:5000/api/orders', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const order = response.data;


      const cartCopy = [...cart];
      setCart([]);
      navigate(`/order-confirmation/${order.id}`, { state: { order: { ...order, products: cartCopy } } });
      
  
      
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error response data:', error.response?.data);
    }
  };
  
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  



  return (
    
    <div className="checkout">
      <h2>Cosul meu</h2>
      <table>
        <thead>
          <tr>
            <th>Imagine</th>
            <th>Nume Produs</th>
            <th>Marime</th> 
            <th>Pret</th>
            <th>Cantitate</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>
                <img src={`http://localhost:5000/${item.imagePath}`} alt={item.name} style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{item.name}</td>
              <td>{item.selectedSize}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Transport: {shippingCost} Lei</h3>
<h3>Total (incl. transport): {(totalPrice + shippingCost).toFixed(2)} Lei</h3>

      
      <form onSubmit={handleSubmit}>
        <h3>Adresa livrare</h3>
        <div className="input-grid">
          <input type="text" placeholder="Nume" name="lastName" required onChange={handleInputChange} />
          <input type="text" placeholder="Prenume" name="firstName" required onChange={handleInputChange} />
          <input type="text" placeholder="Email" name="email" required onChange={handleInputChange} />
          <input type="text" placeholder="Telefon" name="phone" required onChange={handleInputChange} />
          <input type="text" placeholder="Adresa" name="street" required onChange={handleInputChange} />
          <input type="text" placeholder="Judet" name="county" required onChange={handleInputChange} />
          <input type="text" placeholder="Localitate" name="city" required onChange={handleInputChange} />
          <input type="text" placeholder="Cod postal" name="postalCode" required onChange={handleInputChange} />
        </div>
        <h3>Metoda plata</h3>
        
        <label>
        <input
  type="radio"
  id="payOnDelivery"
  name="paymentMethod"
  value="payOnDelivery"
  checked={paymentMethod === 'payOnDelivery'}
  onChange={handlePaymentMethodChange}
/>
<label htmlFor="payOnDelivery">Plata ramburs</label>
<input
  type="radio"
  id="stripe"
  name="paymentMethod"
  value="stripe"
  checked={paymentMethod === 'stripe'}
  onChange={handlePaymentMethodChange}
/>
 Plata card Stripe
</label>
{paymentMethod === 'stripe' && <CardElement className="StripeElement" />}

<h3>Transport: {shippingCost} Lei</h3>
<h3>Total (incl. transport): {(totalPrice + shippingCost).toFixed(2)} Lei</h3>
        <button type="submit">Plaseaza comanda</button>
      </form>
      
    </div>
    
  );
}



export default function WrappedCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
}
