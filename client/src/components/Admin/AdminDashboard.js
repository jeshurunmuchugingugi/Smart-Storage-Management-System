// src/components/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import UnitsTab from './UnitsTab';

const AdminDashboard = ({ admin, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [features, setFeatures] = useState([]);
  const [transports, setTransports] = useState([]);
  const [units, setUnits] = useState([]);
  const [activeTab, setActiveTab] = useState('units'); // default to units
  const [loading, setLoading] = useState(true);

  // Robust API call with token handling
  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      let response = await fetch(url, { ...options, headers });

      // Token refresh if 401
      if (response.status === 401 && token) {
        try {
          const refreshResponse = await fetch('/api/admin/refresh-token', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (refreshResponse.ok) {
            const { access_token } = await refreshResponse.json();
            localStorage.setItem('admin_token', access_token);
            response = await fetch(url, { ...options, headers: { ...headers, 'Authorization': `Bearer ${access_token}` } });
          }
        } catch {}
      }
      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, featuresRes, transportsRes, unitsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/features'),
        fetch('/api/transportation'),
        fetch('/api/units')
      ]);

      const bookingsData = await bookingsRes.json();
      const featuresData = await featuresRes.json();
      const transportsData = await transportsRes.json();
      const unitsData = await unitsRes.json();

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setFeatures(Array.isArray(featuresData) ? featuresData : []);
      setTransports(Array.isArray(transportsData) ? transportsData : []);
      setUnits(Array.isArray(unitsData) ? unitsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        const response = await apiCall(`/api/units/${unitId}`, { method: 'DELETE' });
        if (response.ok) fetchData();
      } catch (error) {
        console.error('Failed to delete unit:', error);
        alert('Failed to delete unit. Please try again.');
      }
    }
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
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">{admin.username.charAt(0).toUpperCase()}</div>
            <span className="welcome-text">{admin.username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'units' && (
          <UnitsTab
            units={units}
            fetchData={fetchData}
            handleDeleteUnit={handleDeleteUnit}
          />
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Bookings Management</h2>
              <button onClick={fetchData} className="create-btn" style={{background: '#28a745'}}>
                <span className="btn-icon">↻</span> Refresh
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
                  <div className="table-cell">#{booking.booking_id}</div>
                  <div className="table-cell">{booking.user?.username || 'N/A'}</div>
                  <div className="table-cell">{booking.user?.email || 'N/A'}</div>
                  <div className="table-cell">{booking.user?.phone_number || 'N/A'}</div>
                  <div className="table-cell">{booking.unit_id}</div>
                  <div className="table-cell">{booking.start_date}</div>
                  <div className="table-cell">{booking.end_date}</div>
                  <div className="table-cell">{booking.total_cost}</div>
                  <div className="table-cell">{booking.status}</div>
                  <div className="table-cell">{new Date(booking.booking_date).toLocaleDateString()}</div>
                </div>
              )) : (
                <div className="table-row">
                  <div className="table-cell" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '2rem'}}>
                    No bookings found.
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
                  <div className="table-cell">#{feature.feature_id}</div>
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
                  <div className="table-cell">#{transport.request_id}</div>
                  <div className="table-cell">{transport.user?.username || 'N/A'}</div>
                  <div className="table-cell">{transport.pickup_address}</div>
                  <div className="table-cell">{transport.pickup_date}</div>
                  <div className="table-cell">{transport.distance ? `${transport.distance} mi` : 'N/A'}</div>
                  <div className="table-cell">{transport.status}</div>
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
