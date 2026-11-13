import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, ArrowLeft, AlertCircle } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    gender: 'Men',
    price: '',
    discount: '0',
    sizes: 'S, M, L, XL',
    availableColors: 'Black, White, Blue',
    image: '',
    stock: '15',
    rating: '4.5'
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success && res.data.data.length > 0) {
          setCategories(res.data.data);
          setFormData((prev) => ({ ...prev, category: res.data.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.description || !formData.brand || !formData.category || !formData.price || !formData.image) {
      setErrorMsg('Please complete all required fields (Name, Description, Brand, Category, Price, Image URL)');
      return;
    }

    try {
      setLoading(true);
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

      const res = await API.post('/products', payload);
      if (res.data.success) {
        navigate('/admin/products');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create product';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
        <button className="btn btn-outline-dark rounded-circle p-2" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="brand-font fw-bold m-0">Add New Fashion Product</h2>
          <p className="text-muted small m-0">Create new item entry in catalog</p>
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
                placeholder="e.g. Nike Air Max Urban Sneakers"
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
                placeholder="e.g. Nike, Zara, Adidas"
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
                placeholder="Describe fit, fabric composition, features..."
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
                placeholder="2999"
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
                placeholder="10"
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
                placeholder="20"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark">Rating (0 to 5)</label>
              <input
                type="number"
                step="0.1"
                name="rating"
                className="form-control bg-light"
                placeholder="4.5"
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
                placeholder="S, M, L, XL or 7, 8, 9, 10"
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
                placeholder="Black, White, Red, Blue"
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
                placeholder="https://images.unsplash.com/..."
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
              disabled={loading}
            >
              <PlusCircle size={20} /> {loading ? 'Saving...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
