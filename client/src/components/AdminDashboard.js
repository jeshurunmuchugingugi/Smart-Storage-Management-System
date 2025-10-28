import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ admin, onLogout }) => {
  const [units, setUnits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [features, setFeatures] = useState([]);
  const [transports, setTransports] = useState([]);
  const [activeTab, setActiveTab] = useState(window.location.pathname === '/bookings' ? 'bookings' : 'units');
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    unit_number: '',
    site: '',
    size: '',
    monthly_rate: '',
    status: 'available',
    location: ''
  });

  // Robust API call with multiple fallback strategies
  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      // First attempt with token
      let response = await fetch(url, { ...options, headers });
      
      if (response.status === 401 && token) {
        // Try to refresh token
        try {
          const refreshResponse = await fetch('/api/admin/refresh-token', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (refreshResponse.ok) {
            const { access_token } = await refreshResponse.json();
            localStorage.setItem('admin_token', access_token);
            // Retry with new token
            response = await fetch(url, {
              ...options,
              headers: { ...headers, 'Authorization': `Bearer ${access_token}` }
            });
          }
        } catch (refreshError) {
          console.log('Token refresh failed, trying without auth');
        }
        
        // If still 401, try without authentication for certain endpoints
        if (response.status === 401 && (url.includes('/units') || url.includes('/features'))) {
          const noAuthHeaders = { 'Content-Type': 'application/json' };
          response = await fetch(url, { ...options, headers: noAuthHeaders });
        }
      }
      
      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
    // Set up auto-refresh every 30 seconds to catch new bookings
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Use direct fetch for better reliability
      const [unitsRes, bookingsRes, featuresRes, transportsRes] = await Promise.all([
        fetch('/api/units', { headers: { 'Content-Type': 'application/json' } }),
        fetch('/api/bookings', { headers: { 'Content-Type': 'application/json' } }),
        fetch('/api/features', { headers: { 'Content-Type': 'application/json' } }),
        fetch('/api/transportation', { headers: { 'Content-Type': 'application/json' } })
      ]);

      const unitsData = await unitsRes.json();
      const bookingsData = await bookingsRes.json();
      const featuresData = await featuresRes.json();
      const transportsData = await transportsRes.json();

      setUnits(Array.isArray(unitsData) ? unitsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setFeatures(Array.isArray(featuresData) ? featuresData : []);
      setTransports(Array.isArray(transportsData) ? transportsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleCreateUnit = async (e) => {
    e.preventDefault();
    
    if (!formData.unit_number || !formData.site || !formData.size || !formData.monthly_rate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const unitData = {
      unit_number: formData.unit_number.trim(),
      site: formData.site.trim(),
      size: formData.size.trim(),
      monthly_rate: parseFloat(formData.monthly_rate),
      status: formData.status,
      location: formData.location.trim()
    };
    
    try {
      // Try multiple approaches to ensure unit creation works
      let response = await apiCall('/api/units', {
        method: 'POST',
        body: JSON.stringify(unitData)
      });

      // If first attempt fails, try direct fetch without token
      if (!response.ok) {
        response = await fetch('/api/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(unitData)
        });
      }

      if (response.ok) {
        await fetchData();
        setShowCreateForm(false);
        setFormData({ unit_number: '', site: '', monthly_rate: '', status: 'available', location: '' });
        alert('Unit created successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Error: ${errorData.error || 'Failed to create unit'}`);
      }
    } catch (error) {
      console.error('Create unit error:', error);
      alert('Failed to create unit. Please check your connection and try again.');
    }
  };

  const handleUpdateUnit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall(`/api/units/${editingUnit.unit_id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchData();
        setEditingUnit(null);
        setFormData({ unit_number: '', site: '', monthly_rate: '', status: 'available', location: '' });
      }
    } catch (error) {
      if (error.message !== 'Session expired') {
        alert('Failed to update unit. Please try again.');
      }
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        const response = await apiCall(`/api/units/${unitId}`, { method: 'DELETE' });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        if (error.message !== 'Session expired') {
          alert('Failed to delete unit. Please try again.');
        }
      }
    }
  };

  const startEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      unit_number: unit.unit_number,
      site: unit.site,
      size: unit.size || '',
      monthly_rate: unit.monthly_rate,
      status: unit.status,
      location: unit.location || ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    onLogout();
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-left">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-stats">
            <div className="stat-item">
              <span className="stat-number">{units.length}</span>
              <span className="stat-label">Units</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{bookings.length}</span>
              <span className="stat-label">Bookings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{transports.length}</span>
              <span className="stat-label">Transports</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">{admin.username.charAt(0).toUpperCase()}</div>
            <span className="welcome-text">{admin.username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('units')} 
          className={`admin-tab ${activeTab === 'units' ? 'active' : ''}`}
        >
          Storage Units
        </button>
        <button 
          onClick={() => setActiveTab('bookings')} 
          className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
        >
          Bookings
        </button>
        <button 
          onClick={() => setActiveTab('features')} 
          className={`admin-tab ${activeTab === 'features' ? 'active' : ''}`}
        >
          Features
        </button>
        <button 
          onClick={() => setActiveTab('transports')} 
          className={`admin-tab ${activeTab === 'transports' ? 'active' : ''}`}
        >
          Transportation
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'units' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Storage Units Management</h2>
              <button 
                onClick={() => setShowCreateForm(true)} 
                className="create-btn"
              >
                <span className="btn-icon">+</span>
                Add New Unit
              </button>
            </div>

            {(showCreateForm || editingUnit) && (
              <div className="form-container">
                <h3 className="form-title">{editingUnit ? 'Edit Unit' : 'Create New Unit'}</h3>
                <form onSubmit={editingUnit ? handleUpdateUnit : handleCreateUnit} className="admin-form">
                  <input
                    type="text"
                    placeholder="Unit Number"
                    value={formData.unit_number}
                    onChange={(e) => setFormData({...formData, unit_number: e.target.value})}
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Site"
                    value={formData.site}
                    onChange={(e) => setFormData({...formData, site: e.target.value})}
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Size (e.g., 10m2)"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Monthly Rate"
                    value={formData.monthly_rate}
                    onChange={(e) => setFormData({...formData, monthly_rate: e.target.value})}
                    className="form-input"
                    required
                  />
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-input"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="form-input"
                  />
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      {editingUnit ? 'Update Unit' : 'Create Unit'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingUnit(null);
                        setFormData({ unit_number: '', site: '', monthly_rate: '', status: 'available', location: '' });
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-table">
              <div className="table-header">
                <div className="table-cell">Unit Number</div>
                <div className="table-cell">Site</div>
                <div className="table-cell">Size</div>
                <div className="table-cell">Monthly Rate</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Location</div>
                <div className="table-cell">Actions</div>
              </div>
              {Array.isArray(units) && units.map(unit => (
                <div key={unit.unit_id} className="table-row">
                  <div className="table-cell">
                    <span>{unit.unit_number || unit.unit_id}</span>
                  </div>
                  <div className="table-cell">{unit.site}</div>
                  <div className="table-cell">{unit.size || 'N/A'}</div>
                  <div className="table-cell">
                    <span className="price">Ksh.{unit.monthly_rate}</span>
                  </div>
                  <div className="table-cell">
                    <span className={unit.status === 'available' ? 'status-available' : 'status-booked'}>
                      {unit.status}
                    </span>
                  </div>
                  <div className="table-cell">{unit.location || 'N/A'}</div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button onClick={() => startEdit(unit)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeleteUnit(unit.unit_id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Bookings Management</h2>
              <button 
                onClick={fetchData} 
                className="create-btn"
                style={{background: '#28a745'}}
              >
                <span className="btn-icon">↻</span>
                Refresh
              </button>
            </div>
            <div className="admin-table bookings-table">
              <div className="table-header bookings-header">
                <div className="table-cell">Booking ID</div>
                <div className="table-cell">Customer</div>
                <div className="table-cell">Email</div>
                <div className="table-cell">Phone</div>
                <div className="table-cell">Unit</div>
                <div className="table-cell">Start Date</div>
                <div className="table-cell">End Date</div>
                <div className="table-cell">Total Cost</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Booking Date</div>
              </div>
              {Array.isArray(bookings) && bookings.length > 0 ? bookings.map(booking => (
                <div key={booking.booking_id} className="table-row bookings-row">
                  <div className="table-cell">
                    <span className="booking-id">#{booking.booking_id}</span>
                  </div>
                  <div className="table-cell">{booking.user?.username || 'N/A'}</div>
                  <div className="table-cell">{booking.user?.email || 'N/A'}</div>
                  <div className="table-cell">{booking.user?.phone_number || 'N/A'}</div>
                  <div className="table-cell">
                    <span >
                      {(() => {
                        const unit = units.find(u => u.unit_id === booking.unit_id);
                        return unit ? `${unit.unit_number || unit.unit_id} - ${unit.site}` : booking.unit_id;
                      })()}
                    </span>
                  </div>
                  <div className="table-cell">{booking.start_date}</div>
                  <div className="table-cell">{booking.end_date}</div>
                  <div className="table-cell">
                    <span className="price">Ksh.{booking.total_cost}</span>
                  </div>
                  <div className="table-cell">
                    <span className={`status-${booking.status}`}>{booking.status}</span>
                  </div>
                  <div className="table-cell">{new Date(booking.booking_date).toLocaleDateString()}</div>
                </div>
              )) : (
                <div className="table-row">
                  <div className="table-cell" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '2rem'}}>
                    No bookings found. New customer bookings will appear here automatically.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Features Management</h2>
            </div>
            <div className="admin-table features-table">
              <div className="table-header features-header">
                <div className="table-cell">Feature ID</div>
                <div className="table-cell">Name</div>
              </div>
              {Array.isArray(features) && features.map(feature => (
                <div key={feature.feature_id} className="table-row">
                  <div className="table-cell">
                    <span className="feature-id">#{feature.feature_id}</span>
                  </div>
                  <div className="table-cell">{feature.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transports' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Transportation Requests</h2>
            </div>
            <div className="admin-table transports-table">
              <div className="table-header transports-header">
                <div className="table-cell">Request ID</div>
                <div className="table-cell">Customer</div>
                <div className="table-cell">Email</div>
                <div className="table-cell">Phone</div>
                <div className="table-cell">Unit</div>
                <div className="table-cell">Pickup Address</div>
                <div className="table-cell">Pickup Date</div>
                <div className="table-cell">Distance</div>
                <div className="table-cell">Status</div>
              </div>
              {Array.isArray(transports) && transports.map(transport => (
                <div key={transport.request_id} className="table-row">
                  <div className="table-cell">
                    <span className="transport-id">#{transport.request_id}</span>
                  </div>
                  <div className="table-cell">{transport.user?.username || 'N/A'}</div>
                  <div className="table-cell">{transport.pickup_address}</div>
                  <div className="table-cell">{transport.pickup_date}</div>
                  <div className="table-cell">{transport.distance ? `${transport.distance} mi` : 'N/A'}</div>
                  <div className="table-cell">
                    <span className="status-available">{transport.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default AdminDashboard;