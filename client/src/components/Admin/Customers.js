import React, { useState } from 'react';
import './Customers.css';
import AddCustomer from './AddCustomer';

const Customers = () => {
  const [viewMode, setViewMode] = useState('Grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      name: 'John Kamau',
      email: 'john.kamau@email.com',
      phone: '+254 722 123 456',
      nationalId: '12345678',
      address: 'Kilimani, Nairobi',
      city: 'Nairobi',
      postalCode: '00100',
      type: 'Individual',
      unit: 'A-101 (15m²)',
      status: 'Active',
      joinDate: '15 Jan 2025',
      initials: 'JK'
    },
    {
      id: 'CUST-002',
      name: 'Ann Stephanie',
      email: 'ann.stephanie@email.com',
      phone: '+254 733 987 854',
      nationalId: '23456789',
      address: 'Westlands, Nairobi',
      city: 'Nairobi',
      postalCode: '00600',
      type: 'Business',
      unit: 'B-205 (24m²)',
      status: 'Active',
      joinDate: '22 Jan 2025',
      initials: 'AS'
    },
    {
      id: 'CUST-003',
      name: 'Martha Moraa',
      email: 'martha.moraa@email.com',
      phone: '+254 711 458 789',
      nationalId: '34567890',
      address: 'Karen, Nairobi',
      city: 'Nairobi',
      postalCode: '00200',
      type: 'Individual',
      unit: 'A-103 (12m²)',
      status: 'Active',
      joinDate: '10 Feb 2025',
      initials: 'MM'
    },
    {
      id: 'CUST-004',
      name: 'David Kimani',
      email: 'david.kimani@email.com',
      phone: '+254 700 555 123',
      nationalId: '45678901',
      address: 'Parklands, Nairobi',
      city: 'Nairobi',
      postalCode: '00300',
      type: 'Business',
      unit: 'C-301 (20m²)',
      status: 'Active',
      joinDate: '05 Mar 2025',
      initials: 'DK'
    },
    {
      id: 'CUST-005',
      name: 'Grace Wanjiku',
      email: 'grace.wanjiku@email.com',
      phone: '+254 745 888 998',
      nationalId: '56789012',
      address: 'Lavington, Nairobi',
      city: 'Nairobi',
      postalCode: '00100',
      type: 'Individual',
      unit: 'A-102 (10m²)',
      status: 'Active',
      joinDate: '18 Mar 2025',
      initials: 'GW'
    }
  ]);

  const addCustomer = (customerData) => {
    const newCustomer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      name: `${customerData.firstName} ${customerData.lastName}`,
      email: customerData.email,
      phone: customerData.phone,
      nationalId: customerData.idNumber,
      address: customerData.address,
      city: customerData.city,
      postalCode: customerData.postalCode,
      type: 'Individual',
      unit: customerData.unit || 'No unit assigned',
      status: 'Active',
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      initials: `${customerData.firstName.charAt(0)}${customerData.lastName.charAt(0)}`
    };
    setCustomers([...customers, newCustomer]);
    setShowAddForm(false);
  };

  if (showAddForm) {
    return <AddCustomer onCancel={() => setShowAddForm(false)} onSubmit={addCustomer} />;
  }

  return (
    <div className="customers-page">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1>Customer Management</h1>
            <p>View and manage all your customers</p>
          </div>
          <div className="header-right">
            <input type="text" placeholder="Search..." className="search-input" />
            <div className="view-toggle">
              <button 
                className={viewMode === 'Grid' ? 'active' : ''}
                onClick={() => setViewMode('Grid')}
              >
                Grid
              </button>
              <button 
                className={viewMode === 'List' ? 'active' : ''}
                onClick={() => setViewMode('List')}
              >
                List
              </button>
            </div>
            <button className="add-customer-btn" onClick={() => setShowAddForm(true)}>+ Add Customer</button>
          </div>
        </div>

        {/* All Customers Card */}
        <div className="summary-card">
          <h3>All Customers</h3>
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
                  <th>TYPE</th>
                  <th>UNIT</th>
                  <th>STATUS</th>
                  <th>JOIN DATE</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-info">
                        <div className="avatar">{customer.initials}</div>
                        <div>
                          <div className="customer-name">{customer.name}</div>
                          <div className="customer-id">#{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.nationalId}</td>
                    <td>{customer.address}</td>
                    <td>{customer.city}</td>
                    <td>{customer.postalCode}</td>
                    <td>
                      <span className={`badge type-${customer.type.toLowerCase()}`}>
                        {customer.type}
                      </span>
                    </td>
                    <td>
                      <span className="badge unit">{customer.unit}</span>
                    </td>
                    <td>
                      <span className="badge status-active">{customer.status}</span>
                    </td>
                    <td>{customer.joinDate}</td>
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