
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';

const womenCategories = ['Toate','Jachete','Hanorace', 'Tricouri', 'Pantaloni', 'Incaltaminte', 'Palarii','Accesorii'];

function WomenSection() {
  const [womenProducts, setWomenProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const filteredProducts = response.data.filter((product) => product.category === 'women');
        setWomenProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching women products:', error);
      }
    };

    fetchWomenProducts();
  }, []);

  return (
    <div className="women-section">
      <CategorySidebar
        categories={womenCategories}
        onSubcategoryChange={setSelectedSubcategory}
      />
      <ProductGrid products={womenProducts} selectedSubcategory={selectedSubcategory} />
    </div>
  );
}

export default WomenSection;
