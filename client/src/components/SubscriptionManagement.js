import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SubscriptionManagement = () => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const fetchTenantInfo = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/tenants/${user.tenant.slug}`);
      setTenant(res.data);
    } catch (error) {
      setError('Failed to fetch tenant information');
    } finally {
      setLoading(false);
    }
  }, [user.tenant.slug]);

  useEffect(() => {
    fetchTenantInfo();
  }, [fetchTenantInfo]);

  const upgradeToPro = async () => {
    try {
      setError('');
      setSuccess('');
      const res = await api.post(`/api/tenants/${user.tenant.slug}/upgrade`);
      setTenant(res.data.tenant);
      setSuccess('Successfully upgraded to Pro plan! You can now create unlimited notes.');
    } catch (error) {
      setError('Failed to upgrade to Pro plan');
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <h3>Loading subscription information...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Subscription Management</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="card">
        <h3>Current Plan: {tenant?.subscription.toUpperCase()}</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>Plan Details</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Tenant:</strong> {tenant?.name}
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Current Plan:</strong> {tenant?.subscription}
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Note Limit:</strong> {tenant?.noteLimit === -1 ? 'Unlimited' : tenant?.noteLimit}
            </li>
          </ul>
        </div>

        {tenant?.subscription === 'free' && (
          <div>
            <h4>Upgrade to Pro</h4>
            <p>Upgrade to Pro plan to get unlimited notes and additional features.</p>
            <button 
              className="btn btn-success"
              onClick={upgradeToPro}
            >
              Upgrade to Pro Plan
            </button>
          </div>
        )}

        {tenant?.subscription === 'pro' && (
          <div className="alert alert-success">
            <h4>🎉 Pro Plan Active</h4>
            <p>You have unlimited notes and access to all features!</p>
          </div>
        )}
      </div>

      <div className="card">
        <h4>Plan Comparison</h4>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            flex: '1', 
            minWidth: '200px', 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            backgroundColor: tenant?.subscription === 'free' ? '#f8f9fa' : '#fff'
          }}>
            <h5>Free Plan</h5>
            <ul>
              <li>Up to 3 notes</li>
              <li>Basic features</li>
              <li>Community support</li>
            </ul>
            {tenant?.subscription === 'free' && (
              <div style={{ color: '#007bff', fontWeight: 'bold' }}>Current Plan</div>
            )}
          </div>
          
          <div style={{ 
            flex: '1', 
            minWidth: '200px', 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            backgroundColor: tenant?.subscription === 'pro' ? '#f8f9fa' : '#fff'
          }}>
            <h5>Pro Plan</h5>
            <ul>
              <li>Unlimited notes</li>
              <li>Advanced features</li>
              <li>Priority support</li>
              <li>Admin controls</li>
            </ul>
            {tenant?.subscription === 'pro' && (
              <div style={{ color: '#28a745', fontWeight: 'bold' }}>Current Plan</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
