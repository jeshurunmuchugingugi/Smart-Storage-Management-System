import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="hero">
        <h1 className="hero-title">Smart Storage Management System</h1>
        <p className="hero-subtitle">
          Intelligent, automated, and secure storage solutions for the modern world
        </p>
      </div>

      <div className="about-section">
        <div className="about-content">
          <div className="text-content">
            <div className="badge">About us</div>
            <h2 className="section-title">Smart Storage, Smarter Solutions</h2>
            
            <p className="paragraph">
              Our Smart Storage Management System revolutionizes how you store and manage 
              your belongings. Using cutting-edge technology and intelligent automation, 
              we provide secure, efficient, and user-friendly storage solutions.
            </p>
            
            <p className="paragraph">
              Experience seamless storage management with real-time monitoring, automated 
              inventory tracking, and instant access control. Our digital-first approach 
              ensures you have complete visibility and control over your stored items.
            </p>
            
            <p className="paragraph">
              From personal belongings to business inventory, our smart system adapts 
              to your needs with flexible storage options, climate control, and 24/7 
              security monitoring for ultimate peace of mind.
            </p>
          </div>
          
          <div className="image-container">
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" 
              alt="Storage facility" 
              className="about-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;