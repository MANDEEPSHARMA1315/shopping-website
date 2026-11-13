import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFillManu = () => {
    setEmail('manusharma@gmail.com');
    setPassword('user123');
  };

  const handleQuickFillUser = () => {
    setEmail('user@fashion.com');
    setPassword('user123');
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@fashion.com');
    setPassword('admin123');
  };

  return (
    <div className="container py-5 my-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div className="bg-danger-subtle text-danger p-3 rounded-circle d-inline-flex mb-3">
                <LogIn size={32} />
              </div>
              <h2 className="brand-font fw-bold text-dark m-0">Welcome Back</h2>
              <p className="text-muted small">Log in to your LUXE Fashion account</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show rounded-3 small d-flex align-items-center gap-2" role="alert">
                <AlertCircle size={18} />
                <div>{error}</div>
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark small">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-fashion btn-lg w-100 rounded-pill mb-3"
                disabled={submitting}
              >
                {submitting ? 'Logging in...' : 'Sign In'}
              </button>

              {/* Quick Fill Demo Buttons */}
              <div className="border-top pt-3 mt-3 text-center">
                <small className="text-muted d-block mb-2 font-mono">Quick Test Demo Fill:</small>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark rounded-pill fw-semibold"
                    onClick={handleQuickFillManu}
                  >
                    Demo Manu Sharma
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={handleQuickFillUser}
                  >
                    Demo User
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-pill"
                    onClick={handleQuickFillAdmin}
                  >
                    Demo Admin
                  </button>
                </div>
              </div>
            </form>

            <div className="text-center mt-4 pt-2 border-top">
              <p className="text-muted small m-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-danger fw-bold text-decoration-none">
                  Register Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
