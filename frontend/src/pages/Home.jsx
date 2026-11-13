import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock, Tag } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes, newRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products?limit=8&sort=rating'),
          API.get('/products?limit=4&sort=newest')
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.data);
        if (newRes.data.success) setNewArrivals(newRes.data.data);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="homepage pb-5">
      {/* Hero Banner */}
      <section className="container my-4">
        <div className="hero-banner p-5 text-white d-flex align-items-center rounded-4 shadow-lg position-relative overflow-hidden">
          <div className="col-lg-7 position-relative z-1 py-4">
            <span className="badge bg-danger text-white px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-3">
              <Sparkles size={14} className="me-1" /> New Season Collection 2026
            </span>
            <h1 className="display-4 brand-font fw-bold mb-3 leading-tight">
              Redefine Your Style With Premium Couture
            </h1>
            <p className="fs-5 text-light opacity-90 mb-4 fw-light">
              Explore curated luxury apparel, footwear, and designer accessories crafted for trendsetters. Enjoy up to 40% OFF on season arrivals.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/products" className="btn btn-danger btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center gap-2 shadow">
                Shop Collection <ArrowRight size={20} />
              </Link>
              <Link to="/categories" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-semibold">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container my-5">
        <div className="row g-4 text-center">
          <div className="col-md-3 col-6">
            <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
              <Truck size={32} className="text-danger mb-2" />
              <h6 className="fw-bold m-0">Express Shipping</h6>
              <small className="text-muted">Free delivery over ₹2,000</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
              <ShieldCheck size={32} className="text-danger mb-2" />
              <h6 className="fw-bold m-0">100% Authentic</h6>
              <small className="text-muted">Direct from luxury brands</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
              <Clock size={32} className="text-danger mb-2" />
              <h6 className="fw-bold m-0">30-Day Returns</h6>
              <small className="text-muted">Hassle-free easy exchanges</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
              <Tag size={32} className="text-danger mb-2" />
              <h6 className="fw-bold m-0">Best Price Guarantee</h6>
              <small className="text-muted">Exclusive seasonal discounts</small>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories Showcase */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-danger fw-bold text-uppercase small tracking-wider">Curated Collections</span>
            <h2 className="brand-font fw-bold m-0 fs-2">Shop by Category</h2>
          </div>
          <Link to="/categories" className="btn btn-outline-dark rounded-pill px-3 py-1 btn-sm fw-semibold">
            View All Categories
          </Link>
        </div>

        <div className="row g-3">
          {categories.slice(0, 6).map((cat) => (
            <div key={cat._id} className="col-lg-2 col-md-4 col-6">
              <Link to={`/products?category=${cat.name}`} className="text-decoration-none text-dark group">
                <div className="bg-white p-3 text-center rounded-4 shadow-sm border hover-border-danger transition">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="rounded-circle mb-3 object-fit-cover shadow-sm"
                    style={{ width: '90px', height: '90px' }}
                  />
                  <h6 className="fw-bold mb-1 text-truncate">{cat.name}</h6>
                  <small className="text-muted">Explore →</small>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-danger fw-bold text-uppercase small tracking-wider">Top Rated Trends</span>
            <h2 className="brand-font fw-bold m-0 fs-2">Featured Products</h2>
          </div>
          <Link to="/products" className="btn btn-outline-dark rounded-pill px-3 py-1 btn-sm fw-semibold">
            See All Products
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Promotional Discount Banner */}
      <section className="container my-5">
        <div className="bg-dark text-white rounded-4 p-5 shadow-lg position-relative overflow-hidden">
          <div className="row align-items-center">
            <div className="col-md-7">
              <span className="badge bg-warning text-dark font-mono px-3 py-2 rounded-pill fw-bold mb-3">
                EXCLUSIVE LIMITED OFFER
              </span>
              <h2 className="brand-font display-5 fw-bold mb-3">
                Get Extra 20% OFF On Your First Order
              </h2>
              <p className="text-secondary fs-6 mb-4">
                Use promo code <strong className="text-white">LUXE20</strong> at checkout to redeem instant extra savings across all categories.
              </p>
              <Link to="/products" className="btn btn-danger btn-lg px-4 py-2 rounded-pill fw-bold">
                Claim Offer Now
              </Link>
            </div>
            <div className="col-md-5 text-center d-none d-md-block">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
                alt="Discount Watch"
                className="img-fluid rounded-4 shadow-lg border border-secondary"
                style={{ maxHeight: '240px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-danger fw-bold text-uppercase small tracking-wider">Fresh In Stock</span>
            <h2 className="brand-font fw-bold m-0 fs-2">New Arrivals</h2>
          </div>
        </div>

        <div className="row g-4">
          {newArrivals.map((product) => (
            <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
