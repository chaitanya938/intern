import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeView, setActiveView }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'notes', label: 'My Notes', icon: '📝' },
    { id: 'create', label: 'Create Note', icon: '➕' },
  ];

  // Add admin menu items if user is admin
  if (user.role === 'admin') {
    menuItems.push(
      { id: 'subscription', label: 'Subscription', icon: '💳' },
      { id: 'users', label: 'Users', icon: '👥' }
    );
  }

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      padding: '20px 0',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h4 style={{ color: '#007bff', marginBottom: '5px' }}>Notes App</h4>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          {user.tenant.name} - {user.tenant.subscription.toUpperCase()}
        </p>
      </div>

      <nav>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              width: '100%',
              padding: '12px 20px',
              border: 'none',
              backgroundColor: activeView === item.id ? '#007bff' : 'transparent',
              color: activeView === item.id ? 'white' : '#333',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (activeView !== item.id) {
                e.target.style.backgroundColor = '#e9ecef';
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== item.id) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }}>
        <div style={{
          padding: '10px',
          backgroundColor: '#e9ecef',
          borderRadius: '5px',
          fontSize: '12px',
          color: '#666'
        }}>
          <div><strong>User:</strong> {user.email}</div>
          <div><strong>Role:</strong> {user.role}</div>
          <div><strong>Plan:</strong> {user.tenant.subscription}</div>
          {user.tenant.subscription === 'free' && (
            <div style={{ color: '#dc3545', marginTop: '5px' }}>
              ⚠️ Limited to 3 notes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
