import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, Plus, Minus, ShieldCheck, Tag } from 'lucide-react';

const Cart = () => {
  const { cart, updateCartItem, removeCartItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center my-4">
        <div className="bg-white rounded-4 shadow-sm border p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="bg-danger-subtle text-danger p-4 rounded-circle d-inline-flex mb-3">
            <ShoppingCart size={48} />
          </div>
          <h2 className="brand-font fw-bold text-dark mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-muted mb-4">
            Looks like you haven't added any luxury fashion items to your shopping bag yet.
          </p>
          <Link to="/products" className="btn btn-fashion btn-lg rounded-pill px-4">
            Start Shopping Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="brand-font fw-bold m-0">Shopping Cart</h2>
          <p className="text-muted small m-0">
            {cart.totalItemsCount} item{cart.totalItemsCount > 1 ? 's' : ''} in your bag
          </p>
        </div>

        <button
          className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center gap-1"
          onClick={clearCart}
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Left Item List */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {cart.items.map((item) => {
              const product = item.product || {};
              const unitPrice = item.price;
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={item._id} className="bg-white p-3 p-md-4 rounded-4 shadow-sm border d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                  {/* Image & Info */}
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'}
                      alt={product.name}
                      className="rounded-3 object-fit-cover shadow-sm"
                      style={{ width: '80px', height: '80px' }}
                    />
                    <div>
                      <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ maxWidth: '240px' }}>
                        <Link to={`/products/${product._id}`} className="text-dark text-decoration-none hover-text-danger">
                          {product.name || 'Fashion Product'}
                        </Link>
                      </h6>
                      <div className="text-muted small mb-1">
                        Brand: <span className="fw-bold text-dark">{product.brand || 'Luxury'}</span>
                      </div>
                      <div className="d-flex gap-2">
                        <span className="badge bg-light text-dark border">Size: {item.size}</span>
                        <span className="badge bg-light text-dark border">Color: {item.color}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4 w-100-mobile">
                    <div className="input-group input-group-sm" style={{ width: '110px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateCartItem(item._id, item.quantity - 1, item.size, item.color)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="form-control text-center fw-bold bg-white">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateCartItem(item._id, item.quantity + 1, item.size, item.color)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-end" style={{ minWidth: '90px' }}>
                      <div className="fw-bold text-dark fs-6">₹{lineTotal.toLocaleString()}</div>
                      <small className="text-muted">₹{unitPrice} each</small>
                    </div>

                    <button
                      className="btn btn-link text-muted p-1 hover-text-danger"
                      onClick={() => removeCartItem(item._id)}
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Link to="/products" className="btn btn-outline-dark rounded-pill d-inline-flex align-items-center gap-2">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Order Calculation Summary */}
        <div className="col-lg-4">
          <div className="bg-white p-4 rounded-4 shadow-sm border sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Subtotal</span>
              <span className="fw-bold text-dark">₹{cart.subtotal.toLocaleString()}</span>
            </div>

            {cart.discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount Savings</span>
                <span className="fw-bold">- ₹{cart.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-3 text-secondary">
              <span>Delivery Fee</span>
              {cart.deliveryFee === 0 ? (
                <span className="fw-bold text-success">FREE</span>
              ) : (
                <span className="fw-bold text-dark">₹{cart.deliveryFee}</span>
              )}
            </div>

            {cart.subtotal > 0 && cart.subtotal < 2000 && (
              <div className="alert alert-warning py-2 small rounded-3 mb-3">
                <Tag size={14} className="me-1" /> Add <strong>₹{2000 - cart.subtotal}</strong> more for FREE Delivery!
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between mb-4 fs-5 fw-bold text-dark">
              <span>Grand Total</span>
              <span className="text-danger">₹{cart.totalAmount.toLocaleString()}</span>
            </div>

            <button
              className="btn btn-fashion btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mb-3"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="text-center text-muted small d-flex align-items-center justify-content-center gap-1">
              <ShieldCheck size={16} className="text-success" /> Encrypted & Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
