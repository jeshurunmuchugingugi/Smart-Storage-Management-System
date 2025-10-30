// src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingForm.css';

const BookingForm = ({ units = [] }) => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    user_id: '',
    start_date: '',
    end_date: '',
    total_cost: '',
    pickup_address: '',
    pickup_date: '',
    pickup_time: '',
    distance: '',
    special_instructions: ''
  });

  useEffect(() => {
    fetchUnit();
  }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUnit = async () => {
    try {
      const response = await fetch(`/api/units/${unitId}`);
      const data = await response.json();
      setUnit(data);
      setFormData(prev => ({
        ...prev,
        total_cost: data.monthly_rate
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching unit:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotalCost = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const months = (end - start) / (1000 * 60 * 60 * 24 * 30);
      if (unit && months > 0) {
        return (unit.monthly_rate * months).toFixed(2);
      }
    }
    return unit ? unit.monthly_rate : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalCost = calculateTotalCost();
      
      const bookingData = {
        user_id: parseInt(formData.user_id),
        unit_id: parseInt(unitId),
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_cost: parseFloat(totalCost),
        status: 'pending'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const booking = await response.json();
        alert('Booking created successfully!');
        
        // Create transportation request if pickup details are provided
        if (formData.pickup_address) {
          await fetch('/api/transportation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              booking_id: booking.booking_id,
              user_id: parseInt(formData.user_id),
              pickup_address: formData.pickup_address,
              pickup_date: formData.pickup_date,
              pickup_time: formData.pickup_time,
              distance: formData.distance ? parseFloat(formData.distance) : null,
              special_instructions: formData.special_instructions,
              status: 'pending'
            }),
          });
        }
        
        navigate('/bookings');
      } else {
        const error = await response.json();
        alert(`Error creating booking: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating booking');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!unit) return <div className="error">Unit not found</div>;

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="title">Book Storage Unit</h2>
        <div className="unit-info">
          <h3>{unit.unit_number} - {unit.site}</h3>
          <p>Monthly Rate: ${unit.monthly_rate}</p>
          <p>Location: {unit.location}</p>
          <div className="features">
            {unit.features && unit.features.map(feature => (
              <span key={feature.feature_id} className="feature-tag">
                {feature.name}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">User ID:</label>
            <input
              type="number"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">End Date:</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Estimated Total Cost:</label>
            <input
              type="number"
              name="total_cost"
              value={calculateTotalCost()}
              className="input"
              readOnly
            />
          </div>

          <div className="section-title">Transportation Details (Optional)</div>

          <div className="form-group">
            <label className="label">Pickup Address:</label>
            <textarea
              name="pickup_address"
              value={formData.pickup_address}
              onChange={handleChange}
              className="textarea"
              rows="3"
              placeholder="Enter your pickup address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Pickup Date:</label>
              <input
                type="date"
                name="pickup_date"
                value={formData.pickup_date}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Pickup Time:</label>
              <input
                type="time"
                name="pickup_time"
                value={formData.pickup_time}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Distance (miles):</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className="input"
              step="0.1"
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label className="label">Special Instructions:</label>
            <textarea
              name="special_instructions"
              value={formData.special_instructions}
              onChange={handleChange}
              className="textarea"
              rows="3"
              placeholder="Any special instructions for pickup"
            />
          </div>

          <button type="submit" className="submit-button">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;