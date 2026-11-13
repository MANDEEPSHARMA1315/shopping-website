import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Users, Mail, Phone, Shield } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await API.get('/auth/users');
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch users directory:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="brand-font fw-bold m-0">User Directory</h2>
          <p className="text-muted small m-0">Manage registered customer accounts and administrator permissions</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading users...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-4 shadow-sm border p-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-dark text-white p-2 rounded-circle fw-bold small d-inline-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold text-dark">{u.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <Mail size={14} /> {u.email}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <Phone size={14} /> {u.phone || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-danger text-white' : 'bg-light text-dark border'}`}>
                      <Shield size={12} className="me-1" /> {u.role}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
