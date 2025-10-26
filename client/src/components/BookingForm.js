// src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!unit) return <div style={styles.error}>Unit not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Book Storage Unit</h2>
        <div style={styles.unitInfo}>
          <h3>{unit.unit_number} - {unit.site}</h3>
          <p>Monthly Rate: ${unit.monthly_rate}</p>
          <p>Location: {unit.location}</p>
          <div style={styles.features}>
            {unit.features && unit.features.map(feature => (
              <span key={feature.feature_id} style={styles.featureTag}>
                {feature.name}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>User ID:</label>
            <input
              type="number"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Date:</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Estimated Total Cost:</label>
            <input
              type="number"
              name="total_cost"
              value={calculateTotalCost()}
              style={styles.input}
              readOnly
            />
          </div>

          <div style={styles.sectionTitle}>Transportation Details (Optional)</div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pickup Address:</label>
            <textarea
              name="pickup_address"
              value={formData.pickup_address}
              onChange={handleChange}
              style={styles.textarea}
              rows="3"
              placeholder="Enter your pickup address"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pickup Date:</label>
              <input
                type="date"
                name="pickup_date"
                value={formData.pickup_date}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Pickup Time:</label>
              <input
                type="time"
                name="pickup_time"
                value={formData.pickup_time}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Distance (miles):</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              style={styles.input}
              step="0.1"
              placeholder="Optional"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Special Instructions:</label>
            <textarea
              name="special_instructions"
              value={formData.special_instructions}
              onChange={handleChange}
              style={styles.textarea}
              rows="3"
              placeholder="Any special instructions for pickup"
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  formContainer: {
    background: 'white',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#333',
    textAlign: 'center',
  },
  unitInfo: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '5px',
    marginBottom: '2rem',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  featureTag: {
    background: '#e9ecef',
    color: '#495057',
    padding: '0.25rem 0.5rem',
    borderRadius: '15px',
    fontSize: '0.75rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: '1rem 0',
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    paddingBottom: '0.5rem',
  },
  submitButton: {
    background: '#667eea',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background 0.2s',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: 'red',
    fontSize: '1.2rem',
  },
};

export default BookingForm;