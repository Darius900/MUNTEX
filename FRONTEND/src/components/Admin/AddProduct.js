import React, { useState, useEffect } from 'react';
import './AddProduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [subcategory, setSubcategory] = useState('');
  const [sizes, setSizes] = useState(''); 
  const [stock, setStock] = useState(''); 
  const [stockPerSize, setStockPerSize] = useState({});
  const [supplierId, setSupplierId] = useState('');
  const [suppliers, setSuppliers] = useState([]);

    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/suppliers');
        const jsonResponse = await response.json();
        setSuppliers(jsonResponse);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    useEffect(() => {
      fetchSuppliers();
    }, []);
    



  const handleSizeStockChange = (size, stock) => {
    setStockPerSize({ ...stockPerSize, [size]: stock });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const stockData = {};
    sizes.split(',').forEach((size) => {
      const trimmedSize = size.trim();
      stockData[trimmedSize] = parseInt(stockPerSize[trimmedSize]);
    });
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('category', category);
    formData.append('image', image);
    formData.append('subcategory', subcategory);
    formData.append('sizes', sizes);
    formData.append('stock', JSON.stringify(stockData)); 
    formData.append('supplierId', supplierId);
    
    
    
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Product added:', jsonResponse);
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setImage(null);
        setSubcategory('');
        setSizes('');
      } else {
        console.error('Failed to add product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  


  return (
    
    <div className="add-product-container">
     <h2>Adauga produs</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nume Produs:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Descriere:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Pret:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="category">Categorie:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecteaza o categorie</option>
            <option value="men">Barbati</option>
            <option value="women">Femei</option>
            <option value="equipment">Echipament</option>
          </select>
        </div>
        <div>
          <label htmlFor="subcategory">Subcategorie</label>
          <input
            type="text"
            name="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          />
        </div>

        <div>
  <label htmlFor="supplier">Furnizor:</label>
  <select
  id="supplier"
  value={supplierId}
  onChange={(e) => setSupplierId(e.target.value)}
>
  <option value="">Selecteaza un furnizor</option>
  {suppliers.map((supplier) => (
    <option key={supplier.id} value={supplier.id}>
      {supplier.name}
    </option>
  ))}
</select>

</div>

        <div>
          <label htmlFor="sizes">Marimi (separate prin virgula):</label>
          <input
            type="text"
            id="sizes"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
          />
        </div>

        {
          sizes.split(',').map((size) => {
            const trimmedSize = size.trim();
            return (
              <div key={trimmedSize}>
                <label htmlFor={`stock_${trimmedSize}`}>Stoc pentru marime {trimmedSize}:</label>
                <input
                  type="number"
                  id={`stock_${trimmedSize}`}
                  value={stockPerSize[trimmedSize] || ''}
                  onChange={(e) => handleSizeStockChange(trimmedSize, e.target.value)}
                />
              </div>
            );
          })
        }

        <div>
          <label htmlFor="image">Imagine:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        
      <button type="submit">Adauga produs</button>
    
      </form>
    </div>
  );
}

export default AddProduct;
           
