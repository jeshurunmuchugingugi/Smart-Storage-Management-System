import React, { useState, useEffect } from 'react';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }

        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete customer');
      }

      // Remove customer from state
      setCustomers(customers.filter(customer => customer.customer_id !== customerId));
      alert('Customer deleted successfully');
    } catch (err) {
      alert(`Error deleting customer: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="customers-page">
        <div className="loading">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customers-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="customers-page">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1>Customer Management</h1>
            <p>View and manage all your customers</p>
          </div>
        </div>

        {/* All Customers Card */}
        <div className="summary-card">
          <h3>All Customers ({customers.length})</h3>
          <p>Complete list of registered customers with detailed information.</p>
        </div>

        {/* Customer Directory Table */}
        <div className="table-container">
          <h3>Customer Directory</h3>
          <div className="table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>NATIONAL ID</th>
                  <th>ADDRESS</th>
                  <th>CITY</th>
                  <th>POSTAL CODE</th>
                  <th>ACTIVE BOOKINGS</th>
                  <th>COMPLETED BOOKINGS</th>
                  <th>JOIN DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>
                      <div className="customer-info">
                        <div className="avatar">
                          {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="customer-name">{customer.name}</div>
                          <div className="customer-id">#{customer.customer_id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.national_id || 'N/A'}</td>
                    <td>{customer.address || 'N/A'}</td>
                    <td>{customer.city || 'N/A'}</td>
                    <td>{customer.postal_code || 'N/A'}</td>
                    <td>
                      <span className="badge active-bookings">
                        {customer.active_bookings_count || 0}
                      </span>
                    </td>
                    <td>
                      <span className="badge completed-bookings">
                        {customer.completed_bookings_count || 0}
                      </span>
                    </td>
                    <td>{new Date(customer.created_at).toLocaleDateString('en-GB')}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCustomer(customer.customer_id)}
                        disabled={(customer.active_bookings_count || 0) > 0}
                        title={(customer.active_bookings_count || 0) > 0 ? 'Cannot delete customer with active bookings' : 'Delete customer'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default Customers;