import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';
import './MenSection2.css';


const menCategories = ['Toate', 'Tricouri', 'Jachete', 'Bluze', 'Pantaloni', 'Incaltaminte', 'Accesorii'];

function MenSection() {
  const [menProducts, setMenProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const filteredProducts = response.data.filter((product) => product.category === 'men');
        setMenProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching men products:', error);
      }
    };

    fetchMenProducts();
  }, []);

  return (
    <div className="men-section">
      <div className="section-wrapper">
        <CategorySidebar
          categories={menCategories}
          onSubcategoryChange={setSelectedSubcategory}
        />
        <ProductGrid products={menProducts} selectedSubcategory={selectedSubcategory} />
      </div>
    </div>
  );
}

export default MenSection;
