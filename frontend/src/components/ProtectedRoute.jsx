import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm rounded-4 p-4 my-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="fw-bold">Access Denied</h4>
          <p className="mb-0">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
