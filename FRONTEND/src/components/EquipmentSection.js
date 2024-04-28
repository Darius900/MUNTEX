
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';

const equipmentCategories = ['Toate','Ghiozdane', 'Corturi', 'Filtre Apa', 'Bidoane apa','Sac de dormit', 'Bete trekking'];

function EquipmentSection() {
  const [equipmentProducts, setEquipmentProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    const fetchEquipmentProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const filteredProducts = response.data.filter((product) => product.category === 'equipment');
        setEquipmentProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching equipment products:', error);
      }
    };

    fetchEquipmentProducts();
  }, []);

  return (
    <div className="equipment-section">
      <CategorySidebar
        categories={equipmentCategories}
        onSubcategoryChange={setSelectedSubcategory}
      />
      <ProductGrid products={equipmentProducts} selectedSubcategory={selectedSubcategory} />
    </div>
  );
}

export default EquipmentSection;
