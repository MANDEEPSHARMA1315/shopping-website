import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-flex align-items-center text-white text-decoration-none mb-3">
              <ShoppingBag className="text-danger me-2" size={28} />
              <span className="brand-font fs-3 fw-bold">LUXE<span className="text-danger">.</span></span>
            </Link>
            <p className="text-secondary small leading-relaxed">
              Discover the latest fashion trends, luxury apparel, footwear, and designer accessories. Elevate your wardrobe with premium collections.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-twitter-x fs-5"></i></a>
              <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-pinterest fs-5"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Shop Categories</h6>
            <ul className="list-unstyled text-secondary small d-grid gap-2">
              <li><Link to="/products?gender=Men" className="text-white-50 text-decoration-none">Men's Collection</Link></li>
              <li><Link to="/products?gender=Women" className="text-white-50 text-decoration-none">Women's Collection</Link></li>
              <li><Link to="/products?gender=Kids" className="text-white-50 text-decoration-none">Kids' Wear</Link></li>
              <li><Link to="/products?category=Shoes" className="text-white-50 text-decoration-none">Footwear & Shoes</Link></li>
              <li><Link to="/products?category=Accessories" className="text-white-50 text-decoration-none">Designer Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Customer Care</h6>
            <ul className="list-unstyled text-secondary small d-grid gap-2">
              <li><Link to="/cart" className="text-white-50 text-decoration-none">My Cart</Link></li>
              <li><Link to="/orders" className="text-white-50 text-decoration-none">Track Order</Link></li>
              <li><Link to="/profile" className="text-white-50 text-decoration-none">Account Settings</Link></li>
              <li><a href="#" className="text-white-50 text-decoration-none">Shipping & Returns</a></li>
              <li><a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Get in Touch</h6>
            <div className="d-flex flex-column gap-2 text-secondary small">
              <div className="d-flex align-items-center gap-2 text-white-50">
                <MapPin size={16} className="text-danger" /> 101 Fashion Blvd, Mumbai, MH
              </div>
              <div className="d-flex align-items-center gap-2 text-white-50">
                <Phone size={16} className="text-danger" /> +91 98765 43210
              </div>
              <div className="d-flex align-items-center gap-2 text-white-50">
                <Mail size={16} className="text-danger" /> support@luxefashion.com
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
          <p className="mb-2 mb-md-0">
            © {new Date().getFullYear()} LUXE Fashion Inc. All rights reserved.
          </p>
          <p className="mb-0 d-flex align-items-center gap-1">
            Crafted with <Heart size={14} className="text-danger fill-danger" /> for Fashion Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
