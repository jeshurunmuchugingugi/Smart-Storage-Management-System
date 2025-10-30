import React from 'react';
import { Icon } from '@iconify/react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: 'mdi:view-grid-outline',
      title: 'Storage Unit Visualization',
      description: 'View our facility\'s visual layout with color-coded units showing real-time availability. Easily identify and select your perfect storage space.'
    },
    {
      icon: 'mdi:calendar-check',
      title: 'Online Booking System',
      description: 'Reserve your storage unit online in minutes. Select your preferred unit, specify duration, and secure your space instantly.'
    },
    {
      icon: 'mdi:shield-check',
      title: 'Secure Payment Integration',
      description: 'Pay with confidence using multiple payment methods including cards, mobile money, and PayPal. All transactions are encrypted and secure.'
    },
    {
      icon: 'mdi:truck-fast',
      title: 'Transportation Scheduling',
      description: 'Schedule pickup and delivery services directly through our platform. We handle the logistics, you enjoy the convenience.'
    },
    {
      icon: 'mdi:account-cog',
      title: 'Admin Management System',
      description: 'Secure admin-only access for managing storage units, bookings, and system operations. Users can browse and book units without needing to create accounts.'
    },
    {
      icon: 'mdi:clock-fast',
      title: 'Real-Time Availability',
      description: 'Our system automatically updates unit status in real-time, ensuring you always have accurate availability information at your fingertips.'
    }
  ];

  return (
    <section className="servicesSection">
      <div className="servicesContainer">
        <div className="servicesHeader">
          <h2 className="servicesTitle">
            Our <span className="titleAccent">Services</span>
          </h2>
          <p className="servicesSubtitle">
            Everything you need for secure, convenient storage management in one comprehensive platform
          </p>
        </div>

        <div className="servicesGrid">
          {services.map((service, index) => (
            <div key={index} className="serviceCard">
              <div className="serviceIconWrapper">
                <Icon icon={service.icon} className="serviceIcon" />
              </div>
              <h3 className="serviceTitle">{service.title}</h3>
              <p className="serviceDescription">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;