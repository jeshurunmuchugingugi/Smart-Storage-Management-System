import React from 'react';
import    './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>
          How Our <span style={styles.accent}>Logistics</span> Work
        </h2>
        <p style={styles.subtitle}>
          We'll come, storage and transport anything from your doorstep to our
          warehouse. Here's how we offer world-class service.
        </p>
        
        <div style={styles.stepsGrid}>
          <div style={styles.step}>
            <div style={styles.stepImage}>
              <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop" alt="Pick Up" style={styles.image} />
            </div>
            <div style={styles.stepContent}>
              <div style={styles.stepIcon}></div>
              <h3 style={styles.stepTitle}>Pick Up</h3>
              <p style={styles.stepDescription}>
                We pick up your belongings, transport to a convenient store, and
                confirm your new booking.
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepImage}>
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" alt="Transport" style={styles.image} />
            </div>
            <div style={styles.stepContent}>
              <div style={styles.stepIcon}></div>
              <h3 style={styles.stepTitle}>Transport</h3>
              <p style={styles.stepDescription}>
                We pick up from your location, deliver to convenient store, and
                confirm your new booking.
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepImage}>
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop" alt="Store" style={styles.image} />
            </div>
            <div style={styles.stepContent}>
              <div style={styles.stepIcon}></div>
              <h3 style={styles.stepTitle}>Store</h3>
              <p style={styles.stepDescription}>
                Enjoy our pickup location, select a convenient store, and
                confirm your new booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;