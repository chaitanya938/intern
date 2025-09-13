import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    const fieldName = e.target.name === 'login-email-field' ? 'email' : 'password';
    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });
  };


  // Clear form fields on component mount to prevent autofill
  useEffect(() => {
    // Clear immediately
    setFormData({
      email: '',
      password: ''
    });
    
    // Clear multiple times to override browser autofill
    const timers = [];
    
    for (let i = 0; i < 10; i++) {
      const timer = setTimeout(() => {
        setFormData({
          email: '',
          password: ''
        });
      }, i * 100);
      timers.push(timer);
    }
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="container">
      <div className="login-form" style={{ maxWidth: '400px', margin: '100px auto' }}>
        <div className="card">
          <h2 className="text-center mb-3">Login to Notes App</h2>
          
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="login-email-field"
                value={formData.email}
                onChange={handleChange}
                autoComplete="new-password"
                autoFocus
                placeholder="Enter your email"
                required
                style={{ 
                  backgroundColor: 'white',
                  color: 'black'
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="login-password-field"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Enter your password"
                required
                style={{ 
                  backgroundColor: 'white',
                  color: 'black'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-3 test-accounts">
            <h4>Test Accounts:</h4>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <p><strong>Acme:</strong></p>
              <p>admin@acme.test (Admin)</p>
              <p>user@acme.test (Member)</p>
              <br />
              <p><strong>Globex:</strong></p>
              <p>admin@globex.test (Admin)</p>
              <p>user@globex.test (Member)</p>
              <br />
              <p><strong>Password for all:</strong> password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;