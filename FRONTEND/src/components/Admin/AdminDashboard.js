import React, { useState } from 'react';
import AddProduct from './AddProduct';
import AdminProduct from './AdminProductList';
import AdminOrderList from './AdminOrderList';
import AdminUserList from './AdminUserList';
import './AdminDashboard.css';

import ProductSalesChart from './OrderDetailRaport';
import OrderDistributionChart from './ComenziPlasate';
import UserActivityChart from './UsersCreated';
import OrderVolumeChart from './RaportProduseFurnizori';
import ProductInventoryChart from './MostSelled';
import PaymentChart from './ProduseVandute';

import AdminReturnList from './AdminReturnList';

import AddSupplier from './AddSupplier';
import AdminSupplierList from './AdminSupplierList';


import AddEmployee from './AddEmployee';
import AdminEmployeeList from './AdminEmployeeList';


const AdminDashboard = () => {
  
  const [activeSection, setActiveSection] = useState('products');

  const renderSection = () => {
    switch (activeSection) {
      case 'add-product':
        return <AddProduct />;
      case 'products':
        return <AdminProduct />;
      case 'orders':
        return <AdminOrderList />;
      case 'users':
        return <AdminUserList />;
      case 'product-sales-chart':
        return <ProductSalesChart />;
      case 'order-distribution-chart':
        return <OrderDistributionChart />;
      case 'user-activity-chart':
        return <UserActivityChart />;
      case 'order-volume-chart':
        return <OrderVolumeChart />;
      case 'product-inventory-chart':
        return <ProductInventoryChart />;

        case 'returns':
      return <AdminReturnList />;

        case 'PaymentChart':
          return <PaymentChart />;

      default:
        return <AdminProduct />;
        case 'add-supplier':
  return <AddSupplier />;
case 'suppliers':
  return <AdminSupplierList />;
  case 'add-employee':
    return <AddEmployee />;
  case 'employees':
    return <AdminEmployeeList />;
    }
  };

  return (
    <div className="admin-dashboard">
      
      <div className="admin-dashboard-wrapper">
        <aside className="admin-dashboard-sidebar">
        <h3>Administrare</h3>
          <ul>
            <li>
              <button onClick={() => setActiveSection('add-product')}>Adauga produs</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('products')}>Produse</button>
            </li>
            <li>
          <button onClick={() => setActiveSection('returns')}>Cereri returnari</button>
        </li>
            <li>
              <button onClick={() => setActiveSection('orders')}>Comenzi</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('users')}>Utilizatori</button>
            </li>
            <h3>Rapoarte</h3>
            <li>
              <button onClick={() => setActiveSection('product-sales-chart')}>Raport - Detalii comanda</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('order-distribution-chart')}>Raport - Comenzi plasate</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('user-activity-chart')}>Raport - Utilizatori creati</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('order-volume-chart')}>Raport - Produse de la un anumit furnizor</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('product-inventory-chart')}>Raport - Raport cel mai vândut produs</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('PaymentChart')}>Raport - Produse vândute</button>
            </li>
            
          </ul>
          
          <h3>Furnizori</h3>
          <ul>
            <li>
              <button onClick={() => setActiveSection('add-supplier')}>Adauga furnizor</button>
            </li>
            
            <li>
              <button onClick={() => setActiveSection('suppliers')}>Gestionati furnizorii</button>
            </li>
          </ul>
          <h3>Angajati</h3>
<ul>
  <li>
    <button onClick={() => setActiveSection('add-employee')}>Adauga angajati</button>
  </li>
  <li>
    <button onClick={() => setActiveSection('employees')}>Gestionati angajatii</button>
  </li>
</ul>

        </aside>
        <main className="admin-dashboard-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
