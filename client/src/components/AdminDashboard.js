import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [units, setUnits] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [unitsRes, reservationsRes] = await Promise.all([
        fetch('/api/units', { headers }),
        fetch('/api/bookings', { headers })
      ]);

      const unitsData = await unitsRes.json();
      const reservationsData = await reservationsRes.json();

      setUnits(unitsData);
      setReservations(reservationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    onLogout();
  };

  // Calculate statistics
  const totalUnits = units.length;
  const availableUnits = units.filter(u => u.status === 'available').length;
  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
  const pendingPayments = reservations
    .filter(r => r.payment_status === 'pending')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  // Get recent reservations
  const recentReservations = reservations.slice(0, 3);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>STORELINK<br/>LOGISTICS</h2>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
             Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'units' ? 'active' : ''}`}
            onClick={() => setActiveTab('units')}
          >
             Units / Storage
          </button>
          <button 
            className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
             Reservations
          </button>
          <button 
            className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
             Payments
          </button>
          <button 
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
             Customers
          </button>
          <button className="nav-item">
             Reports
          </button>
          <button className="nav-item">
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <input type="search" placeholder="Search..." className="search-box" />
          <div className="user-actions">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn" onClick={handleLogout}>👤</button>
          </div>
        </header>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-content">
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Units</div>
                    <div className="stat-value">{totalUnits}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Units Available</div>
                    <div className="stat-value">{availableUnits}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Occupied Units</div>
                    <div className="stat-value">{occupiedUnits}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Pending Payments</div>
                    <div className="stat-value">KSh {pendingPayments.toLocaleString()}</div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="content-grid">
                  {/* Reservations Table */}
                  <div className="card reservations-card">
                    <h3 className="card-title">Reservations</h3>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Unit Size</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReservations.map((res, index) => (
                          <tr key={res.booking_id || index}>
                            <td>{res.customer_name || 'N/A'}</td>
                            <td>{res.unit_size || 'N/A'} m²</td>
                            <td>{res.start_date ? new Date(res.start_date).toLocaleDateString() : 'N/A'}</td>
                            <td>{res.end_date ? new Date(res.end_date).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Unit Occupancy Chart Placeholder */}
                  <div className="card chart-card">
                    <h3 className="card-title">Unit Occupancy Chart</h3>
                    <div className="chart-placeholder">
                      <p>Chart visualization would go here</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Grid */}
                <div className="bottom-grid">
                  <div className="card activity-card">
                    <h3 className="card-title">Recent Activity</h3>
                    <ul className="activity-list">
                      <li>• 2 pending pickup requests</li>
                      <li>• 5 New Customers</li>
                      <li>• 3 Overdue payments</li>
                    </ul>
                  </div>

                  <div className="card payment-card">
                    <h3 className="card-title">Revenue By Payment Method</h3>
                    <ul className="payment-list">
                      <li>• M-pesa</li>
                      <li>• Card</li>
                    </ul>
                  </div>

                  <div className="card size-card">
                    <h3 className="card-title">Units by Size Category</h3>
                    <div className="chart-placeholder small">
                      <p>Bar chart placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Units/Storage View */}
            {activeTab === 'units' && (
              <div className="page-content">
                <h2>Units / Storage</h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Unit Number</th>
                        <th>Site</th>
                        <th>Size (m²)</th>
                        <th>Monthly Rate</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {units.map(unit => (
                        <tr key={unit.unit_id}>
                          <td>{unit.unit_number}</td>
                          <td>{unit.site}</td>
                          <td>{unit.size}</td>
                          <td>KSh {unit.monthly_rate?.toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${unit.status}`}>
                              {unit.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs can be added similarly */}
            {activeTab === 'reservations' && (
              <div className="page-content">
                <h2>Reservations</h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Unit</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(res => (
                        <tr key={res.booking_id}>
                          <td>{res.customer_name}</td>
                          <td>{res.unit_number}</td>
                          <td>{new Date(res.start_date).toLocaleDateString()}</td>
                          <td>{new Date(res.end_date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${res.status}`}>
                              {res.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #e8d4d4;
        }

        /* Sidebar */
        .sidebar {
          width: 200px;
          background: #1a3a52;
          color: white;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
        }

        .logo h2 {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 32px;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          background: none;
          border: none;
          color: #a8b8c8;
          padding: 12px 16px;
          text-align: left;
          cursor: pointer;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .icon {
          font-size: 16px;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-bar {
          background: rgba(255, 255, 255, 0.5);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .search-box {
          width: 300px;
          padding: 8px 16px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          background: white;
          font-size: 14px;
        }

        .user-actions {
          display: flex;
          gap: 12px;
        }

        .icon-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .icon-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        /* Dashboard Content */
        .dashboard-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-label {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: #1a3a52;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1a3a52;
        }

        .reservations-card {
          grid-column: 1;
        }

        .chart-card {
          grid-column: 2;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .chart-placeholder {
          height: 200px;
          background: #f5f5f5;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .chart-placeholder.small {
          height: 120px;
        }

        .activity-list, .payment-list {
          list-style: none;
          font-size: 14px;
          color: #666;
        }

        .activity-list li, .payment-list li {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .activity-list li:last-child, .payment-list li:last-child {
          border-bottom: none;
        }

        /* Tables */
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .data-table th {
          text-align: left;
          padding: 12px;
          background: #f8f9fa;
          font-weight: 600;
          color: #666;
          border-bottom: 2px solid #e9ecef;
        }

        .data-table td {
          padding: 12px;
          border-bottom: 1px solid #e9ecef;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        /* Page Content */
        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .page-content h2 {
          margin-bottom: 24px;
          color: #1a3a52;
        }

        .table-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.available {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.occupied {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.confirmed {
          background: #d1ecf1;
          color: #0c5460;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 18px;
          color: #666;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 60px;
          }
          
          .logo h2 {
            font-size: 10px;
          }
          
          .nav-item {
            justify-content: center;
            padding: 12px 8px;
          }
          
          .nav-item span:not(.icon) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;