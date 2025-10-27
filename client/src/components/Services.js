import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <div className="services-header">
        <div className="services-badge">Our Services</div>
        <h1 className="services-title">Everything You Need, All in One Place</h1>
        <p className="services-subtitle">
          Our comprehensive platform offers a complete storage management experience with 
          cutting-edge technology and user-friendly features
        </p>
      </div>

      <div className="services-grid">
        <div className="service-card">
          <h3 className="service-title">Storage Unit Visualization</h3>
          <p className="service-description">
            View our facility's visual layout with color-coded units 
            showing real-time availability. Easily identify and 
            select your perfect storage space.
          </p>
        </div>

        <div className="service-card">
          <h3 className="service-title">Online Booking System</h3>
          <p className="service-description">
            Reserve your storage unit online in minutes. Select 
            your preferred unit, specify duration, and secure 
            your space instantly.
          </p>
        </div>

        <div className="service-card">
          <h3 className="service-title">Secure Payment Integration</h3>
          <p className="service-description">
            Pay with confidence using multiple payment 
            methods including cards, mobile money, and 
            PayPal. All transactions are encrypted and secure.
          </p>
        </div>

        <div className="service-card">
          <h3 className="service-title">Transportation Scheduling</h3>
          <p className="service-description">
            Schedule pickup and delivery services directly 
            through our platform. We handle the logistics, 
            you enjoy the convenience.
          </p>
        </div>

        <div className="service-card">
          <h3 className="service-title">Admin Management System</h3>
          <p className="service-description">
            Secure admin-only access for managing storage units, 
            bookings, and system operations. Users can browse and 
            book units without needing to create accounts.
          </p>
        </div>

        <div className="service-card">
          <h3 className="service-title">Real-Time Availability</h3>
          <p className="service-description">
            Our system automatically updates unit status 
            in real-time, ensuring you always have 
            accurate availability information at your fingertips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;