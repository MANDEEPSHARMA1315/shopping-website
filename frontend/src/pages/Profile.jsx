import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      setSubmitting(true);
      const res = await updateProfile(formData);
      if (res.success) {
        setMessage('Profile updated successfully!');
        setFormData((prev) => ({ ...prev, password: '' }));
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 my-3">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div className="bg-danger text-white p-3 rounded-circle fw-bold fs-4">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="brand-font fw-bold text-dark m-0">{user?.name}</h3>
                <span className="badge bg-danger mt-1">{user?.role}</span>
              </div>
            </div>

            {message && (
              <div className="alert alert-success rounded-3 small d-flex align-items-center gap-2 mb-4">
                <CheckCircle2 size={18} /> {message}
              </div>
            )}

            {error && (
              <div className="alert alert-danger rounded-3 small d-flex align-items-center gap-2 mb-4">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><User size={18} /></span>
                    <input
                      type="text"
                      name="name"
                      className="form-control bg-light border-start-0 ps-0"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Email (Read Only)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Mail size={18} /></span>
                    <input
                      type="email"
                      className="form-control bg-light border-start-0 ps-0 text-muted"
                      value={user?.email || ''}
                      readOnly
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
                  <label className="form-label fw-semibold text-dark small">New Password (Optional)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Lock size={18} /></span>
                    <input
                      type="password"
                      name="password"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="Leave blank to keep current"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark small">Default Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><MapPin size={18} /></span>
                    <textarea
                      name="address"
                      className="form-control bg-light border-start-0 ps-0"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-fashion btn-lg rounded-pill px-4"
                  disabled={submitting}
                >
                  {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
