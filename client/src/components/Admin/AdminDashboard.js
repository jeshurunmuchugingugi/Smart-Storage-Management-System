import React, { useState, useEffect } from 'react';
import { Search, User, Home, Package, Calendar, CreditCard, Users, FileText, Settings } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import Customers from './Customers';
import Payments from './Payments';
import Reservations from './Reservations';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const occupancyData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Apr', value: 61 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 67 },
    { month: 'Jul', value: 73 },
    { month: 'Aug', value: 69 },
    { month: 'Sep', value: 76 }
  ];

  const sizeData = [
    { category: 'Small', value: 45 },
    { category: 'Medium', value: 67 },
    { category: 'Large', value: 32 }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <h2>STORELINK<br />LOGISTICS</h2>
        </div>
        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Home size={18} />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => setActiveTab('units')}>
            <Package size={18} />
            <span>Units / Storage</span>
          </div>
          <div className="nav-item" onClick={() => setActiveTab('reservations')}>
            <Calendar size={18} />
            <span>Reservations</span>
          </div>
          <div className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
            <CreditCard size={18} />
            <span>Payments</span>
          </div>
          <div className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <Users size={18} />
            <span>Customers</span>
          </div>
          <div className="nav-item" onClick={() => setActiveTab('reports')}>
            <FileText size={18} />
            <span>Reports</span>
          </div>
          <div className="nav-item" onClick={() => setActiveTab('settings')}>
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <header className="top-bar">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input type="search" placeholder="Search..." className="search-box" />
          </div>
          <div className="user-actions">
            <button className="user-btn" onClick={handleLogout}>
              <User size={20} />
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
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">128</div>
                  <div className="stat-label">Total Units</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">32</div>
                  <div className="stat-label">Units Available</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">96</div>
                  <div className="stat-label">Occupied Units</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">KSh 128,000</div>
                  <div className="stat-label">Pending Payments</div>
                </div>
              </div>

              <div className="content-grid">
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
                      <tr>
                        <td>John Kamau</td>
                        <td>15 m²</td>
                        <td>25 Oct 2025</td>
                        <td>30 Dec 2025</td>
                      </tr>
                      <tr>
                        <td>Ann Stephanie</td>
                        <td>36 m²</td>
                        <td>12 Nov 2025</td>
                        <td>30 Oct 2026</td>
                      </tr>
                      <tr>
                        <td>Martha Moraa</td>
                        <td>24 m²</td>
                        <td>18 Oct 2025</td>
                        <td>28 Jan 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card chart-card">
                  <h3 className="card-title">Unit Occupancy Chart</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={occupancyData}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Line type="monotone" dataKey="value" stroke="#8B0000" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bottom-grid">
                <div className="card activity-card">
                  <h3 className="card-title">Recent Activity</h3>
                  <ul className="activity-list">
                    <li>2 pending pickup requests</li>
                    <li>5 New Customers</li>
                    <li>3 Overdue payments</li>
                  </ul>
                </div>

                <div className="card payment-card">
                  <h3 className="card-title">Revenue by Payment Method</h3>
                  <ul className="payment-list">
                    <li>M-pesa</li>
                    <li>Card</li>
                  </ul>
                </div>

                <div className="card size-card">
                  <h3 className="card-title">Units by Size Category</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={sizeData}>
                        <XAxis dataKey="category" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Bar dataKey="value" fill="#8B0000" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f6f0ef;
        }

        .sidebar {
          width: 250px;
          background: #1e3a8a;
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
          background: #8B0000;
          color: white;
          border-right: 3px solid #DC2626;
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

        .user-btn {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s;
        }

        .user-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
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
          color: #8B0000;
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
      `}</style>
    </div>
  );
};

export default AdminDashboard;