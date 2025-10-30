import React, { useState, useEffect } from "react";
import "./Payments.css";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("All Payments");
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [paymentsData, setPaymentsData] = useState([
    {
      id: "#INV-001",
      customer: "John Kamau",
      email: "john.kamau@email.com",
      initials: "JK",
      amount: "KSh 15,000",
      method: "M-Pesa",
      date: "18 Oct 2025",
      status: "Paid",
    },
    {
      id: "#INV-002",
      customer: "Ann Stephanie",
      email: "ann.stephanie@email.com",
      initials: "AS",
      amount: "KSh 22,500",
      method: "Card",
      date: "17 Oct 2025",
      status: "Paid",
    },
    {
      id: "#INV-003",
      customer: "Martha Moraa",
      email: "martha.moraa@email.com",
      initials: "MM",
      amount: "KSh 18,000",
      method: "Bank Transfer",
      date: "16 Oct 2025",
      status: "Pending",
    },
    {
      id: "#INV-004",
      customer: "David Kimani",
      email: "david.kimani@email.com",
      initials: "DK",
      amount: "KSh 12,500",
      method: "M-Pesa",
      date: "15 Oct 2025",
      status: "Paid",
    },
    {
      id: "#INV-005",
      customer: "Grace Wanjiku",
      email: "grace.wanjiku@email.com",
      initials: "GW",
      amount: "KSh 14,800",
      method: "M-Pesa",
      date: "14 Oct 2025",
      status: "Pending",
    },
    {
      id: "#INV-006",
      customer: "Peter Marangi",
      email: "peter.marangi@email.com",
      initials: "PM",
      amount: "KSh 25,000",
      method: "Card",
      date: "12 Oct 2025",
      status: "Paid",
    },
    {
      id: "#INV-007",
      customer: "Sarah Ochieng",
      email: "sarah.ochieng@email.com",
      initials: "SO",
      amount: "KSh 16,200",
      method: "Bank Transfer",
      date: "10 Oct 2025",
      status: "Overdue",
    },
    {
      id: "#INV-008",
      customer: "Brian Njoroge",
      email: "brian.njoroge@email.com",
      initials: "BN",
      amount: "KSh 19,500",
      method: "M-Pesa",
      date: "08 Oct 2025",
      status: "Paid",
    },
  ]);

  useEffect(() => {
    if (activeTab === "All Payments") {
      setFilteredData(paymentsData);
    } else {
      setFilteredData(
        paymentsData.filter(
          (payment) => payment.status.toLowerCase() === activeTab.toLowerCase()
        )
      );
    }
  }, [activeTab, paymentsData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerName = formData.get('customer');
    const newPayment = {
      id: `#INV-${String(paymentsData.length + 1).padStart(3, '0')}`,
      customer: customerName,
      email: formData.get('email'),
      initials: customerName.split(' ').map(n => n[0]).join('').toUpperCase(),
      amount: `KSh ${formData.get('amount')}`,
      method: formData.get('method'),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: formData.get('status'),
    };
    setPaymentsData([...paymentsData, newPayment]);
    setShowForm(false);
    e.target.reset();
  };

  const handleDelete = (paymentId) => {
    setPaymentsData(paymentsData.filter(payment => payment.id !== paymentId));
  };

  const renderStatus = (status) => {
    switch (status) {
      case "Paid":
        return <span className="status paid">● Paid</span>;
      case "Pending":
        return <span className="status pending">● Pending</span>;
      case "Overdue":
        return <span className="status overdue">● Overdue</span>;
      default:
        return null;
    }
  };

  return (
    <div className="payments-container">
      <div className="payments-header">
        <div>
          <h2>Payments & Billing</h2>
          <p>Manage all payment transactions and billing</p>
        </div>
        <div className="actions">
          <input type="text" placeholder="Search payments..." />
          <button className="record-btn" onClick={() => setShowForm(!showForm)}>+ Record Payment</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h4>Total Revenue</h4>
          <p className="amount">KSh 2,847,500</p>
          <span>This month</span>
        </div>
        <div className="card">
          <h4>Paid Invoices</h4>
          <p className="amount">156</p>
          <span>Last 30 days</span>
        </div>
        <div className="card">
          <h4>Pending Payments</h4>
          <p className="amount">KSh 128,000</p>
          <span>8 invoices</span>
        </div>
        <div className="card">
          <h4>Overdue</h4>
          <p className="amount">KSh 45,200</p>
          <span>3 invoices</span>
        </div>
      </div>

      {/* Payment Form */}
      {showForm && (
        <div className="payment-form">
          <h3>Record New Payment</h3>
          <form onSubmit={handleFormSubmit}>
            <input type="text" name="customer" placeholder="Customer Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="number" name="amount" placeholder="Amount" required />
            <select name="method" required>
              <option value="">Payment Method</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <select name="status" required>
              <option value="">Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <div className="form-buttons">
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit">Save Payment</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {["All Payments", "Paid", "Pending", "Overdue"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="payments-table">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((payment, index) => (
              <tr key={index}>
                <td>{payment.id}</td>
                <td>
                  <div className="customer-info">
                    <div className="avatar">{payment.initials}</div>
                    <div>
                      <strong>{payment.customer}</strong>
                      <p>{payment.email}</p>
                    </div>
                  </div>
                </td>
                <td>{payment.amount}</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>
                <td>{renderStatus(payment.status)}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(payment.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>Showing 1–8 of 156 payments</span>
          <div className="page-buttons">
            <button>Previous</button>
            {[1, 2, 3, 4, 5, 20].map((n) => (
              <button key={n} className={n === 1 ? "active" : ""}>
                {n}
              </button>
            ))}
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
