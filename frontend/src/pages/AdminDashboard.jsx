import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Users, Package, Grid, ShoppingBag, IndianRupee, Plus, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
          API.get('/auth/users'),
          API.get('/products?limit=1000'),
          API.get('/categories'),
          API.get('/orders')
        ]);

        const usersCount = usersRes.data?.count || 0;
        const productsCount = productsRes.data?.totalProducts || 0;
        const categoriesCount = categoriesRes.data?.count || 0;
        const orders = ordersRes.data?.data || [];
        const ordersCount = orders.length;

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        setStats({
          usersCount,
          productsCount,
          categoriesCount,
          ordersCount,
          totalRevenue
        });
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <span className="badge bg-danger mb-2">Administrator Panel</span>
          <h2 className="brand-font fw-bold m-0">Admin Control Center</h2>
        </div>
        <Link to="/admin/products/add" className="btn btn-fashion rounded-pill d-flex align-items-center gap-2">
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading metrics...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-lg-2 col-md-4 col-6">
              <div className="bg-white p-4 rounded-4 shadow-sm border text-center">
                <Users size={32} className="text-primary mb-2" />
                <h3 className="fw-bold text-dark m-0">{stats.usersCount}</h3>
                <small className="text-muted fw-semibold">Total Users</small>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-6">
              <div className="bg-white p-4 rounded-4 shadow-sm border text-center">
                <Package size={32} className="text-success mb-2" />
                <h3 className="fw-bold text-dark m-0">{stats.productsCount}</h3>
                <small className="text-muted fw-semibold">Total Products</small>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-6">
              <div className="bg-white p-4 rounded-4 shadow-sm border text-center">
                <Grid size={32} className="text-warning mb-2" />
                <h3 className="fw-bold text-dark m-0">{stats.categoriesCount}</h3>
                <small className="text-muted fw-semibold">Categories</small>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-6">
              <div className="bg-white p-4 rounded-4 shadow-sm border text-center">
                <ShoppingBag size={32} className="text-danger mb-2" />
                <h3 className="fw-bold text-dark m-0">{stats.ordersCount}</h3>
                <small className="text-muted fw-semibold">Total Orders</small>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-12">
              <div className="bg-dark text-white p-4 rounded-4 shadow-sm text-center">
                <IndianRupee size={32} className="text-warning mb-2" />
                <h3 className="fw-bold m-0">₹{stats.totalRevenue.toLocaleString()}</h3>
                <small className="text-light opacity-75 fw-semibold">Total Revenue</small>
              </div>
            </div>
          </div>

          {/* Admin Action Management Navigation Cards */}
          <h4 className="fw-bold text-dark mb-3">Inventory & Store Management</h4>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                <Package size={36} className="text-danger mb-3" />
                <h5 className="fw-bold text-dark">Manage Products</h5>
                <p className="text-muted small">View, search, edit, create or delete fashion inventory items.</p>
                <Link to="/admin/products" className="btn btn-outline-dark rounded-pill mt-auto">
                  Manage Catalog →
                </Link>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                <Grid size={36} className="text-warning mb-3" />
                <h5 className="fw-bold text-dark">Manage Categories</h5>
                <p className="text-muted small">Create, update or organize fashion departments and image banners.</p>
                <Link to="/admin/categories" className="btn btn-outline-dark rounded-pill mt-auto">
                  Manage Categories →
                </Link>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                <ShoppingBag size={36} className="text-primary mb-3" />
                <h5 className="fw-bold text-dark">Manage Orders</h5>
                <p className="text-muted small">Update order shipping statuses, view customer orders and fulfillments.</p>
                <Link to="/admin/orders" className="btn btn-outline-dark rounded-pill mt-auto">
                  Manage Orders →
                </Link>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                <Users size={36} className="text-success mb-3" />
                <h5 className="fw-bold text-dark">Manage Users</h5>
                <p className="text-muted small">View registered customer directory, roles, emails and phone numbers.</p>
                <Link to="/admin/users" className="btn btn-outline-dark rounded-pill mt-auto">
                  Manage Users →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
