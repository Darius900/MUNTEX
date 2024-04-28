import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import './ProductPage2.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    product && (
      <div className="product-page">
        <div className="product-image">
          <img src={`http://localhost:5000/${product.imagePath}`} alt={product.name} />
        </div>
        <div className="product-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price} Lei </p>
          <div className="size-select">
            <label htmlFor="size">Marime:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Selecteaza marimea:</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleAddToCart}>Adauga in cos</button>
          </div>
        </div>
      )
    );
  };
  
  export default ProductPage;
  
