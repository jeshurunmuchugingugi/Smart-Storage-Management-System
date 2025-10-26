import React from 'react';
import './About.css';
const About = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Smart Storage Management System</h1>
        <p style={styles.heroSubtitle}>
          Intelligent, automated, and secure storage solutions for the modern world
        </p>
      </div>

      {/* About Section */}
      <div style={styles.aboutSection}>
        <div style={styles.aboutContent}>
          <div style={styles.textContent}>
            <div style={styles.badge}>About us</div>
            <h2 style={styles.sectionTitle}>Smart Storage, Smarter Solutions</h2>
            
            <p style={styles.paragraph}>
              Our Smart Storage Management System revolutionizes how you store and manage 
              your belongings. Using cutting-edge technology and intelligent automation, 
              we provide secure, efficient, and user-friendly storage solutions.
            </p>
            
            <p style={styles.paragraph}>
              Experience seamless storage management with real-time monitoring, automated 
              inventory tracking, and instant access control. Our digital-first approach 
              ensures you have complete visibility and control over your stored items.
            </p>
            
            <p style={styles.paragraph}>
              From personal belongings to business inventory, our smart system adapts 
              to your needs with flexible storage options, climate control, and 24/7 
              security monitoring for ultimate peace of mind.
            </p>
          </div>
          
          <div style={styles.imageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" 
              alt="Storage facility" 
              style={styles.aboutImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;