import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Plus, Edit, Trash2, Grid } from 'lucide-react';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active'
  });

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateNew = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
      status: 'active'
    });
    setShowForm(true);
  };

  const handleEditClick = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status || 'active'
    });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        const res = await API.delete(`/categories/${id}`);
        if (res.data.success) {
          setCategories(categories.filter((c) => c._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingCat) {
        const res = await API.put(`/categories/${editingCat._id}`, formData);
        if (res.data.success) {
          setShowForm(false);
          fetchCategories();
        }
      } else {
        const res = await API.post('/categories', formData);
        if (res.data.success) {
          setShowForm(false);
          fetchCategories();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="brand-font fw-bold m-0">Manage Categories</h2>
          <p className="text-muted small m-0">Organize store departments</p>
        </div>
        <button className="btn btn-fashion rounded-pill d-flex align-items-center gap-1" onClick={handleCreateNew}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="card border-0 rounded-4 shadow-lg p-4 bg-white mb-4">
          <h5 className="fw-bold mb-3">{editingCat ? 'Edit Category' : 'Create New Category'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Category Name *</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Status</label>
                <select
                  className="form-select bg-light"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Description</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Banner Image URL</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-danger rounded-pill px-4">
                {editingCat ? 'Save Changes' : 'Create Category'}
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading categories...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-4 shadow-sm border p-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <span className="fw-bold text-dark">{c.name}</span>
                    </div>
                  </td>
                  <td className="text-muted small">{c.description || 'No description'}</td>
                  <td>
                    <span className={`badge ${c.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-outline-primary rounded-circle p-2" onClick={() => handleEditClick(c)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => handleDelete(c._id, c.name)}>
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

export default ManageCategories;
