import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductSection from './components/ProductSection';
import AboutUsSection from './components/AboutUsSection';
import Register from './pages/Register';
import Login from './pages/Login';
import MenSection from './components/MenSection';
import WomenSection from './components/WomenSection';
import EquipmentSection from './components/EquipmentSection';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminProductList from './components/Admin/AdminProductList';
import AdminOrderList from './components/Admin/AdminOrderList';
import AdminUserList from './components/Admin/AdminUserList';
import withAuth from './components/withAuth';
import Checkout from './pages/Checkout';
import { CartProvider } from './contexts/CartContext';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ProductPage from './components/ProductPage'; 
import OrderConfirmation from './components/OrderConfirmation'; 
import ConfirmAccount from './pages/ConfirmAccount';
import CategoriesPage from './components/CategoriesPage';

import MyOrders from './pages/MyOrders';
import MyAccount from './pages/MyAccount';
import MyAddresses from './pages/MyAddresses';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Contact from './components/Contact';


import './App.css';


const basename = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/` : '/';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const AdminDashboardWithAuth = withAuth(AdminDashboard, true);
  const AdminProductListWithAuth = withAuth(AdminProductList, true);
  const AdminOrderListWithAuth = withAuth(AdminOrderList, true);
  const AdminUserListWithAuth = withAuth(AdminUserList, true);

  return (
    <CartProvider>
      <Router>
      
        <div className="App">
          <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<><HeroSection /><ProductSection /><AboutUsSection /></>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/men" element={<MenSection />} />
              <Route path="/women" element={<WomenSection />} />
              <Route path="/equipment" element={<EquipmentSection />} />
              <Route path="/admin" element={<AdminDashboardWithAuth />} />
              <Route path="/admin/products" element={<AdminProductListWithAuth />} />
              <Route path="/admin/orders" element={<AdminOrderListWithAuth />} />
              <Route path="/admin/users" element={<AdminUserListWithAuth />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/confirm/:userId" element={<ConfirmAccount />} />
              <Route path="/categories" element={<CategoriesPage/>} />
              <Route path="/my-orders" element={<MyOrders/>} />
              <Route path="/my-account" element={<MyAccount/>} />
              <Route path="/my-addresses" element={<MyAddresses/>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword/>} />
              <Route path="/contact" element={<Contact />} />

              
              
              </Routes>
          </div>
          <Footer />
        </div>
        
      </Router>
    </CartProvider>
  );
}

export default App;
