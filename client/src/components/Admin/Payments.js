import React, { useState, useEffect } from "react";
import "./Payments.css";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("All Payments");
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [paymentsData, setPaymentsData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPayments = async () => {
    try {
      const [paymentsRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5001/api/payments'),
        fetch('http://localhost:5001/api/bookings')
      ]);
      
      if (paymentsRes.ok && bookingsRes.ok) {
        const payments = await paymentsRes.json();
        const bookings = await bookingsRes.json();
        setPaymentsData(payments);
        setBookingsData(bookings);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (bookingId) => {
    const booking = bookingsData.find(b => b.booking_id === bookingId);
    return booking?.customer_name || 'N/A';
  };

  const getCustomerEmail = (bookingId) => {
    const booking = bookingsData.find(b => b.booking_id === bookingId);
    return booking?.customer_email || 'N/A';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatStatus = (status) => {
    if (status === 'completed') return 'Paid';
    if (status === 'pending') return 'Pending';
    if (status === 'failed') return 'Overdue';
    return status;
  };

  const transformedPayments = paymentsData.map(payment => {
    const customerName = getCustomerName(payment.booking_id);
    return {
      id: `#PAY-${payment.payment_id}`,
      customer: customerName,
      email: getCustomerEmail(payment.booking_id),
      initials: getInitials(customerName),
      amount: `KSh ${parseFloat(payment.amount).toLocaleString()}`,
      method: payment.payment_method || 'N/A',
      date: formatDate(payment.payment_date),
      status: formatStatus(payment.status),
      receipt: payment.mpesa_receipt_number,
      phone: payment.phone_number
    };
  });

  const totalRevenue = paymentsData
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const paidCount = paymentsData.filter(p => p.status === 'completed').length;

  const pendingAmount = paymentsData
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const pendingCount = paymentsData.filter(p => p.status === 'pending').length;

  const overdueAmount = paymentsData
    .filter(p => p.status === 'failed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const overdueCount = paymentsData.filter(p => p.status === 'failed').length;

  useEffect(() => {
    if (activeTab === "All Payments") {
      setFilteredData(transformedPayments);
    } else {
      setFilteredData(
        transformedPayments.filter(
          (payment) => payment.status.toLowerCase() === activeTab.toLowerCase()
        )
      );
    }
  }, [activeTab, paymentsData, bookingsData]);

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
    if (window.confirm('Are you sure you want to delete this payment?')) {
      setPaymentsData(paymentsData.filter(payment => `#PAY-${payment.payment_id}` !== paymentId));
    }
  };

  if (loading) {
    return <div style={{padding: '2rem', textAlign: 'center'}}>Loading payments...</div>;
  }

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
          <button className="record-btn" onClick={() => setShowForm(!showForm)}>+ Record Payment</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h4>Total Revenue</h4>
          <p className="amount">KSh {totalRevenue.toLocaleString()}</p>
          <span>Completed payments</span>
        </div>
        <div className="card">
          <h4>Paid Invoices</h4>
          <p className="amount">{paidCount}</p>
          <span>Completed transactions</span>
        </div>
        <div className="card">
          <h4>Pending Payments</h4>
          <p className="amount">KSh {pendingAmount.toLocaleString()}</p>
          <span>{pendingCount} invoices</span>
        </div>
        <div className="card">
          <h4>Overdue</h4>
          <p className="amount">KSh {overdueAmount.toLocaleString()}</p>
          <span>{overdueCount} invoices</span>
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                  No payments found
                </td>
              </tr>
            ) : (
              filteredData.map((payment, index) => (
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
            ))
            )}
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