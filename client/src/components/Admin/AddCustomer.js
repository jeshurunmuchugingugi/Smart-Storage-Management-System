import React, { useState } from "react";
import "./AddCustomer.css";

const AddCustomer = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    city: "",
    postalCode: "",
    unit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    alert("Customer added successfully!");
  };

  return (
    <div className="add-customer-container">
      <div className="add-customer-card">
        <h2 className="form-title">Add New Customer</h2>
        <p className="form-subtitle">Register a new customer in the system</p>

        <form className="customer-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name <span>*</span></label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g., John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name <span>*</span></label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g., Kamau"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address <span>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="customer@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number <span>*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="+254 722 123 456"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>National ID Number</label>
            <input
              type="text"
              name="idNumber"
              placeholder="e.g., 12345678"
              value={formData.idNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="e.g., Kilimani, Nairobi"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g., Nairobi"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                placeholder="e.g., 00100"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Assign Unit (Optional)</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option>No unit assigned</option>
              <option>A-101 (15m²)</option>
              <option>A-102 (10m²)</option>
              <option>B-205 (24m²)</option>
              <option>C-301 (20m²)</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
