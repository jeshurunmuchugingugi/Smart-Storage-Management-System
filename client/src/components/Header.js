// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.nav}>
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            <div style={styles.logoIcon}>
              <div style={styles.warehouse}>
                <div style={styles.warehouseTop}></div>
                <div style={styles.warehouseBody}>
                  <div style={styles.box}></div>
                  <div style={styles.box}></div>
                  <div style={styles.box}></div>
                </div>
              </div>
            </div>
            <div style={styles.logoText}>
              <span style={styles.logisticsText}>LOGISTICS</span>
              <span style={styles.storageText}>& STORAGE</span>
            </div>
          </Link>
        </div>
        <nav style={styles.centerNav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/services" style={styles.navLink}>Services</Link>
          <Link to="/storage" style={styles.navLink}>Storage</Link>
          <Link to="/contact" style={styles.navLink}>Contact</Link>
        </nav>
        <div style={styles.rightSection}>
          <Link to="/rent" style={styles.rentButton}>Rent A Unit</Link>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warehouse: {
    position: 'relative',
    width: '24px',
    height: '20px',
  },
  warehouseTop: {
    width: '24px',
    height: '6px',
    backgroundColor: '#1e3a8a',
    borderRadius: '2px 2px 0 0',
    position: 'absolute',
    top: '0',
  },
  warehouseBody: {
    width: '24px',
    height: '14px',
    border: '2px solid #1e3a8a',
    borderTop: 'none',
    position: 'absolute',
    top: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '1px',
  },
  box: {
    width: '4px',
    height: '4px',
    backgroundColor: '#1e3a8a',
    borderRadius: '1px',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.1',
    fontFamily: 'Inter, Poppins, Montserrat, sans-serif',
  },
  logisticsText: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    fontSize: '0.875rem',
    letterSpacing: '0.5px',
  },
  storageText: {
    color: '#1e3a8a',
    fontSize: '0.75rem',
    letterSpacing: '0.3px',
  },
  centerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4rem',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  dropdown: {
    position: 'relative',
    cursor: 'pointer',
  },
  rentButton: {
    background: '#FC9E3B',
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'background 0.2s',
  }
};

export default Header;