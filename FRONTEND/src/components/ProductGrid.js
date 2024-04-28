
import React, { useState, useEffect } from 'react';
import './ProductGrid.css';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function ProductGrid({ products, selectedSubcategory, minimal }) {
  const { addToCart } = useContext(CartContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sizeSelections, setSizeSelections] = useState({});
  const [sortOption, setSortOption] = useState('ASC');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    let filtered = [];
    if (selectedSubcategory) {
      filtered = products.filter((product) => product.subcategory === selectedSubcategory);
    } else {
      filtered = products;
    }

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOption === 'ASC') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortOption === 'DESC') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    setFilteredProducts(filtered);
  }, [products, selectedSubcategory, sortOption, search]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSizeChange = (productId, size) => {
    setSizeSelections({ ...sizeSelections, [productId]: size });
  };

  const handleAddToCart = (product) => {
    const selectedSize = sizeSelections[product.id];
    if (!selectedSize) {
      alert('Selecteaza o marime inainte sa adaugi un produs in cos.');
      return;
    }
    addToCart({ ...product, selectedSize });
  };

  return (
    <div>
      {!minimal && ( 
        <div className="search-bar">
          <input
            type="text"
            placeholder=" Cauta dupa nume sau categorie: "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )} 
      {!minimal && ( 
        <div className="sort-options">
          <label htmlFor="sort">Sorteaza dupa:</label>
          <select id="sort" onChange={(e) => setSortOption(e.target.value)}>
            <option value="ASC">Pret: Crescator</option>
            <option value="DESC">Pret: Descrescator</option>
          </select>
        </div>
      )} 
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product">
            <Link to={`/product/${product.id}`}>
              <img src={`http://localhost:5000/${product.imagePath}`} alt={product.name} />
              <h4>{product.name}</h4>
            </Link>
            <div className="product-grid-item-info">{product.description}</div>
            <p>{product.price} Lei </p>
            <select
  className="size-selector"
  value={sizeSelections[product.id] || ''}
  onChange={(e) => handleSizeChange(product.id, e.target.value)}
>
  <option value="" disabled>
    Alege marimea
  </option>
  {Array.isArray(product.sizes) ? (
  product.sizes.map((size) => (
    <option key={size} value={size}>
      {size}
    </option>
  ))
) : (
  <option disabled>Error: marime invalida</option>
)}
</select>

              <button onClick={() => handleAddToCart(product)}>Adauga in cos</button>
            </div>
          ))}
       </div>
      {!minimal && ( 
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active-page' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )} 
    </div>
  );
}


  
  export default ProductGrid;