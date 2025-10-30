import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from './Header';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [processing, setProcessing] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking:', error);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (paymentMethod === 'mpesa') {
        if (!phoneNumber || !phoneNumber.trim()) {
          alert('Please enter your M-Pesa phone number');
          setProcessing(false);
          return;
        }

        // Initiate M-Pesa STK Push
        const response = await fetch('http://localhost:5000/api/mpesa/stkpush', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            booking_id: parseInt(bookingId),
            phone_number: phoneNumber,
            amount: booking.total_cost
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert(result.message || 'Please check your phone and enter M-Pesa PIN');
          
          // Poll for payment status
          const checkoutRequestId = result.checkout_request_id;
          let attempts = 0;
          const maxAttempts = 30; // 30 seconds
          
          const pollStatus = setInterval(async () => {
            attempts++;
            
            try {
              const statusResponse = await fetch('http://localhost:5000/api/payments');
              const payments = await statusResponse.json();
              const payment = payments.find(p => p.checkout_request_id === checkoutRequestId);
              
              if (payment && payment.status === 'completed') {
                clearInterval(pollStatus);
                setProcessing(false);
                setShowPaymentSuccess(true);
                setTimeout(() => {
                  navigate('/');
                }, 3000);
              } else if (payment && payment.status === 'failed') {
                clearInterval(pollStatus);
                setProcessing(false);
                alert('Payment failed. Please try again.');
              } else if (attempts >= maxAttempts) {
                clearInterval(pollStatus);
                alert('Payment timeout. Please check your M-Pesa messages.');
                setProcessing(false);
              }
            } catch (error) {
              console.error('Error checking payment status:', error);
            }
          }, 1000); // Check every 1 second for faster detection
        } else {
          alert(result.error || 'Payment failed. Please try again.');
          setProcessing(false);
        }
      } else {
        // Card payment (existing logic)
        const response = await fetch('http://localhost:5000/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            booking_id: parseInt(bookingId),
            amount: booking.total_cost,
            payment_method: paymentMethod,
            status: 'completed'
          }),
        });

        if (response.ok) {
          setShowPaymentSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          alert('Payment failed. Please try again.');
        }
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading payment details...</p>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Header />
        <div style={styles.errorContainer}>
          <Icon icon="mdi:alert-circle" style={styles.errorIcon} />
          <h2>Booking Not Found</h2>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            Go Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {showPaymentSuccess && (
        <div style={styles.popupOverlay}>
          <div style={styles.successPopup}>
            <div style={styles.successIcon}>
              <Icon icon="mdi:check-circle" style={styles.checkIcon} />
            </div>
            <h3 style={styles.successTitle}>Payment Successful!</h3>
            <p style={styles.successMessage}>
              Your payment has been processed successfully. Your booking is now confirmed!
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
        <div style={styles.paymentCard}>
          <div style={styles.header}>
            <Icon icon="mdi:credit-card" style={styles.headerIcon} />
            <h1 style={styles.title}>Complete Payment</h1>
          </div>

          <div style={styles.bookingSummary}>
            <h3 style={styles.summaryTitle}>Booking Summary</h3>
            <div style={styles.summaryItem}>
              <span>Customer:</span>
              <span>{booking.customer_name}</span>
            </div>
            <div style={styles.summaryItem}>
              <span>Unit:</span>
              <span>Unit {booking.unit_id}</span>
            </div>
            <div style={styles.summaryItem}>
              <span>Period:</span>
              <span>{booking.start_date} to {booking.end_date}</span>
            </div>
            <div style={styles.totalAmount}>
              <span>Total Amount:</span>
              <span>Ksh. {booking.total_cost}</span>
            </div>
          </div>

          <div style={styles.paymentMethods}>
            <h3 style={styles.methodsTitle}>Select Payment Method</h3>
            
            {paymentMethod === 'mpesa' && (
              <div style={styles.phoneInputContainer}>
                <label style={styles.phoneLabel}>M-Pesa Phone Number *</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 0712345678 or 254712345678"
                  style={styles.phoneInput}
                />
                <div style={styles.phoneHint}>Enter the phone number registered with M-Pesa</div>
              </div>
            )}
            
            <div style={styles.methodOption}>
              <input
                type="radio"
                id="mpesa"
                name="payment"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.radio}
              />
              <label htmlFor="mpesa" style={styles.methodLabel}>
                <Icon icon="mdi:phone" style={styles.methodIcon} />
                <div>
                  <div style={styles.methodName}>M-PESA</div>
                  <div style={styles.methodDesc}>Lipa Na M-Pesa - STK Push</div>
                </div>
              </label>
            </div>

            <div style={styles.methodOption}>
              <input
                type="radio"
                id="card"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.radio}
              />
              <label htmlFor="card" style={styles.methodLabel}>
                <Icon icon="mdi:credit-card-outline" style={styles.methodIcon} />
                <div>
                  <div style={styles.methodName}>Credit/Debit Card</div>
                  <div style={styles.methodDesc}>Visa, Mastercard accepted</div>
                </div>
              </label>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={processing}
            style={styles.payButton}
          >
            {processing ? (
              <>
                <div style={styles.buttonSpinner}></div>
                Processing...
              </>
            ) : (
              <>
                <Icon icon="mdi:lock" style={styles.buttonIcon} />
                Pay Ksh. {booking.total_cost}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '0 1rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
    backgroundColor: '#FC9E3B',
    color: 'white'
  },
  headerIcon: {
    fontSize: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0
  },
  bookingSummary: {
    padding: '2rem',
    borderBottom: '1px solid #e5e7eb'
  },
  summaryTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    color: '#4b5563'
  },
  totalAmount: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FC9E3B',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  paymentMethods: {
    padding: '2rem'
  },
  methodsTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  methodOption: {
    marginBottom: '1rem'
  },
  radio: {
    display: 'none'
  },
  methodLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  methodIcon: {
    fontSize: '1.5rem',
    color: '#FC9E3B'
  },
  methodName: {
    fontWeight: '500',
    color: '#1f2937'
  },
  methodDesc: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  payButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    backgroundColor: '#FC9E3B',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonIcon: {
    fontSize: '1.25rem'
  },
  buttonSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  phoneInputContainer: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#FFF7ED',
    borderRadius: '8px',
    border: '2px solid #FC9E3B'
  },
  phoneLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  phoneInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  phoneHint: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.5rem'
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
    cursor: 'pointer'
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
  }
};

// Add CSS animations
let paymentStylesAdded = false;
if (!paymentStylesAdded) {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input[type="radio"]:checked + label {
      border-color: #FC9E3B !important;
      background-color: #FFF7ED !important;
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
  paymentStylesAdded = true;
}

export default Payment;