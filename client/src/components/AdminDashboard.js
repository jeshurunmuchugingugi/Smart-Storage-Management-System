import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '@iconify/react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const [lastUpdated, setLastUpdated] = useState(null);
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
    
    // Auto-refresh every 5 seconds for payments and reports tabs
    let interval;
    if (activeTab === 'payments' || activeTab === 'reports') {
      interval = setInterval(() => {
        fetchData();
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

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
      setLastUpdated(new Date());
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
      paid: { backgroundColor: '#d1fae5', color: '#065f46' },
      pending: { backgroundColor: '#fef3c7', color: '#d97706' },
      active: { backgroundColor: '#dcfce7', color: '#166534' },
      available: { backgroundColor: '#dcfce7', color: '#166534' },
      booked: { backgroundColor: '#fecaca', color: '#dc2626' },
      maintenance: { backgroundColor: '#fef3c7', color: '#d97706' },
      failed: { backgroundColor: '#fee2e2', color: '#991b1b' }
    };
    return statusColors[status] || { backgroundColor: '#fecaca', color: '#dc2626' };
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  // Chart data helper functions
  const getRevenueData = () => {
    const revenueByDate = {};
    payments.forEach(payment => {
      if (payment.payment_date) {
        const date = new Date(payment.payment_date).toLocaleDateString();
        revenueByDate[date] = (revenueByDate[date] || 0) + parseFloat(payment.amount || 0);
      }
    });
    return Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue: parseFloat(revenue.toFixed(2))
    })).slice(-7); // Last 7 days
  };

  const getBookingStatusData = () => {
    const statusCount = {};
    bookings.forEach(booking => {
      statusCount[booking.status] = (statusCount[booking.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const getPaymentMethodsData = () => {
    const methodCount = {};
    payments.forEach(payment => {
      const method = payment.payment_method || 'unknown';
      methodCount[method] = (methodCount[method] || 0) + 1;
    });
    return Object.entries(methodCount).map(([method, count]) => ({ method, count }));
  };

  const getUnitStatusData = () => {
    const statusCount = {};
    units.forEach(unit => {
      statusCount[unit.status] = (statusCount[unit.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const getBookingsOverTime = () => {
    const bookingsByDate = {};
    bookings.forEach(booking => {
      if (booking.booking_date) {
        const date = new Date(booking.booking_date).toLocaleDateString();
        bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
      }
    });
    return Object.entries(bookingsByDate).map(([date, bookings]) => ({ date, bookings })).slice(-7);
  };

  const getPaymentStatusData = () => {
    const statusData = {};
    payments.forEach(payment => {
      const status = payment.status || 'unknown';
      if (!statusData[status]) {
        statusData[status] = { count: 0, amount: 0 };
      }
      statusData[status].count += 1;
      statusData[status].amount += parseFloat(payment.amount || 0);
    });
    return Object.entries(statusData).map(([status, data]) => ({
      status,
      count: data.count,
      amount: parseFloat(data.amount.toFixed(2))
    }));
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const COLORS = ['#FC9E3B', '#1A2637', '#ef4444', '#3b82f6', '#8b5cf6'];
  const UNIT_COLORS = ['#FC9E3B', '#ef4444', '#1A2637'];

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
            style={{...styles.navItem, ...(activeTab === 'reports' ? styles.navItemActive : {})}}
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
            <div style={styles.modalOverlay} onClick={handleCancel}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <div>
                    <h3 style={styles.formTitle}>{editingUnit ? 'Edit Unit' : 'Create New Unit'}</h3>
                    <p style={styles.formSubtitle}>Fill in the details below to {editingUnit ? 'update' : 'add'} a storage unit</p>
                  </div>
                  <button type="button" onClick={handleCancel} style={styles.closeBtn}>
                    <Icon icon="mdi:close" style={{fontSize: '1.5rem'}} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Unit Number *</label>
                    <input
                      type="text"
                    name="unit_number"
                      placeholder="e.g., U-101"
                      value={formData.unit_number}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Site *</label>
                    <input
                      type="text"
                    name="site"
                      placeholder="e.g., Site 1"
                      value={formData.site}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Size (sq meters)</label>
                    <input
                      type="number"
                    name="size"
                      placeholder="e.g., 25"
                      value={formData.size}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Monthly Rate (Ksh) *</label>
                    <input
                      type="number"
                    name="monthly_rate"
                      placeholder="e.g., 5000"
                      value={formData.monthly_rate}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Status *</label>
                    <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                      style={styles.select}
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                    </select>
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                  name="location"
                    placeholder="e.g., Building A, Floor 2"
                    value={formData.location}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
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

      {activeTab === 'reports' && (
        <div style={styles.content}>
          <div style={styles.reportsHeader}>
            <h2 style={styles.reportsTitle}>Analytics & Reports</h2>
            <div style={styles.liveIndicator}>
              <span style={styles.liveDot}></span>
              <span style={styles.liveText}>Real-time Data</span>
              {lastUpdated && (
                <span style={styles.lastUpdate}>
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:currency-usd" style={{fontSize: '2rem', color: '#10b981'}} />
              </div>
              <div>
                <div style={styles.metricValue}>
                  Ksh. {payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toFixed(2)}
                </div>
                <div style={styles.metricLabel}>Total Revenue</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:check-circle" style={{fontSize: '2rem', color: '#10b981'}} />
              </div>
              <div>
                <div style={styles.metricValue}>
                  {payments.filter(p => p.status === 'completed').length}
                </div>
                <div style={styles.metricLabel}>Completed Payments</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:clock-outline" style={{fontSize: '2rem', color: '#f59e0b'}} />
              </div>
              <div>
                <div style={styles.metricValue}>
                  {payments.filter(p => p.status === 'pending').length}
                </div>
                <div style={styles.metricLabel}>Pending Payments</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>
                <Icon icon="mdi:percent" style={{fontSize: '2rem', color: '#1A3A52'}} />
              </div>
              <div>
                <div style={styles.metricValue}>
                  {((units.filter(u => u.status === 'booked').length / units.length) * 100).toFixed(1)}%
                </div>
                <div style={styles.metricLabel}>Occupancy Rate</div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div style={styles.chartsGrid}>
            {/* Revenue Trend */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getRevenueData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Booking Status Distribution */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Booking Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getBookingStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getBookingStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Methods */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Payment Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getPaymentMethodsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1A3A52" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Unit Occupancy */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Unit Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getUnitStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getUnitStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={UNIT_COLORS[index % UNIT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Bookings */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Bookings Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getBookingsOverTime()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#1A3A52" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Status */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Payment Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getPaymentStatusData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#f59e0b" />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div style={styles.content}>
          <div style={styles.paymentHeader}>
            <h2 style={styles.paymentTitle}>Payment Records</h2>
            <div style={styles.liveIndicator}>
              <span style={styles.liveDot}></span>
              <span style={styles.liveText}>Live Updates</span>
              {lastUpdated && (
                <span style={styles.lastUpdate}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Payment ID</th>
                  <th style={styles.th}>Booking ID</th>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Phone Number</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Payment Method</th>
                  <th style={styles.th}>M-Pesa Receipt</th>
                  <th style={styles.th}>Transaction ID</th>
                  <th style={styles.th}>Payment Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={styles.emptyState}>
                      <div style={styles.emptyStateContent}>
                        <Icon icon="mdi:credit-card-off" style={styles.emptyIcon} />
                        <h3 style={styles.emptyTitle}>No Payments Yet</h3>
                        <p style={styles.emptyText}>Payment records will appear here once customers make payments</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const booking = bookings.find(b => b.booking_id === payment.booking_id);
                    return (
                      <tr key={payment.payment_id}>
                        <td style={styles.td}>{payment.payment_id}</td>
                        <td style={styles.td}>{payment.booking_id}</td>
                        <td style={styles.td}>{booking?.customer_name || 'N/A'}</td>
                        <td style={styles.td}>{payment.phone_number || 'N/A'}</td>
                        <td style={styles.td}>Ksh. {payment.amount}</td>
                        <td style={styles.td}>
                          <span style={styles.paymentMethod}>
                            {payment.payment_method || 'N/A'}
                          </span>
                        </td>
                        <td style={styles.td}>{payment.mpesa_receipt_number || 'N/A'}</td>
                        <td style={styles.td}>{payment.transaction_id || 'N/A'}</td>
                        <td style={styles.td}>
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleString() : 'N/A'}
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.status,
                            ...getStatusStyle(payment.status)
                          }}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
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
    backgroundColor: '#1A2637',
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
    backgroundColor: '#FC9E3B',
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
    backgroundColor: '#FC9E3B',
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
    backgroundColor: '#FC9E3B',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'slideIn 0.3s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '2rem 2rem 1rem 2rem',
    borderBottom: '2px solid #FC9E3B'
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    padding: '2rem'
  },
  formRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  input: {
    flex: 1,
    padding: '0.875rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#fafafa'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  saveBtn: {
    padding: '0.875rem 2rem',
    backgroundColor: '#FC9E3B',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(252, 158, 59, 0.3)'
  },
  cancelBtn: {
    padding: '0.875rem 2rem',
    backgroundColor: 'white',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  },

  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1A2637',
    margin: '0 0 0.5rem 0'
  },
  formSubtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  },
  inputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.25rem'
  },
  select: {
    flex: 1,
    padding: '0.875rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#fafafa',
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
    color: '#1A2637',
    marginBottom: '0.25rem'
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  paymentMethod: {
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#FC9E3B'
  },
  paymentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  paymentTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem'
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FC9E3B',
    animation: 'pulse 2s infinite'
  },
  liveText: {
    color: '#FC9E3B',
    fontWeight: '600'
  },
  lastUpdate: {
    color: '#6b7280',
    marginLeft: '0.5rem'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '1.5rem',
    padding: '1.5rem'
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  chartTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem',
    marginTop: 0
  },
  reportsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  reportsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  emptyStateContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  emptyIcon: {
    fontSize: '4rem',
    color: '#d1d5db'
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#4b5563',
    margin: 0
  },
  emptyText: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    margin: 0
  }
};

// Add pulse animation for live indicator
if (!document.getElementById('payment-live-styles')) {
  const style = document.createElement('style');
  style.id = 'payment-live-styles';
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    input:focus, select:focus {
      outline: none;
      border-color: #FC9E3B !important;
      background-color: white !important;
    }
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
  `;
  document.head.appendChild(style);
}

export default AdminDashboard;