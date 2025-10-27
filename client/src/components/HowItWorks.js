import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">
      <div className="container">
        <div className="badge">HOW IT WORKS</div>
        <h2 className="title">
          How Our <span className="accent">Logistics</span> Work
        </h2>
        <p className="subtitle">
          We've made storage and transport effortless. From your doorstep to our
          secure units, here's how we take care of everything for you.
        </p>
        
        <div className="steps-grid">
          <div className="step">
            <div className="step-image">
              <img 
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop" 
                alt="Pick Up" 
                className="image" 
              />
            </div>
            <div className="step-content">
              <div className="step-number">Step 1</div>
              <h3 className="step-title">Pick Up</h3>
              <p className="step-description">
                Enter your pickup location, select a convenient time, and confirm your booking.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-image">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" 
                alt="Transport" 
                className="image" 
              />
            </div>
            <div className="step-content">
              <div className="step-number">Step 2</div>
              <h3 className="step-title">Transport</h3>
              <p className="step-description">
                Enter your pickup location, select a convenient time, and confirm your booking.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-image">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop" 
                alt="Store" 
                className="image" 
              />
            </div>
            <div className="step-content">
              <div className="step-number">Step 3</div>
              <h3 className="step-title">Store</h3>
              <p className="step-description">
                Enter your pickup location, select a convenient time, and confirm your booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;