
import React, { useState } from 'react';
import './CategorySidebar.css';

function CategorySidebar({ categories, onSubcategoryChange }) {
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onSubcategoryChange(subcategory === 'Toate' ? '' : subcategory);
  };

  return (
    <div className="category-sidebar">
      <h3>Categories</h3>
      <ul>
        {categories.map((category, index) => (
          <li
            key={index}
            onClick={() => handleSubcategoryClick(category)}
            className={`category-item ${selectedSubcategory === category ? 'selected' : ''}`}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategorySidebar;
