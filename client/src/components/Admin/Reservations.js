import React, { useState } from "react";
import "./Reservations.css";

const Reservations = () => {
  const reservationsData = [
    {
      id: "#RSV-001",
      customer: "John Kamau",
      unit: "Unit A-102",
      startDate: "Jan 15, 2025",
      endDate: "Jul 15, 2025",
      status: "Active",
      amount: "KSh 25,000",
    },
    {
      id: "#RSV-002",
      customer: "Sarah Wanjiku",
      unit: "Unit B-205",
      startDate: "Feb 01, 2025",
      endDate: "Aug 01, 2025",
      status: "Active",
      amount: "KSh 30,000",
    },
    {
      id: "#RSV-003",
      customer: "Peter Omondi",
      unit: "Unit C-301",
      startDate: "Oct 28, 2025",
      endDate: "Apr 28, 2026",
      status: "Upcoming",
      amount: "KSh 20,000",
    },
    {
      id: "#RSV-004",
      customer: "Mary Akinyi",
      unit: "Unit A-115",
      startDate: "Mar 10, 2025",
      endDate: "Sep 10, 2025",
      status: "Active",
      amount: "KSh 28,500",
    },
    {
      id: "#RSV-005",
      customer: "David Mutua",
      unit: "Unit D-408",
      startDate: "Jan 20, 2025",
      endDate: "Jul 20, 2025",
      status: "Active",
      amount: "KSh 35,000",
    },
  ];

  const [activeTab, setActiveTab] = useState("All");

  const filteredReservations =
    activeTab === "All"
      ? reservationsData
      : reservationsData.filter(
          (r) => r.status.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <h2>Reservations Management</h2>
        <p>Manage bookings and unit assignments</p>
      </div>

      <div className="reservations-summary">
        <div className="summary-card">
          <h4>Active Reservations</h4>
          <p className="number">96</p>
          <span>Currently ongoing</span>
        </div>
        <div className="summary-card">
          <h4>Upcoming</h4>
          <p className="number">15</p>
          <span>Starting soon</span>
        </div>
        <div className="summary-card">
          <h4>Expiring Soon</h4>
          <p className="number">12</p>
          <span>Within 7 days</span>
        </div>
        <div className="summary-card">
          <h4>Monthly Revenue</h4>
          <p className="number revenue">KSh 2.4M</p>
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
          <button className="calendar-btn">📅 Calendar View</button>
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
            {filteredReservations.map((res, index) => (
              <tr key={index}>
                <td>{res.id}</td>
                <td>{res.customer}</td>
                <td>{res.unit}</td>
                <td>{res.startDate}</td>
                <td>{res.endDate}</td>
                <td>
                  <span className={`status ${res.status.toLowerCase()}`}>
                    {res.status}
                  </span>
                </td>
                <td>{res.amount}</td>
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
