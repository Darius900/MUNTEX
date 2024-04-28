import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // incarca cartul din local storage
  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  }, []);

  const addToCart = (item) => {
    const existingCartItem = cart.find(
      (cartItem) => cartItem.productId === item.productId && cartItem.selectedSize === item.selectedSize
    );

    let newCart;

    if (existingCartItem) {
      newCart = cart.map((cartItem) =>
        cartItem.id === item.id && cartItem.selectedSize === item.selectedSize
          ? { ...existingCartItem, quantity: existingCartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [...cart, { ...item, productId: item.id, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (itemToRemove) => {
    const newCart = cart.filter((item) => item !== itemToRemove);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
