import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { ArrowRight, Grid } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-2">
          <Grid size={14} className="me-1" /> Explore Fashion Departments
        </span>
        <h1 className="brand-font display-5 fw-bold text-dark">Fashion Categories</h1>
        <p className="text-muted fs-6">
          Browse our extensively curated departments from high-end streetwear to formal evening attire.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading categories...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {categories.map((cat) => (
            <div key={cat._id} className="col-lg-4 col-md-6">
              <Link to={`/products?category=${cat.name}`} className="text-decoration-none group">
                <div className="card border-0 rounded-4 shadow-sm overflow-hidden h-100 bg-white hover-shadow-lg transition position-relative">
                  <div style={{ height: '240px', overflow: 'hidden' }}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-100 h-100 object-fit-cover transition transform-scale"
                    />
                  </div>
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold text-dark mb-2 brand-font">{cat.name}</h4>
                      <p className="text-muted small mb-3">{cat.description || 'Discover luxury collection.'}</p>
                    </div>
                    <div className="d-flex align-items-center text-danger fw-bold small">
                      <span>Explore Collection</span>
                      <ArrowRight size={16} className="ms-1 transition-translate" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
