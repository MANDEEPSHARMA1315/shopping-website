import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, MapPin, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSubmitting(true);
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role
      });

      if (res.success) {
        navigate('/');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An unexpected error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 my-3">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div className="bg-danger-subtle text-danger p-3 rounded-circle d-inline-flex mb-3">
                <UserPlus size={32} />
              </div>
              <h2 className="brand-font fw-bold text-dark m-0">Create Account</h2>
              <p className="text-muted small">Join LUXE Fashion for exclusive rewards & seamless shopping</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show rounded-3 small d-flex align-items-center gap-2" role="alert">
                <AlertCircle size={18} />
                <div>{error}</div>
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark small">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><User size={18} /></span>
                    <input
                      type="text"
                      name="name"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark small">Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Mail size={18} /></span>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Lock size={18} /></span>
                    <input
                      type="password"
                      name="password"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Confirm Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Lock size={18} /></span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Phone size={18} /></span>
                    <input
                      type="text"
                      name="phone"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Account Type</label>
                  <select
                    name="role"
                    className="form-select bg-light"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">Customer (User)</option>
                    <option value="admin">Store Admin</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark small">Shipping Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><MapPin size={18} /></span>
                    <textarea
                      name="address"
                      className="form-control bg-light border-start-0 ps-0"
                      rows="2"
                      placeholder="123 Street Name, City, State, Pincode"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-fashion btn-lg w-100 rounded-pill mt-4"
                disabled={submitting}
              >
                {submitting ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>

            <div className="text-center mt-4 pt-2 border-top">
              <p className="text-muted small m-0">
                Already registered?{' '}
                <Link to="/login" className="text-danger fw-bold text-decoration-none">
                  Log In Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
