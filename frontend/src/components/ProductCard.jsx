import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Star, Eye, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
  const defaultColor = product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : 'Black';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await addToCart(product._id, 1, defaultSize, defaultColor);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      alert(res.message);
    }
  };

  const finalPrice = product.finalPrice || Math.round(product.price - (product.price * (product.discount || 0)) / 100);

  return (
    <div className="product-card h-100 d-flex flex-column">
      {/* Product Image Wrapper */}
      <div className="product-img-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.discount > 0 && (
          <span className="badge-discount">-{product.discount}% OFF</span>
        )}
        <span className="badge-gender">{product.gender}</span>
      </div>

      {/* Product Details */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-muted small text-uppercase fw-bold tracking-wider">{product.brand}</span>
          <div className="d-flex align-items-center text-warning small fw-bold">
            <Star size={14} className="fill-warning me-1" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
          </div>
        </div>

        <h6 className="fw-bold text-dark text-truncate mb-2" title={product.name}>
          <Link to={`/products/${product._id}`} className="text-dark text-decoration-none hover-text-danger">
            {product.name}
          </Link>
        </h6>

        {/* Sizes Preview */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="d-flex gap-1 mb-2 align-items-center">
            <small className="text-muted me-1">Sizes:</small>
            {product.sizes.slice(0, 4).map((s, idx) => (
              <span key={idx} className="badge bg-light text-secondary border px-1">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
          <div>
            <span className="fs-5 fw-bold text-dark">₹{finalPrice.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="text-muted text-decoration-line-through ms-2 small">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="d-flex gap-1">
            <Link
              to={`/products/${product._id}`}
              className="btn btn-outline-secondary btn-sm p-2 rounded-circle"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <button
              className={`btn ${added ? 'btn-success' : 'btn-danger'} btn-sm px-3 rounded-pill d-flex align-items-center gap-1`}
              onClick={handleAddToCart}
            >
              {added ? <Check size={14} /> : <ShoppingBag size={14} />}
              <span>{added ? 'Added' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
