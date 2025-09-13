import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import NotesList from './components/NotesList';
import Sidebar from './components/Sidebar';
import SubscriptionManagement from './components/SubscriptionManagement';
import UserManagement from './components/UserManagement';

const AppContent = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [activeView, setActiveView] = useState('notes');

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: '100px' }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'notes':
        return <NotesList />;
      case 'create':
        return <NotesList showCreateForm={true} />;
      case 'subscription':
        return <SubscriptionManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <NotesList />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div style={{ 
        marginLeft: '250px', 
        flex: 1, 
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{
          background: '#007bff', 
          color: 'white', 
          padding: '15px 20px',
          margin: '-20px -20px 20px -20px',
          borderRadius: '0 0 8px 0'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 style={{ margin: 0 }}>Notes App - {user.tenant.name}</h3>
            <div className="d-flex gap-2 align-items-center">
              <span>
                {user.email} ({user.role}) - {user.tenant.subscription.toUpperCase()}
              </span>
              <button 
                className="btn btn-light"
                onClick={logout}
                style={{ padding: '5px 15px', fontSize: '14px' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
