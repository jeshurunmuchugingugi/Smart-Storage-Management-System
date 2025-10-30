// src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from './Header';

const BookingForm = ({ units = [] }) => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Customer Details
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    // Booking Details
    start_date: '',
    end_date: '',
    total_cost: '',
    // Transportation Details
    pickup_address: '',
    pickup_date: '',
    pickup_time: '',
    distance: '',
    special_instructions: ''
  });

  useEffect(() => {
    fetchCsrfToken();
    fetchUnit();
  }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/csrf-token', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  const fetchUnit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/units/${unitId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data || !data.unit_id) {
        throw new Error('Invalid unit data received');
      }
      setUnit(data);
      setFormData(prev => ({
        ...prev,
        total_cost: data.monthly_rate
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching unit:', error);
      setUnit(null);
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
    
    // Validate form data
    if (!formData.customer_name.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!formData.customer_email.trim()) {
      alert('Please enter your email address');
      return;
    }
    if (!formData.customer_phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      alert('Please select both start and end dates');
      return;
    }
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      alert('End date must be after start date');
      return;
    }

    setSubmitting(true);
    try {
      const totalCost = calculateTotalCost();
      
      const bookingData = {
        unit_id: parseInt(unitId),
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_cost: parseFloat(totalCost),
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const booking = await response.json();
        
        // Create pending payment record
        try {
          await fetch('http://localhost:5000/api/payments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({
              booking_id: booking.booking_id,
              amount: booking.total_cost,
              payment_method: 'pending',
              status: 'pending'
            }),
          });
        } catch (paymentError) {
          console.warn('Payment record creation failed:', paymentError);
        }
        
        // Create transportation request if pickup details are provided
        if (formData.pickup_address && formData.pickup_address.trim()) {
          try {
            await fetch('http://localhost:5000/api/transportation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
              },
              credentials: 'include',
              body: JSON.stringify({
                booking_id: booking.booking_id,
                customer_name: formData.customer_name.trim(),
                pickup_address: formData.pickup_address.trim(),
                pickup_date: formData.pickup_date,
                pickup_time: formData.pickup_time,
                distance: formData.distance ? parseFloat(formData.distance) : null,
                special_instructions: formData.special_instructions.trim(),
                status: 'pending'
              }),
            });
          } catch (transportError) {
            console.warn('Transportation request failed:', transportError);
            // Continue with booking even if transportation fails
          }
        }
        
        // Show success popup
        setShowSuccessPopup(true);
        
        // Redirect to payment page after 2 seconds
        setTimeout(() => {
          navigate(`/payment/${booking.booking_id}`);
        }, 2000);
      } else {
        let errorMessage = 'Unknown error';
        try {
          const error = await response.json();
          errorMessage = error.error || 'Unknown error';
        } catch {
          errorMessage = `Server error (${response.status}). Please ensure the server is running on port 5000.`;
        }
        alert(`Error creating booking: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading unit details...</p>
        </div>
      </>
    );
  }
  
  if (!unit) {
    return (
      <>
        <Header />
        <div style={styles.errorContainer}>
          <Icon icon="mdi:alert-circle" style={styles.errorIcon} />
          <h2>Unit Not Found</h2>
          <p>The storage unit you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/storage')} style={styles.backButton}>
            Browse Available Units
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {showSuccessPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.successPopup}>
            <div style={styles.successIcon}>
              <Icon icon="mdi:check-circle" style={styles.checkIcon} />
            </div>
            <h3 style={styles.successTitle}>Booking Successful!</h3>
            <p style={styles.successMessage}>
              Your storage unit has been successfully booked. You will be redirected to the payment page shortly.
            </p>
            <div style={styles.loadingDots} className="loadingDots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <span onClick={() => navigate('/storage')} style={styles.breadcrumbLink}>Storage Units</span>
          <Icon icon="mdi:chevron-right" style={styles.breadcrumbIcon} />
          <span>Book Unit {unit.unit_number}</span>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.unitCard}>
            <div style={styles.unitHeader}>
              <div style={styles.unitBadge}>{unit.unit_number}</div>
              <div style={styles.unitStatus}>
                <Icon icon="mdi:check-circle" style={styles.statusIcon} />
                Available
              </div>
            </div>
            
            <div style={styles.unitImage}>
              <img 
                src="https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg" 
                alt="Storage Unit" 
                style={styles.image}
              />
            </div>

            <div style={styles.unitDetails}>
              <h3 style={styles.unitTitle}>Unit Details</h3>
              <div style={styles.detailItem}>
                <Icon icon="mdi:map-marker" style={styles.detailIcon} />
                <span>{unit.location || unit.site}</span>
              </div>
              <div style={styles.detailItem}>
                <Icon icon="mdi:currency-usd" style={styles.detailIcon} />
                <span>Ksh. {unit.monthly_rate}/month</span>
              </div>
              {unit.features && unit.features.length > 0 && (
                <div style={styles.featuresSection}>
                  <h4 style={styles.featuresTitle}>Features</h4>
                  <div style={styles.features}>
                    {unit.features.map(feature => (
                      <div key={feature.feature_id} style={styles.featureItem}>
                        <Icon icon="mdi:check" style={styles.featureIcon} />
                        <span>{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={styles.bookingCard}>
            <div style={styles.bookingHeader}>
              <Icon icon="mdi:calendar-check" style={styles.bookingIcon} />
              <h2 style={styles.bookingTitle}>Complete Your Booking</h2>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <Icon icon="mdi:account" style={styles.sectionIcon} />
                  Personal Information
                </h3>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <Icon icon="mdi:calendar-range" style={styles.sectionIcon} />
                  Rental Period
                </h3>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Start Date *</label>
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
                    <label style={styles.label}>End Date *</label>
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
                <div style={styles.costSummary}>
                  <div style={styles.costItem}>
                    <span>Estimated Total Cost:</span>
                    <span style={styles.costAmount}>Ksh. {calculateTotalCost()}</span>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <Icon icon="mdi:truck" style={styles.sectionIcon} />
                  Transportation Service (Optional)
                </h3>
                <div style={styles.transportInfo}>
                  <Icon icon="mdi:information" style={styles.infoIcon} />
                  <span>We can pick up your items and transport them to the storage unit</span>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Pickup Address</label>
                  <textarea
                    name="pickup_address"
                    value={formData.pickup_address}
                    onChange={handleChange}
                    style={styles.textarea}
                    rows="2"
                    placeholder="Enter your pickup address (optional)"
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Pickup Date</label>
                    <input
                      type="date"
                      name="pickup_date"
                      value={formData.pickup_date}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>{"Pickup Time"}</label>
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
                  <label style={styles.label}>Special Instructions</label>
                  <textarea
                    name="special_instructions"
                    value={formData.special_instructions}
                    onChange={handleChange}
                    style={styles.textarea}
                    rows="2"
                    placeholder="Any special instructions for our team (optional)"
                  />
                </div>
              </div>

              <div style={styles.submitSection}>
                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    ...styles.submitButton,
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? (
                    <>
                      <div style={styles.buttonSpinner}></div>
                      Processing Booking...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:lock" style={styles.submitIcon} />
                      Confirm Booking & Pay
                    </>
                  )}
                </button>
                <p style={styles.submitNote}>
                  By confirming, you agree to our terms and conditions
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    backgroundColor: '#f8fafc'
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  breadcrumbLink: {
    color: '#FC9E3B',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  breadcrumbIcon: {
    margin: '0 0.5rem',
    fontSize: '1rem'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '2rem',
    alignItems: 'start'
  },
  unitCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '2rem'
  },
  unitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem'
  },
  unitBadge: {
    backgroundColor: '#FC9E3B',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1.125rem'
  },
  unitStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#10b981',
    fontWeight: '500'
  },
  statusIcon: {
    fontSize: '1.25rem'
  },
  unitImage: {
    width: '100%',
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  unitDetails: {
    padding: '1.5rem'
  },
  unitTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    color: '#4b5563'
  },
  detailIcon: {
    fontSize: '1.25rem',
    color: '#FC9E3B'
  },
  featuresSection: {
    marginTop: '1.5rem'
  },
  featuresTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.75rem'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  featureIcon: {
    fontSize: '1rem',
    color: '#10b981'
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  bookingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem 2rem 1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  bookingIcon: {
    fontSize: '2rem',
    color: '#FC9E3B'
  },
  bookingTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  form: {
    padding: '2rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  sectionIcon: {
    fontSize: '1.25rem',
    color: '#FC9E3B'
  },
  transportInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    color: '#0369a1'
  },
  infoIcon: {
    fontSize: '1rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  costSummary: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem'
  },
  costItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: '500'
  },
  costAmount: {
    color: '#FC9E3B',
    fontSize: '1.25rem',
    fontWeight: '600'
  },
  submitSection: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '2rem',
    textAlign: 'center'
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    backgroundColor: '#FC9E3B',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(252, 158, 59, 0.3)'
  },
  submitIcon: {
    fontSize: '1.25rem'
  },
  submitNote: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '1rem',
    margin: '1rem 0 0 0'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #FC9E3B',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '1.125rem',
    color: '#6b7280'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '1rem',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '4rem',
    color: '#ef4444'
  },
  backButton: {
    backgroundColor: '#FC9E3B',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  successPopup: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  successIcon: {
    marginBottom: '1rem'
  },
  checkIcon: {
    fontSize: '4rem',
    color: '#10b981'
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  successMessage: {
    color: '#6b7280',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  loadingDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  buttonSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  }
};

// Add CSS animations (only once)
let stylesAdded = false;
if (!stylesAdded) {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loadingDots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #FC9E3B;
      display: inline-block;
      animation: loadingDots 1.4s infinite ease-in-out both;
    }
    
    .loadingDots span:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    .loadingDots span:nth-child(2) {
      animation-delay: -0.16s;
    }
    
    @keyframes loadingDots {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(styleSheet);
  stylesAdded = true;
}

export default BookingForm;