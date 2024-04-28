import React, { useState, useEffect } from 'react';
import './ProductSection.css';
import ProductGrid from './ProductGrid'; 

const ProductSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  const fetchRandomProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/random/4');
      const text = await response.text(); 
      console.log('Server response:', text); 
      const data = JSON.parse(text); 
      setProducts(data);
    } catch (error) {
      console.error('Error fetching random products:', error);
    }
  };

  return (
    <div>
      <ProductGrid products={products} minimal /> 
    </div>
  );
  
};

export default ProductSection;
