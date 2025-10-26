import React from 'react';
import './About.css';
const About = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Secure Storage Solutions</h1>
        <p style={styles.heroSubtitle}>
          Modern, convenient, and reliable storage for all your needs
        </p>
      </div>

      {/* About Section */}
      <div style={styles.aboutSection}>
        <div style={styles.aboutContent}>
          <div style={styles.textContent}>
            <div style={styles.badge}>About us</div>
            <h2 style={styles.sectionTitle}>Your Trusted Storage Partner</h2>
            
            <p style={styles.paragraph}>
              We are committed to providing top-tier storage solutions that combine 
              security, convenience, and affordability. Our state-of-the-art facility is 
              designed to give you peace of mind while storing your valuable belongings.
            </p>
            
            <p style={styles.paragraph}>
              With our comprehensive digital platform, managing your storage has 
              never been easier. From real-time unit availability to seamless booking 
              and payment, we've streamlined every step of the storage experience.
            </p>
            
            <p style={styles.paragraph}>
              Whether you need short-term storage during a move or long-term 
              solutions for your business, our flexible options and professional service 
              ensure your items are always safe and accessible when you need them.
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