import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const NotesList = ({ showCreateForm: initialShowCreateForm = false }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(initialShowCreateForm);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.tenant) {
      fetchNotes();
    }
  }, [user]);

  // Clear error and reset state when user changes
  useEffect(() => {
    setError('');
    setNotes([]);
    setLoading(true);
  }, [user]);

  useEffect(() => {
    setShowCreateForm(initialShowCreateForm);
  }, [initialShowCreateForm]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/notes');
      setNotes(res.data);
    } catch (error) {
      console.error('Fetch notes error:', error);
      if (error.response?.status === 401) {
        setError('Please login again');
      } else {
        setError('Failed to fetch notes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/notes', formData);
      setNotes([res.data, ...notes]);
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      setUpgradeMessage('');
    } catch (error) {
      if (error.response?.data?.message?.includes('Free plan limit')) {
        setUpgradeMessage('Free plan limit reached. Upgrade to Pro for unlimited notes.');
      } else {
        setError('Failed to create note');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/notes/${editingNote._id}`, formData);
      setNotes(notes.map(note => 
        note._id === editingNote._id ? res.data : note
      ));
      setFormData({ title: '', content: '' });
      setEditingNote(null);
    } catch (error) {
      setError('Failed to update note');
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/api/notes/${noteId}`);
        setNotes(notes.filter(note => note._id !== noteId));
      } catch (error) {
        setError('Failed to delete note');
      }
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setShowCreateForm(false);
    setUpgradeMessage('');
  };

  const upgradeToPro = async () => {
    try {
      await api.post(`/api/tenants/${user.tenant.slug}/upgrade`);
      setUpgradeMessage('Successfully upgraded to Pro plan! You can now create unlimited notes.');
      // Refresh user data or update context
      window.location.reload();
    } catch (error) {
      setError('Failed to upgrade to Pro plan');
    }
  };

  if (loading) {
    return <div className="text-center">Loading notes...</div>;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Notes ({user.tenant.name})</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Create Note
          </button>
          {user.role === 'admin' && user.tenant.subscription === 'free' && (
            <button 
              className="btn btn-success"
              onClick={upgradeToPro}
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {upgradeMessage && (
        <div className="alert alert-info">
          {upgradeMessage}
        </div>
      )}

      {showCreateForm && (
        <div className="card">
          <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
          <form onSubmit={editingNote ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingNote ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="card text-center">
          <p>No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div>
          {notes.map(note => (
            <div key={note._id} className="card">
              <div className="d-flex justify-content-between align-items-start">
                <div style={{ flex: 1 }}>
                  <h4>{note.title}</h4>
                  <p style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
                    {note.content}
                  </p>
                  <small style={{ color: '#666' }}>
                    Created by {note.author.email} on {new Date(note.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                    {note.updatedAt !== note.createdAt && (
                      <span> • Updated on {new Date(note.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}</span>
                    )}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => startEdit(note)}
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '12px',
                      borderRadius: '4px',
                      minWidth: '60px',
                      height: '32px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(note._id)}
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '12px',
                      borderRadius: '4px',
                      minWidth: '60px',
                      height: '32px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
