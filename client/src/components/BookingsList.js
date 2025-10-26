// src/components/BookingsList.js
import React, { useState, useEffect } from 'react';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Bookings</h2>
      {bookings.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div style={styles.bookingsGrid}>
          {bookings.map(booking => (
            <div key={booking.booking_id} style={styles.bookingCard}>
              <div style={styles.bookingHeader}>
                <h3>Booking #{booking.booking_id}</h3>
                <span style={{
                  ...styles.status,
                  ...styles[booking.status]
                }}>
                  {booking.status}
                </span>
              </div>
              <div style={styles.bookingDetails}>
                <p><strong>Unit:</strong> {booking.unit?.unit_number}</p>
                <p><strong>Site:</strong> {booking.unit?.site}</p>
                <p><strong>Dates:</strong> {booking.start_date} to {booking.end_date}</p>
                <p><strong>Total Cost:</strong> ${booking.total_cost}</p>
                <p><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#333',
    textAlign: 'center',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  bookingCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '1.5rem',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e0e0e0',
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pending: {
    background: '#fff3cd',
    color: '#856404',
  },
  active: {
    background: '#d1ecf1',
    color: '#0c5460',
  },
  completed: {
    background: '#d4edda',
    color: '#155724',
  },
  cancelled: {
    background: '#f8d7da',
    color: '#721c24',
  },
  bookingDetails: {
    lineHeight: 1.6,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
};

export default BookingsList;