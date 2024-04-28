import React from 'react';
import './CategoriesPage.css';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  return (
    <div className="categories-container">
      <Link to="/men" className="category-box men">
        <h3>Barbati</h3>
      </Link>
      <Link to="/women" className="category-box women">
        <h3>Femei</h3>
      </Link>
      <Link to="/equipment" className="category-box equipment">
        <h3>Echipament</h3>
      </Link>
    </div>
  );
};

export default CategoriesPage;
