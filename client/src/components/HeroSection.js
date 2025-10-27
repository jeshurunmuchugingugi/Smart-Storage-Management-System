// src/components/HeroSection.js
import React from 'react';
import { Icon } from '@iconify/react';

const HeroSection = () => {
  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        <div style={styles.leftColumn}>
          <h1 style={styles.headline}>
            Smart, Secure, And <em style={styles.effortless}>Effortless</em> Storage
          </h1>
          <p style={styles.subtext}>
            Our Smart Quote System Instantly Calculates Transport Costs And Storage Size Once You Enter Your Pickup Location — No Calls, No Guesswork, Just Instant Pricing.
          </p>
          <div style={styles.buttonGroup}>
            <button style={styles.primaryButton}>
              <Icon icon="mdi:key" style={styles.buttonIcon} />
              Rent A Unit
            </button>
            <button style={styles.secondaryButton}>
              <Icon icon="mdi:truck" style={styles.buttonIcon} />
              Book Transport
            </button>
          </div>
        </div>
        
        <div style={styles.rightColumn}>
          <div style={styles.imageWrapper}>
            <img 
              src="https://cdn.sanity.io/images/0flxhg4o/production/20c04c47efdec4dc0bf397e3912382fe2e4ffd5a-3246x2160.jpg?w=3840&h=2160&q=70&fit=crop&crop=center&auto=format" 
              alt="Storage facility corridor with orange doors"
              style={styles.heroImage}
            />
            
            <div style={{...styles.badge, ...styles.badge1}}>
              <Icon icon="mdi:shield-check" style={styles.badgeIcon} />
              <div>
                <div style={styles.badgeTitle}>24/7</div>
                <div style={styles.badgeSubtitle}>Security</div>
              </div>
            </div>
            
            <div style={{...styles.badge, ...styles.badge2}}>
              <Icon icon="mdi:lock" style={styles.badgeIcon} />
              <div>
                <div style={styles.badgeTitle}>Insured</div>
                <div style={styles.badgeSubtitle}>Storage</div>
              </div>
            </div>
            
            <div style={{...styles.badge, ...styles.badge3}}>
              <Icon icon="mdi:message-fast" style={styles.badgeIcon} />
              <div>
                <div style={styles.badgeTitle}>Fast</div>
                <div style={styles.badgeSubtitle}>Response</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    backgroundColor: '#FDF8F3',
    padding: '0 0 2.5rem 0',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '1.5rem',
    alignItems: 'center',
  },
  leftColumn: {
      position:'relative',
    top:'500',
    marginTop:'0',
    maxWidth: '650px',
    paddingRight: '1.5rem',
  },
  headline: {
    fontSize: '4.5rem',
    fontWeight: '400',
    lineHeight: '1.2',
    color: '#1A2637',
    margin: '-2.7rem 0 1.5rem 0',
    fontFamily: '"Roboto", sans-serif',
    letterSpacing: '-0.02em',
    textAlign: 'left',
  },
  effortless: {
    fontStyle: 'italic',
    color: '#1A2637',
    textDecorationColor: '#FC9E3B',  
    textUnderlineOffset: '9px',
    textDecorationThickness: '3px',
    fontWeight: '300',
    textDecoration:'underline'
  },

  subtext: {
    fontSize: '1.25rem',
    lineHeight: '2',
    color: '#555555',
    marginBottom: '2rem',
    fontFamily: '"Roboto", sans-serif',
    textAlign: 'left',
    width:'39rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FC9E3B',
    color: 'white',
    border: 'none',
    padding: '1.5rem 2rem',
    borderRadius: '0px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: '"Roboto", sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#1A2637',
    border: '2px solid #1a26377a',
    padding: '1.5rem 2rem',
    borderRadius: '0px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: '"Roboto", sans-serif',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 4px 15px rgba(26, 38, 55, 0.1)',
  },
  buttonIcon: {
    fontSize: '1.3rem',
  },
  rightColumn: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  heroImage: {
    width: '550px',
    height: '440px',
    objectFit: 'cover',
    borderRadius: '22px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
  },
  badge: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '14px',
    padding: '1.5rem 0.25rem 1.5rem 0.5rem',
    boxShadow: '0 0 20px rgba(244, 163, 97, 0.72), 0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '120px',
  },
  badge1: {
    top: '-40px',
    right: '450px',
    zIndex: 2,
  },
  badge2: {
    right: '-70px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  badge3: {
    bottom: '-30px',
    left: '-35px',
    zIndex: 1,
  },
  badgeIcon: {
    fontSize: '1.75rem',
    color: '#F4A261',
  },
  badgeTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: '1.2',
  },
  badgeSubtitle: {
    fontSize: '0.875rem',
    color: '#555555',
    lineHeight: '1.2',
  },
};

export default HeroSection;