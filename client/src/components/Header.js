// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Header = () => {
  const [hoveredLink, setHoveredLink] = useState(null);


  return (
    <header style={styles.header}>
      <div style={styles.nav}>
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            <div style={styles.logoIcon}>
              <Icon icon="mdi:warehouse" style={styles.warehouseIcon} />
            </div>
            <div style={styles.logoText}>
              <span style={styles.logisticsText}>STORELINK</span>
              <span style={styles.storageText}>LOGISTICS</span>
            </div>
          </Link>
        </div>

        <nav style={styles.centerNav}>
          <Link 
            to="/" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 0 ? styles.navLinkHover : {})
            }}
            onMouseEnter={() => setHoveredLink(0)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 1 ? styles.navLinkHover : {})
            }}
            onMouseEnter={() => setHoveredLink(1)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Services
          </Link>
          <Link 
            to="/storage" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 2 ? styles.navLinkHover : {})
            }}
            onMouseEnter={() => setHoveredLink(2)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Storage
          </Link>
          <Link 
            to="/contact" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 3 ? styles.navLinkHover : {})
            }}
            onMouseEnter={() => setHoveredLink(3)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Contact
          </Link>
          <Link 
            to="/about" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 4 ? styles.navLinkHover : {})
            }}
            onMouseEnter={() => setHoveredLink(4)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            About
          </Link>
        </nav>
        <div style={styles.rightSection}>
          <Link to="/storage" style={styles.rentButton}>
            <Icon icon="mdi:key" style={styles.buttonIcon} />
            Rent A Unit
          </Link>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(26, 38, 55, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    transition: 'transform 0.2s ease',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warehouseIcon: {
    fontSize: '2.5rem',
    color: '#FC9E3B',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.1',
    fontFamily: '"Roboto", sans-serif',
  },
  logisticsText: {
    fontWeight: '700',
    color: '#1A2637',
    fontSize: '1.1rem',
    letterSpacing: '0.5px',
  },
  storageText: {
    color: '#FC9E3B',
    fontSize: '0.8rem',
    letterSpacing: '0.8px',
    fontWeight: '500',
  },
  centerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '3rem',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  dropdown: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(252, 158, 59, 0.2)',
    padding: '1rem 0',
    minWidth: '220px',
    zIndex: 1000,
    marginTop: '0.5rem',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    color: '#1A2637',
    transition: 'all 0.3s ease',
    borderLeft: '3px solid transparent',
  },
  dropdownIcon: {
    fontSize: '1.5rem',
    color: '#FC9E3B',
  },
  dropdownTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1A2637',
    fontFamily: '"Roboto", sans-serif',
  },
  dropdownSubtitle: {
    fontSize: '0.85rem',
    color: '#666',
    fontFamily: '"Roboto", sans-serif',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: '#1A2637',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    fontFamily: '"Roboto", sans-serif',
    position: 'relative',
    padding: '0.5rem 0',
    transition: 'all 0.3s ease',
  },
  navLinkHover: {
    color: '#FC9E3B',
  },

  rentButton: {
    background: '#FC9E3B',
    color: 'white',
    textDecoration: 'none',
    padding: '0.875rem 1.5rem',
    borderRadius: '0px',
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: '"Roboto", sans-serif',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(252, 158, 59, 0.3)',
  },
  buttonIcon: {
    fontSize: '1.1rem',
  },
};

export default Header;