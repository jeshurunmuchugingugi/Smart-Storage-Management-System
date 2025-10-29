import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '@iconify/react';

const AdminDashboard = ({ onDataChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [units, setUnits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [features, setFeatures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('units');
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [csrfToken] = useState(() => crypto.randomUUID());
  const [formData, setFormData] = useState({
    unit_number: '',
    site: '',
    size: '',
    monthly_rate: '',
    status: 'available',
    location: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      };

      const [unitsRes, bookingsRes, featuresRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5001/api/units', { headers }).catch(() => ({ ok: false, status: 500 })),
        fetch('http://localhost:5001/api/bookings', { headers }).catch(() => ({ ok: false, status: 500 })),
        fetch('http://localhost:5001/api/features', { headers }).catch(() => ({ ok: false, status: 500 })),
        fetch('http://localhost:5001/api/payments', { headers }).catch(() => ({ ok: false, status: 500 }))
      ]);

      // Check for authentication errors
      if (unitsRes.status === 401 || bookingsRes.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/admin/login');
        return;
      }

      const unitsData = unitsRes.ok ? await unitsRes.json().catch(() => []) : [];
      const bookingsData = bookingsRes.ok ? await bookingsRes.json().catch(() => []) : [];
      const featuresData = featuresRes.ok ? await featuresRes.json().catch(() => []) : [];
      const paymentsData = paymentsRes.ok ? await paymentsRes.json().catch(() => []) : [];

      setUnits(Array.isArray(unitsData) ? unitsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setFeatures(Array.isArray(featuresData) ? featuresData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const deleteUnit = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) return;

    // Validate unitId to prevent SSRF
    if (!unitId || !Number.isInteger(Number(unitId)) || Number(unitId) <= 0) {
      alert('Invalid unit ID');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Authentication required. Please login again.');
        logout();
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/units/${encodeURIComponent(unitId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {
        fetchData();
        onDataChange && onDataChange();
        alert('Unit deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error deleting unit: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      alert('Network error. Please try again.');
    }
  };

  const createUnit = async (data) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Authentication required. Please login again.');
        logout();
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/units', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchData();
        onDataChange && onDataChange();
        setShowCreateForm(false);
        setFormData({
          unit_number: '',
          site: '',
          size: '',
          monthly_rate: '',
          status: 'available',
          location: ''
        });
        alert('Unit created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error creating unit: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating unit:', error);
      alert('Network error. Please try again.');
    }
  };

  const updateUnit = async (unitId, data) => {
    // Validate unitId to prevent SSRF
    if (!unitId || !Number.isInteger(Number(unitId)) || Number(unitId) <= 0) {
      alert('Invalid unit ID');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Authentication required. Please login again.');
        logout();
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/units/${encodeURIComponent(unitId)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchData();
        onDataChange && onDataChange();
        setEditingUnit(null);
        alert('Unit updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error updating unit: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating unit:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit.unit_id);
    setFormData({
      unit_number: unit.unit_number,
      site: unit.site,
      size: unit.size || '',
      monthly_rate: unit.monthly_rate,
      status: unit.status,
      location: unit.location || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUnit) {
      updateUnit(editingUnit, formData);
    } else {
      createUnit(formData);
    }
  };

  const handleCancel = () => {
    setEditingUnit(null);
    setShowCreateForm(false);
    setFormData({
      unit_number: '',
      site: '',
      size: '',
      monthly_rate: '',
      status: 'available',
      location: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPaymentStatus = (bookingId) => {
    const payment = Array.isArray(payments) ? payments.find(p => p.booking_id === bookingId) : null;
    return payment ? payment.status : 'no payment';
  };

  const getStatusStyle = (status) => {
    const statusColors = {
      completed: { backgroundColor: '#dcfce7', color: '#166534' },
      pending: { backgroundColor: '#fef3c7', color: '#d97706' },
      active: { backgroundColor: '#dcfce7', color: '#166534' },
      available: { backgroundColor: '#dcfce7', color: '#166534' },
      booked: { backgroundColor: '#fecaca', color: '#dc2626' },
      maintenance: { backgroundColor: '#fef3c7', color: '#d97706' }
    };
    return statusColors[status] || { backgroundColor: '#fecaca', color: '#dc2626' };
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>STORELINK<br/>LOGISTICS</h2>
        </div>
        <nav style={styles.nav}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{...styles.navItem, ...(activeTab === 'dashboard' ? styles.navItemActive : {})}}
          >
            <Icon icon="mdi:view-dashboard" style={styles.navIcon} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('units')}
            style={{...styles.navItem, ...(activeTab === 'units' ? styles.navItemActive : {})}}
          >
            <Icon icon="mdi:package-variant" style={styles.navIcon} /> Units / Storage
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{...styles.navItem, ...(activeTab === 'bookings' ? styles.navItemActive : {})}}
          >
            <Icon icon="mdi:clipboard-text" style={styles.navIcon} /> Reservations
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            style={{...styles.navItem, ...(activeTab === 'payments' ? styles.navItemActive : {})}}
          >
            <Icon icon="mdi:credit-card" style={styles.navIcon} /> Payments
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            style={styles.navItem}
          >
            <Icon icon="mdi:account-group" style={styles.navIcon} /> Customers
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            style={styles.navItem}
          >
            <Icon icon="mdi:chart-bar" style={styles.navIcon} /> Reports
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            style={styles.navItem}
          >
            <Icon icon="mdi:cog" style={styles.navIcon} /> Settings
          </button>
        </nav>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.topBar}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

      {activeTab === 'dashboard' && (
        <div>
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:package-variant" style={{fontSize: '2rem', color: '#1A3A52'}} />
              </div>
              <div>
                <div style={styles.metricValue}>{units.length}</div>
                <div style={styles.metricLabel}>Total Units</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:check-circle" style={{fontSize: '2rem', color: '#10b981'}} />
              </div>
              <div>
                <div style={styles.metricValue}>{units.filter(u => u.status === 'available').length}</div>
                <div style={styles.metricLabel}>Available Units</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:clipboard-text" style={{fontSize: '2rem', color: '#1A3A52'}} />
              </div>
              <div>
                <div style={styles.metricValue}>{bookings.length}</div>
                <div style={styles.metricLabel}>Total Reservations</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:clock-outline" style={{fontSize: '2rem', color: '#f59e0b'}} />
              </div>
              <div>
                <div style={styles.metricValue}>{bookings.filter(b => b.status === 'pending').length}</div>
                <div style={styles.metricLabel}>Pending Reservations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'units' && (
        <div style={styles.content}>
          <div style={styles.actionBar}>
            <button 
              onClick={() => setShowCreateForm(true)}
              style={styles.createBtn}
            >
              + Add New Unit
            </button>
          </div>

          {(showCreateForm || editingUnit) && (
            <div style={styles.formContainer}>
              <h3>{editingUnit ? 'Edit Unit' : 'Create New Unit'}</h3>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <input
                    type="text"
                    name="unit_number"
                    placeholder="Unit Number"
                    value={formData.unit_number}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    name="site"
                    placeholder="Site"
                    value={formData.site}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formRow}>
                  <input
                    type="number"
                    name="size"
                    placeholder="Size (sq meters)"
                    value={formData.size}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    name="monthly_rate"
                    placeholder="Monthly Rate"
                    value={formData.monthly_rate}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formRow}>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={styles.input}
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location (optional)"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <div style={styles.formActions}>
                  <button type="submit" style={styles.saveBtn}>
                    {editingUnit ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={handleCancel} style={styles.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Unit Number</th>
                  <th style={styles.th}>Site</th>
                  <th style={styles.th}>Size (m²)</th>
                  <th style={styles.th}>Monthly Rate</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.unit_id}>
                    <td style={styles.td}>{unit.unit_number}</td>
                    <td style={styles.td}>{unit.site}</td>
                    <td style={styles.td}>{unit.size || 'N/A'}</td>
                    <td style={styles.td}>Ksh. {unit.monthly_rate}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        ...getStatusStyle(unit.status)
                      }}>
                        {unit.status}
                      </span>
                    </td>
                    <td style={styles.td}>{unit.location || 'N/A'}</td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => handleEdit(unit)}
                          style={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteUnit(unit.unit_id)}
                          style={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div style={styles.content}>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Booking ID</th>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>Start Date</th>
                  <th style={styles.th}>Total Cost</th>
                  <th style={styles.th}>Booking Status</th>
                  <th style={styles.th}>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td style={styles.td}>{booking.booking_id}</td>
                    <td style={styles.td}>{booking.customer_name || 'N/A'}</td>
                    <td style={styles.td}>{booking.customer_email || 'N/A'}</td>
                    <td style={styles.td}>{booking.customer_phone || 'N/A'}</td>
                    <td style={styles.td}>{booking.unit?.unit_number || `Unit ${booking.unit_id}`}</td>
                    <td style={styles.td}>{booking.start_date}</td>
                    <td style={styles.td}>Ksh. {booking.total_cost}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        ...getStatusStyle(booking.status)
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        ...getStatusStyle(getPaymentStatus(booking.booking_id))
                      }}>
                        {getPaymentStatus(booking.booking_id)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#E8E4E1',
    fontFamily: 'Inter, sans-serif'
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#1A3A52',
    color: 'white',
    padding: '2rem 0',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0
  },
  sidebarHeader: {
    padding: '0 1.5rem',
    marginBottom: '3rem'
  },
  sidebarTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    lineHeight: '1.4',
    letterSpacing: '0.5px',
    margin: 0
  },
  nav: {
    display: 'flex',
    flexDirection: 'column'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    fontSize: '0.95rem',
    textAlign: 'left',
    transition: 'all 0.2s'
  },
  navItemActive: {
    backgroundColor: 'rgba(100, 80, 150, 0.25)',
    color: 'white'
  },
  navIcon: {
    fontSize: '1.1rem',
    width: '20px'
  },
  mainContent: {
    marginLeft: '220px',
    flex: 1,
    padding: '2rem'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '2rem'
  },

  logoutBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#1A3A52',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151'
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #f3f4f6'
  },
  status: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  deleteBtn: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    marginLeft: '0.5rem'
  },
  actionBar: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  createBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  formContainer: {
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  form: {
    marginTop: '1rem'
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  formActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  saveBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  editBtn: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.25rem'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.25rem'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  metricIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1A3A52',
    marginBottom: '0.25rem'
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  }
};

export default AdminDashboard;