import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    gender: 'Men',
    price: '',
    discount: '0',
    sizes: '',
    availableColors: '',
    image: '',
    stock: '',
    rating: '4.5'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catsRes, prodRes] = await Promise.all([
          API.get('/categories'),
          API.get(`/products/${id}`)
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.data);
        if (prodRes.data.success) {
          const p = prodRes.data.data;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            brand: p.brand || '',
            category: p.category?._id || p.category || '',
            gender: p.gender || 'Men',
            price: p.price || '',
            discount: p.discount !== undefined ? p.discount.toString() : '0',
            sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || '',
            availableColors: Array.isArray(p.availableColors) ? p.availableColors.join(', ') : p.availableColors || '',
            image: p.image || '',
            stock: p.stock !== undefined ? p.stock.toString() : '10',
            rating: p.rating !== undefined ? p.rating.toString() : '4.5'
          });
        }
      } catch (err) {
        setErrorMsg('Failed to load product for editing');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setSaving(true);
      const sizesArray = formData.sizes.split(',').map((s) => s.trim());
      const colorsArray = formData.availableColors.split(',').map((c) => c.trim());

      const payload = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        rating: Number(formData.rating),
        sizes: sizesArray,
        availableColors: colorsArray
      };

      const res = await API.put(`/products/${id}`, payload);
      if (res.data.success) {
        navigate('/admin/products');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update product';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
        <button className="btn btn-outline-dark rounded-circle p-2" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="brand-font fw-bold m-0">Edit Product</h2>
          <p className="text-muted small m-0">Update item details & stock status</p>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger rounded-4 d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={20} />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-8">
              <label className="form-label fw-semibold text-dark">Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-control bg-light"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Brand *</label>
              <input
                type="text"
                name="brand"
                className="form-control bg-light"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-dark">Description *</label>
              <textarea
                name="description"
                className="form-control bg-light"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Category *</label>
              <select
                name="category"
                className="form-select bg-light"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Gender Target</label>
              <select
                name="gender"
                className="form-select bg-light"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Price (₹) *</label>
              <input
                type="number"
                name="price"
                className="form-control bg-light"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Discount (%)</label>
              <input
                type="number"
                name="discount"
                className="form-control bg-light"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Stock Units *</label>
              <input
                type="number"
                name="stock"
                className="form-control bg-light"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Rating</label>
              <input
                type="number"
                step="0.1"
                name="rating"
                className="form-control bg-light"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">Sizes (Comma separated)</label>
              <input
                type="text"
                name="sizes"
                className="form-control bg-light"
                value={formData.sizes}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">Colors (Comma separated)</label>
              <input
                type="text"
                name="availableColors"
                className="form-control bg-light"
                value={formData.availableColors}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-dark">Image URL *</label>
              <input
                type="text"
                name="image"
                className="form-control bg-light"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-top">
            <button
              type="submit"
              className="btn btn-fashion btn-lg rounded-pill px-5 d-flex align-items-center gap-2"
              disabled={saving}
            >
              <Save size={20} /> {saving ? 'Updating...' : 'Save Product Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
