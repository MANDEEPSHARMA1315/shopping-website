import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products?limit=100');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const res = await API.delete(`/products/${id}`);
        if (res.data.success) {
          setProducts(products.filter((p) => p._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom gap-3">
        <div>
          <h2 className="brand-font fw-bold m-0">Product Inventory</h2>
          <p className="text-muted small m-0">Manage catalog, pricing, and stock levels</p>
        </div>

        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control form-control-sm rounded-pill px-3"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/admin/products/add" className="btn btn-fashion btn-sm rounded-pill d-flex align-items-center gap-1 text-nowrap">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border">
          <AlertCircle size={40} className="text-muted mb-2" />
          <h5 className="fw-bold">No Products Found</h5>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-4 shadow-sm border p-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="rounded object-fit-cover shadow-sm"
                        style={{ width: '48px', height: '48px' }}
                      />
                      <div>
                        <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                          {p.name}
                        </div>
                        <small className="text-muted">★ {p.rating}</small>
                      </div>
                    </div>
                  </td>
                  <td className="fw-semibold text-secondary">{p.brand}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {p.category?.name || 'General'}
                    </span>
                  </td>
                  <td><span className="small">{p.gender}</span></td>
                  <td>
                    <span className="fw-bold text-dark">₹{p.finalPrice || p.price}</span>
                    {p.discount > 0 && <small className="text-danger ms-1">(-{p.discount}%)</small>}
                  </td>
                  <td>
                    <span className={`badge ${p.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="btn btn-sm btn-outline-primary rounded-circle p-2"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle p-2"
                        onClick={() => handleDelete(p._id, p.name)}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
