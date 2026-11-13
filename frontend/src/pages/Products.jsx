import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Parse filters from URL search params
  const filters = {
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.set(key, filters[key]);
        }
      });

      const response = await API.get(`/products?${queryParams.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalProducts(response.data.totalProducts);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const updateFilterParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 when changing filters
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-4">
      {/* Header & Search */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <h2 className="brand-font fw-bold m-0">Fashion Catalog</h2>
          <p className="text-muted small m-0">
            Showing <strong className="text-dark">{totalProducts}</strong> products available
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Mobile Filter Toggle Button */}
          <button
            className="btn btn-outline-dark d-md-none rounded-pill d-flex align-items-center gap-1"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          {/* Sort Selector */}
          <select
            className="form-select form-select-sm rounded-pill px-3 py-2 border-secondary"
            style={{ width: '200px' }}
            value={filters.sort}
            onChange={(e) => updateFilterParam('sort', e.target.value)}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Filter Sidebar */}
        <div className={`col-md-3 ${showMobileFilter ? 'd-block' : 'd-none d-md-block'}`}>
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilterParam}
            onReset={resetFilters}
          />
        </div>

        {/* Right Product Grid */}
        <div className="col-md-9">
          {/* Search indicator bar if active */}
          {filters.search && (
            <div className="alert alert-light border rounded-3 mb-3 d-flex justify-content-between align-items-center py-2">
              <span className="small">
                Search results for: <strong className="text-danger">"{filters.search}"</strong>
              </span>
              <button
                className="btn btn-sm btn-link text-decoration-none p-0 text-muted"
                onClick={() => updateFilterParam('search', '')}
              >
                Clear Search ✕
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border p-5">
              <PackageSearch size={48} className="text-muted mb-3" />
              <h4 className="fw-bold text-dark mb-2">No Products Found</h4>
              <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                We couldn't find any fashion items matching your selected criteria. Try adjusting your filters or search terms.
              </p>
              <button className="btn btn-danger rounded-pill px-4" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {products.map((product) => (
                  <div key={product._id} className="col-lg-4 col-sm-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination pagination-rounded gap-1">
                      <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(filters.page - 1)}>
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${filters.page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(filters.page + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
