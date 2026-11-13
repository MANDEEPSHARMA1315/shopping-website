import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import API from '../services/api';
import { CheckCircle2, ShieldCheck, MapPin, CreditCard, Truck, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      setErrorMsg('Please complete all shipping address fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/orders', {
        shippingAddress,
        paymentMethod
      });

      if (res.data.success) {
        setOrderSuccess(true);
        await fetchCart(); // refresh cart state to 0 items
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to place order';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="bg-white rounded-4 shadow-lg border p-5 mx-auto" style={{ maxWidth: '550px' }}>
          <CheckCircle2 size={64} className="text-success mb-3 animate-bounce" />
          <h2 className="brand-font fw-bold text-dark mb-2">Order Placed Successfully!</h2>
          <p className="text-muted mb-4">
            Thank you for shopping with LUXE Fashion. Your order has been placed and is being processed.
          </p>
          <div className="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
          <span className="text-secondary small">Redirecting to My Orders page...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="brand-font fw-bold mb-4">Checkout & Delivery</h2>

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show rounded-4 d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={20} />
          <div>{errorMsg}</div>
          <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          {/* Shipping Form */}
          <div className="col-lg-7">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <MapPin size={20} className="text-danger" /> Shipping Address Details
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control bg-light"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control bg-light"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark small">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control bg-light"
                    placeholder="House No, Apartment, Street Name"
                    value={shippingAddress.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark small">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control bg-light"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark small">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control bg-light"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark small">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-control bg-light"
                    value={shippingAddress.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <CreditCard size={20} className="text-danger" /> Payment Method
              </h5>

              <div className="d-flex flex-column gap-3">
                <label className={`border p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${paymentMethod === 'Cash on Delivery' ? 'border-danger bg-danger-subtle' : ''}`}>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="form-check-input"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                    />
                    <div>
                      <h6 className="fw-bold m-0 text-dark">Cash on Delivery (COD)</h6>
                      <small className="text-muted">Pay in cash upon delivery to your doorstep</small>
                    </div>
                  </div>
                  <Truck size={24} className="text-danger" />
                </label>

                <label className={`border p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${paymentMethod === 'Online Payment' ? 'border-danger bg-danger-subtle' : ''}`}>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="form-check-input"
                      checked={paymentMethod === 'Online Payment'}
                      onChange={() => setPaymentMethod('Online Payment')}
                    />
                    <div>
                      <h6 className="fw-bold m-0 text-dark">Online Payment (UPI / Cards / NetBanking)</h6>
                      <small className="text-muted">Demo Instant Gateway Payment Mode</small>
                    </div>
                  </div>
                  <CreditCard size={24} className="text-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Order Summary Column */}
          <div className="col-lg-5">
            <div className="bg-white p-4 rounded-4 shadow-sm border sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Order Items Summary</h5>

              <div className="max-h-300 overflow-auto mb-3 pe-1">
                {cart.items.map((item) => (
                  <div key={item._id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                        alt={item.product?.name}
                        className="rounded object-fit-cover"
                        style={{ width: '45px', height: '45px' }}
                      />
                      <div>
                        <h6 className="small fw-bold text-dark m-0 text-truncate" style={{ maxWidth: '180px' }}>
                          {item.product?.name}
                        </h6>
                        <small className="text-muted">Size: {item.size} | Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="fw-bold text-dark small">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Subtotal</span>
                <span className="fw-bold text-dark">₹{cart.subtotal.toLocaleString()}</span>
              </div>

              {cart.discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span className="fw-bold">- ₹{cart.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-3 text-secondary">
                <span>Delivery Charges</span>
                <span className="fw-bold text-dark">
                  {cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold text-dark">
                <span>Final Total Amount</span>
                <span className="text-danger">₹{cart.totalAmount.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="btn btn-fashion btn-lg w-100 rounded-pill"
                disabled={submitting}
              >
                {submitting ? 'Processing Order...' : 'Confirm & Place Order'}
              </button>

              <div className="text-center text-muted small mt-3">
                <ShieldCheck size={16} className="text-success me-1" /> Safe & Secure 256-bit SSL Checkout
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
