import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import ManageProducts from './pages/ManageProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ManageCategories from './pages/ManageCategories';
import ManageOrders from './pages/ManageOrders';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100 bg-soft">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Protected Pages */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Admin Protected Pages */}
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><ManageProducts /></ProtectedRoute>} />
                <Route path="/admin/products/add" element={<ProtectedRoute adminOnly={true}><AddProduct /></ProtectedRoute>} />
                <Route path="/admin/products/edit/:id" element={<ProtectedRoute adminOnly={true}><EditProduct /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute adminOnly={true}><ManageCategories /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><ManageOrders /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><ManageUsers /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
