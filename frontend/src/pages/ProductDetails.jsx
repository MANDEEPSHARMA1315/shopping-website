import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus, AlertCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          const prod = res.data.data;
          setProduct(prod);
          if (prod.sizes && prod.sizes.length > 0) setSelectedSize(prod.sizes[0]);
          if (prod.availableColors && prod.availableColors.length > 0) setSelectedColor(prod.availableColors[0]);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-center py-5 my-5">
        <h3 className="fw-bold">Product Not Found</h3>
        <p className="text-muted">The requested fashion item does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-danger rounded-pill px-4">Back to Shop</Link>
      </div>
    );
  }

  const finalPrice = product.finalPrice || Math.round(product.price - (product.price * (product.discount || 0)) / 100);

  const handleAddToCart = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedSize) {
      setErrorMsg('Please select an available size before adding to cart.');
      return;
    }

    if (!selectedColor) {
      setErrorMsg('Please select an available color.');
      return;
    }

    const res = await addToCart(product._id, quantity, selectedSize, selectedColor);
    if (res.success) {
      setSuccessMsg('Product added to cart successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      if (!user) {
        navigate('/login');
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleBuyNow = async () => {
    setErrorMsg('');
    if (!selectedSize) {
      setErrorMsg('Please select an available size before purchasing.');
      return;
    }

    const res = await addToCart(product._id, quantity, selectedSize, selectedColor);
    if (res.success) {
      navigate('/cart');
    } else {
      if (!user) navigate('/login');
      else setErrorMsg(res.message);
    }
  };

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-muted">Products</Link></li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show rounded-4 d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={20} />
          <div>{errorMsg}</div>
          <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show rounded-4 d-flex align-items-center gap-2 mb-4" role="alert">
          <Check size={20} />
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row g-5 bg-white p-4 p-md-5 rounded-4 shadow-sm border">
        {/* Left Product Image */}
        <div className="col-md-6 text-center">
          <div className="rounded-4 overflow-hidden shadow-sm bg-light position-relative" style={{ maxHeight: '500px' }}>
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid w-100 object-fit-cover"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
            {product.discount > 0 && (
              <span className="badge-discount fs-6 px-3 py-2">
                -{product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Details Column */}
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div>
            {/* Brand & Category */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase fw-bold text-danger tracking-wider small">
                {product.brand} • {product.gender}
              </span>
              <div className="d-flex align-items-center text-warning fw-bold">
                <Star size={16} className="fill-warning me-1" />
                <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
              </div>
            </div>

            <h1 className="brand-font fw-bold text-dark fs-2 mb-3">{product.name}</h1>

            {/* Price Section */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="display-6 fw-bold text-dark">₹{finalPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <span className="fs-5 text-muted text-decoration-line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
              <span className={`badge ${product.stock > 0 ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'} px-3 py-2 rounded-pill`}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-secondary leading-relaxed mb-4">{product.description}</p>

            <hr />

            {/* Size Selector */}
            <div className="mb-4">
              <label className="fw-bold text-dark d-block mb-2">
                Select Size <span className="text-danger">*</span>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes && product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-pill ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="mb-4">
                <label className="fw-bold text-dark d-block mb-2">
                  Select Color
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {product.availableColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`btn btn-sm ${selectedColor === c ? 'btn-dark' : 'btn-light border text-secondary'}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="fw-bold text-dark d-block mb-2">Quantity</label>
              <div className="d-flex align-items-center gap-3">
                <div className="input-group input-group-sm" style={{ width: '130px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    className="form-control text-center fw-bold bg-white"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <div className="row g-3">
              <div className="col-6">
                <button
                  className="btn btn-fashion-outline btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag size={20} /> Add to Cart
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-fashion btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Guarantee features */}
            <div className="d-flex justify-content-between text-muted small mt-4 pt-3 border-top">
              <span className="d-flex align-items-center gap-1"><Truck size={14} className="text-danger" /> Free Express Shipping</span>
              <span className="d-flex align-items-center gap-1"><ShieldCheck size={14} className="text-danger" /> 100% Genuine Product</span>
              <span className="d-flex align-items-center gap-1"><RotateCcw size={14} className="text-danger" /> Easy 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
