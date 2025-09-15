import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'member' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Fetch users error:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await api.post('/api/users/invite', inviteData);
      setUsers([...users, res.data.user]);
      setShowInviteForm(false);
      setInviteData({ email: '', role: 'member' });
      alert('User invited successfully! Default password: password');
    } catch (error) {
      console.error('Invite user error:', error);
      setError(error.response?.data?.message || 'Failed to invite user');
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <h3>Loading users...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>User Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowInviteForm(true)}
        >
          Invite User
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {showInviteForm && (
        <div className="card">
          <h3>Invite New User</h3>
          <form onSubmit={handleInvite}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={inviteData.role}
                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Send Invitation
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowInviteForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Current Users</h3>
        {users.length === 0 ? (
          <p>No users found in your tenant.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
