import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Package, Clock, Truck, CheckCircle, XCircle, MapPin, Calendar } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge bg-info-subtle text-info border border-info px-3 py-2 rounded-pill"><Clock size={14} className="me-1" /> Confirmed</span>;
      case 'Shipped':
        return <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill"><Truck size={14} className="me-1" /> Shipped</span>;
      case 'Delivered':
        return <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill"><CheckCircle size={14} className="me-1" /> Delivered</span>;
      case 'Cancelled':
        return <span className="badge bg-danger-subtle text-danger border border-danger px-3 py-2 rounded-pill"><XCircle size={14} className="me-1" /> Cancelled</span>;
      default:
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning px-3 py-2 rounded-pill"><Clock size={14} className="me-1" /> Pending</span>;
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="brand-font fw-bold m-0">My Orders</h2>
          <p className="text-muted small m-0">View and track your fashion orders</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <Package size={48} className="text-muted mb-3" />
          <h4 className="fw-bold text-dark mb-2">No Orders Found</h4>
          <p className="text-muted mb-4">You haven't placed any fashion orders yet.</p>
          <Link to="/products" className="btn btn-fashion rounded-pill px-4">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-4 shadow-sm border p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-3 gap-2">
                <div>
                  <span className="text-muted small">Order ID: </span>
                  <strong className="text-dark font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</strong>
                  <div className="text-muted small d-flex align-items-center gap-1 mt-1">
                    <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div>{getStatusBadge(order.orderStatus)}</div>
              </div>

              {/* Products List */}
              <div className="d-flex flex-column gap-3 mb-3">
                {order.products.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                        alt={item.product?.name}
                        className="rounded-3 object-fit-cover shadow-sm"
                        style={{ width: '60px', height: '60px' }}
                      />
                      <div>
                        <h6 className="fw-bold text-dark m-0 text-truncate" style={{ maxWidth: '300px' }}>
                          {item.product?.name || 'Fashion Product'}
                        </h6>
                        <small className="text-muted">
                          Brand: {item.product?.brand || 'Luxury'} | Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </small>
                      </div>
                    </div>
                    <span className="fw-bold text-dark">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <hr />

              {/* Order Footer */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pt-2">
                <div className="small text-muted d-flex align-items-center gap-1">
                  <MapPin size={16} className="text-danger" /> Delivery to: <strong className="text-dark">{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</strong>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="small text-muted">Payment: <strong className="text-dark">{order.paymentMethod}</strong></span>
                  <span className="fs-5 fw-bold text-danger">Total: ₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
