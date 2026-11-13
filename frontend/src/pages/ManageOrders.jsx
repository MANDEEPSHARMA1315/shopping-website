import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { ShoppingBag, Truck, Calendar, MapPin, User } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}`, { orderStatus: newStatus });
      if (res.data.success) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="brand-font fw-bold m-0">Customer Orders</h2>
          <p className="text-muted small m-0">Manage order fulfillment & status tracking</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border">
          <ShoppingBag size={40} className="text-muted mb-2" />
          <h5 className="fw-bold">No Customer Orders Yet</h5>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-4 shadow-sm border p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-3 gap-2">
                <div>
                  <span className="text-muted small">Order ID: </span>
                  <strong className="text-dark font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</strong>
                  <div className="text-muted small d-flex align-items-center gap-2 mt-1">
                    <span><User size={14} /> {order.user?.name || 'Customer'} ({order.user?.email})</span>
                    <span>•</span>
                    <span><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark small me-1">Status:</span>
                  <select
                    className="form-select form-select-sm fw-bold rounded-pill border-secondary"
                    style={{ width: '150px' }}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="d-flex flex-column gap-2 mb-3">
                {order.products.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between small">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="rounded object-fit-cover"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <span className="fw-bold text-dark">{item.product?.name}</span>
                      <span className="text-muted">(Size: {item.size}, Color: {item.color}, Qty: {item.quantity})</span>
                    </div>
                    <span className="fw-bold text-dark">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center border-top pt-3 small text-muted">
                <div>
                  <MapPin size={14} className="text-danger me-1" /> Address: <strong>{order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}</strong>
                </div>
                <div className="fs-6 fw-bold text-danger">
                  Total Amount: ₹{order.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
