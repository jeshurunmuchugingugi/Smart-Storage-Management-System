import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '@iconify/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import Customers from './Customers';
import Payments from './Payments';
import Reservations from './Reservations';
import UnitsTab from './UnitTab';
import Reports from './Reports';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, admin } = useAuth();
  const isManager = admin?.role === 'manager';
  const [activeTab, setActiveTab] = useState(isManager ? 'reports' : 'dashboard');
  const [units, setUnits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    try {
      const [unitsRes, bookingsRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5001/api/units'),
        fetch('http://localhost:5001/api/bookings'),
        fetch('http://localhost:5001/api/payments')
      ]);
      
      if (unitsRes.ok) setUnits(await unitsRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) return;
    try {
      const response = await fetch(`http://localhost:5001/api/units/${unitId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
        alert('Unit deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete unit:', error);
    }
  };

  useEffect(() => {
    fetchData();
    let interval;
    if (activeTab === 'reports' || activeTab === 'payments' || activeTab === 'customers') {
      interval = setInterval(fetchData, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  const totalUnits = units.length;
  const availableUnits = units.filter(u => u.status === 'available').length;
  const occupiedUnits = units.filter(u => u.status === 'booked').length;
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const [occupancyHistory, setOccupancyHistory] = useState([]);

  useEffect(() => {
    const currentAvailable = units.filter(u => u.status === 'available').length;
    const now = new Date();
    const currentHour = now.getHours();
    
    // Only update every 4 hours (0, 4, 8, 12, 16, 20)
    if (currentHour % 4 === 0 && now.getMinutes() < 5) {
      const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      setOccupancyHistory(prev => {
        const lastEntry = prev[prev.length - 1];
        if (!lastEntry || lastEntry.time !== timestamp) {
          const newHistory = [...prev, { time: timestamp, available: currentAvailable }];
          return newHistory.slice(-6); // Keep last 6 data points (24 hours)
        }
        return prev;
      });
    }
  }, [units]);

  const revenueData = payments
    .filter(p => p.status === 'completed' && p.payment_date)
    .reduce((acc, p) => {
      const date = new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short' });
      const existing = acc.find(item => item.month === date);
      if (existing) {
        existing.value += parseFloat(p.amount || 0);
      } else {
        acc.push({ month: date, value: parseFloat(p.amount || 0) });
      }
      return acc;
    }, []);

  const bookingsOverTime = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 19 },
    { month: 'Mar', value: 25 },
    { month: 'Apr', value: 34 },
    { month: 'May', value: 45 },
    { month: 'Jun', value: 58 },
    { month: 'Jul', value: 73 },
    { month: 'Aug', value: 89 },
    { month: 'Sep', value: 96 }
  ];

  const paymentMethodData = payments.reduce((acc, p) => {
    const method = p.payment_method || 'Unknown';
    const existing = acc.find(item => item.category === method);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ category: method, value: 1 });
    }
    return acc;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <h2>STORELINK<br />LOGISTICS</h2>
        </div>
        <nav className="nav-menu">
          {!isManager && (
            <>
              <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <Icon icon="mdi:home" style={{fontSize: '18px'}} />
                <span>Dashboard</span>
              </div>
              <div className={`nav-item ${activeTab === 'units' ? 'active' : ''}`} onClick={() => setActiveTab('units')}>
                <Icon icon="mdi:package-variant" style={{fontSize: '18px'}} />
                <span>Units / Storage</span>
              </div>
              <div className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>
                <Icon icon="mdi:calendar" style={{fontSize: '18px'}} />
                <span>Reservations</span>
              </div>
            </>
          )}
          <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <Icon icon="mdi:chart-bar" style={{fontSize: '18px'}} />
            <span>{isManager ? 'Analytics' : 'Reports'}</span>
          </div>
          <div className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
            <Icon icon="mdi:credit-card" style={{fontSize: '18px'}} />
            <span>Payments</span>
          </div>
          <div className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <Icon icon="mdi:account-group" style={{fontSize: '18px'}} />
            <span>Customers</span>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <header className="top-bar">
          <div className="search-container">
            <Icon icon="mdi:magnify" style={{fontSize: '18px'}} className="search-icon" />
            <input type="search" placeholder="Search..." className="search-box" />
          </div>
          <div className="user-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <Icon icon="mdi:logout" style={{fontSize: '18px', marginRight: '8px'}} />
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'customers' ? (
            <Customers />
          ) : activeTab === 'payments' ? (
            <Payments />
          ) : activeTab === 'reservations' ? (
            <Reservations />
          ) : activeTab === 'units' ? (
            <UnitsTab units={units} fetchData={fetchData} handleDeleteUnit={handleDeleteUnit} />
          ) : activeTab === 'reports' ? (
            <Reports units={units} bookings={bookings} payments={payments} />
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{totalUnits}</div>
                  <div className="stat-label">Total Units</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{availableUnits}</div>
                  <div className="stat-label">Units Available</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{occupiedUnits}</div>
                  <div className="stat-label">Occupied Units</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">KSh {pendingPayments.toLocaleString()}</div>
                  <div className="stat-label">Pending Payments</div>
                </div>
              </div>

              <div className="content-grid">
                <div className="card reservations-card">
                  <h3 className="card-title">Pending Payments</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Unit Size</th>
                        <th>Start Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.filter(b => b.status === 'pending').slice(0, 3).map((booking, idx) => (
                        <tr key={idx}>
                          <td>{booking.customer_name || 'N/A'}</td>
                          <td>{units.find(u => u.unit_id === booking.unit_id)?.size || 'N/A'} m²</td>
                          <td>{new Date(booking.start_date).toLocaleDateString()}</td>
                          <td>KSh {booking.total_cost?.toLocaleString() || '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card chart-card">
                  <h3 className="card-title">Available Units - Real-time</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[
                        { name: 'Available', value: availableUnits },
                        { name: 'Occupied', value: occupiedUnits }
                      ]}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px'
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                          <Cell fill="#10b981" />
                          <Cell fill="#FC9E3B" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bottom-grid">
                <div className="card activity-card">
                  <h3 className="card-title">Recent Activity</h3>
                  <ul className="activity-list">
                    <li>{bookings.filter(b => b.status === 'pending').length} pending bookings</li>
                    <li>{bookings.length} Total bookings</li>
                    <li>{payments.filter(p => p.status === 'failed').length} Failed payments</li>
                  </ul>
                </div>

                <div className="card payment-card">
                  <h3 className="card-title">Customers by Payment Method</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart 
                        data={payments.reduce((acc, p) => {
                          const method = p.payment_method || 'Unknown';
                          const existing = acc.find(item => item.name === method);
                          if (existing) {
                            existing.customers += 1;
                          } else {
                            acc.push({ name: method, customers: 1 });
                          }
                          return acc;
                        }, [])}
                        layout="vertical"
                      >
                        <XAxis type="number" axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px'
                          }}
                          formatter={(value) => [`${value} customers`, 'Count']}
                        />
                        <Bar dataKey="customers" radius={[0, 8, 8, 0]} isAnimationActive={false}>
                          <Cell fill="#FC9E3B" />
                          <Cell fill="#1A2637" />
                          <Cell fill="#10b981" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card size-card">
                  <h3 className="card-title">Booked Units Trend</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={bookingsOverTime}>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false}
                          interval={2}
                          tick={{fontSize: 12}}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px'
                          }}
                          labelStyle={{ color: '#1f2937', fontWeight: 600 }}
                          itemStyle={{ color: '#FC9E3B' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#FC9E3B" 
                          strokeWidth={3} 
                          dot={{ fill: '#FC9E3B', r: 5 }}
                          activeDot={{ r: 7 }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #FDF8F3;
        }

        .sidebar {
          width: 250px;
          background: #1A2637;
          color: white;
          padding: 0;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 10;
        }

        .logo {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: 0.5px;
        }

        .nav-menu {
          padding: 20px 0;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: #FC9E3B;
          color: white;
          border-right: 3px solid #F4A261;
        }

        .main-content {
          flex: 1;
          margin-left: 250px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-bar {
          background: transparent;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #9ca3af;
          z-index: 1;
        }

        .search-box {
          width: 300px;
          padding: 10px 12px 10px 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          outline: none;
        }

        .user-actions {
          display: flex;
          align-items: center;
        }

        .logout-btn {
          background: #FC9E3B;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #F4A261;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(252, 158, 59, 0.3);
        }

        .dashboard-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 30px 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #FC9E3B;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1f2937;
        }

        .chart-container {
          margin-top: 10px;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .activity-list, .payment-list {
          list-style: none;
          font-size: 14px;
          color: #4b5563;
          margin: 0;
          padding: 0;
        }

        .activity-list li, .payment-list li {
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .activity-list li:last-child, .payment-list li:last-child {
          border-bottom: none;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .data-table th {
          text-align: left;
          padding: 12px 0;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #f3f4f6;
        }

        .data-table td {
          padding: 12px 0;
          border-bottom: 1px solid #f9fafb;
          color: #374151;
        }

        .data-table tr:hover {
          background: #f9fafb;
        }

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
          
          .main-content {
            margin-left: 60px;
          }
          
          .nav-item span {
            display: none;
          }
          
          .logo h2 {
            font-size: 10px;
          }
        }

        /* Units Tab Styles */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }

        .create-btn {
          background: #FC9E3B;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .create-btn:hover {
          background: #F4A261;
        }

        .btn-icon {
          font-size: 18px;
        }

        .form-container {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .admin-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .admin-form input,
        .admin-form select {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .admin-form input:focus,
        .admin-form select:focus {
          border-color: #FC9E3B;
        }

        .form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 8px;
        }

        .save-btn,
        .cancel-btn {
          padding: 10px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .save-btn {
          background: #FC9E3B;
          color: white;
        }

        .save-btn:hover {
          background: #F4A261;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .admin-table {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
          gap: 16px;
          padding: 16px 24px;
          align-items: center;
        }

        .table-header {
          background: #f9fafb;
          font-weight: 600;
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-row {
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #374151;
          transition: background 0.2s;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .table-cell {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .edit-btn,
        .delete-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          margin-right: 8px;
          transition: all 0.2s;
        }

        .edit-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .edit-btn:hover {
          background: #e5e7eb;
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fecaca;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;