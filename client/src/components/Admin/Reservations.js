import React, { useState, useEffect } from "react";
import "./Reservations.css";

const Reservations = () => {
  const [reservationsData, setReservationsData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5001/api/bookings'),
        fetch('http://localhost:5001/api/payments')
      ]);
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setReservationsData(bookingsData);
      }
      
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (booking) => {
    const today = new Date();
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    
    if (booking.status === 'cancelled') return 'Cancelled';
    if (booking.status === 'completed') return 'Expired';
    if (today < startDate) return 'Upcoming';
    if (today >= startDate && today <= endDate) return 'Active';
    if (endDate - today < 7 * 24 * 60 * 60 * 1000) return 'Expiring';
    return 'Active';
  };

  const activeCount = reservationsData.filter(r => getStatusLabel(r) === 'Active').length;
  const upcomingCount = reservationsData.filter(r => getStatusLabel(r) === 'Upcoming').length;
  const expiringCount = reservationsData.filter(r => {
    const endDate = new Date(r.end_date);
    const today = new Date();
    const daysUntilExpiry = (endDate - today) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  }).length;
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const filteredReservations = activeTab === "All"
    ? reservationsData
    : reservationsData.filter(r => getStatusLabel(r).toLowerCase() === activeTab.toLowerCase());

  if (loading) {
    return <div className="reservations-page"><p>Loading reservations...</p></div>;
  }

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <h2>Reservations Management</h2>
        <p>Manage bookings and unit assignments</p>
      </div>

      <div className="reservations-summary">
        <div className="summary-card">
          <h4>Active Reservations</h4>
          <p className="number">{activeCount}</p>
          <span>Currently ongoing</span>
        </div>
        <div className="summary-card">
          <h4>Upcoming</h4>
          <p className="number">{upcomingCount}</p>
          <span>Starting soon</span>
        </div>
        <div className="summary-card">
          <h4>Expiring Soon</h4>
          <p className="number">{expiringCount}</p>
          <span>Within 7 days</span>
        </div>
        <div className="summary-card">
          <h4>Total Revenue</h4>
          <p className="number revenue">KSh {totalRevenue.toLocaleString()}</p>
          <span>From reservations</span>
        </div>
      </div>

      <div className="reservations-controls">
        <div className="tabs">
          {["All", "Active", "Upcoming", "Expiring", "Expired"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="actions">
          <button className="new-btn">+ New Reservation</button>
        </div>
      </div>

      <div className="reservations-table">
        <table>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Customer</th>
              <th>Unit</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res.booking_id}>
                <td>#{res.booking_id}</td>
                <td>{res.customer_name || 'N/A'}</td>
                <td>{res.unit?.unit_number || 'N/A'}</td>
                <td>{new Date(res.start_date).toLocaleDateString()}</td>
                <td>{new Date(res.end_date).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${getStatusLabel(res).toLowerCase()}`}>
                    {getStatusLabel(res)}
                  </span>
                </td>
                <td>KSh {parseFloat(res.total_cost || 0).toLocaleString()}</td>
                <td>
                  <button className="view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservations;
