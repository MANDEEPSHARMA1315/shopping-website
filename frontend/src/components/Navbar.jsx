import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Search, User, LogOut, LayoutDashboard, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center me-4" to="/">
          <ShoppingBag className="text-danger me-2" size={28} />
          <span className="brand-font fs-3 fw-bold text-dark tracking-tight">LUXE<span className="text-danger">.</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links & Search */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/products?gender=Men">Men</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/products?gender=Women">Women</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/products?gender=Kids">Kids</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/products?category=Shoes">Shoes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/products?category=Accessories">Accessories</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-muted px-3" to="/categories">Categories</Link>
            </li>
          </ul>

          {/* Search Form */}
          <form className="d-flex me-3 my-2 my-lg-0" onSubmit={handleSearchSubmit}>
            <div className="input-group search-input-group">
              <input
                type="text"
                className="form-control border-end-0 bg-light rounded-start-pill ps-3"
                placeholder="Search fashion, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-light border-start-0 text-muted rounded-end-pill pe-3" type="submit">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Link to="/cart" className="position-relative text-dark text-decoration-none p-2 rounded-circle hover-bg-light">
              <ShoppingCart size={22} />
              {cart.totalItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fw-bold" style={{ fontSize: '0.7rem' }}>
                  {cart.totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Link */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-dark rounded-pill dropdown-toggle d-flex align-items-center gap-2 py-1 px-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <User size={18} />
                  <span className="fw-semibold small">{user.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4 mt-2">
                  <li>
                    <span className="dropdown-item-text fw-bold text-dark border-bottom pb-2">
                      {user.name}
                      <br />
                      <small className="text-muted fw-normal">{user.email}</small>
                      <br />
                      <span className="badge bg-danger mt-1">{user.role}</span>
                    </span>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/admin">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/orders">
                      <ShoppingBag size={16} /> My Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/profile">
                      <User size={16} /> Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={logout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-fashion-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-fashion btn-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
