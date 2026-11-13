import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Filter, RotateCcw } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories for sidebar:', err);
      }
    };
    loadCategories();
  }, []);

  const brandsList = ['Nike', 'Adidas', 'Puma', 'Zara', 'Levis', 'H&M', 'Gucci', 'Fossil', 'Tommy Hilfiger', 'Forever 21'];
  const sizesList = ['S', 'M', 'L', 'XL', '30', '32', '34', '7', '8', '9', '10', '11'];
  const gendersList = ['Men', 'Women', 'Kids', 'Unisex'];

  return (
    <div className="filter-sidebar mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
          <Filter size={18} className="text-danger" /> Filters
        </h5>
        <button className="btn btn-sm btn-link text-danger text-decoration-none p-0 d-flex align-items-center gap-1" onClick={onReset}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Gender Filter */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2 fs-6">Gender</h6>
        <div className="d-flex flex-wrap gap-2">
          {gendersList.map((g) => (
            <button
              key={g}
              type="button"
              className={`btn btn-sm ${filters.gender === g ? 'btn-danger fw-bold' : 'btn-outline-secondary'}`}
              onClick={() => onFilterChange('gender', filters.gender === g ? '' : g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2 fs-6">Categories</h6>
        <div className="d-flex flex-column gap-1 max-h-200 overflow-auto pe-1">
          <label className="form-check-label d-flex align-items-center gap-2 py-1 cursor-pointer">
            <input
              type="radio"
              name="category"
              className="form-check-input"
              checked={!filters.category}
              onChange={() => onFilterChange('category', '')}
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="form-check-label d-flex align-items-center gap-2 py-1 cursor-pointer">
              <input
                type="radio"
                name="category"
                className="form-check-input"
                checked={filters.category === cat.name || filters.category === cat._id}
                onChange={() => onFilterChange('category', cat.name)}
              />
              <span className="small">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2 fs-6">Price Range (₹)</h6>
        <div className="row g-2 align-items-center">
          <div className="col-6">
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2 fs-6">Brands</h6>
        <div className="d-flex flex-wrap gap-1">
          {brandsList.map((b) => (
            <button
              key={b}
              type="button"
              className={`btn btn-sm ${filters.brand === b ? 'btn-dark' : 'btn-light text-secondary border'}`}
              onClick={() => onFilterChange('brand', filters.brand === b ? '' : b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2 fs-6">Sizes</h6>
        <div className="d-flex flex-wrap gap-1">
          {sizesList.map((s) => (
            <button
              key={s}
              type="button"
              className={`btn btn-sm ${filters.size === s ? 'btn-danger fw-bold' : 'btn-outline-secondary'}`}
              style={{ minWidth: '36px' }}
              onClick={() => onFilterChange('size', filters.size === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-2">
        <h6 className="fw-bold text-dark mb-2 fs-6">Rating</h6>
        <select
          className="form-select form-select-sm"
          value={filters.minRating || ''}
          onChange={(e) => onFilterChange('minRating', e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="4.5">4.5 & above ★</option>
          <option value="4.0">4.0 & above ★</option>
          <option value="3.5">3.5 & above ★</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
