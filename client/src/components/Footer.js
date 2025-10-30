import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-column company-info">
            <h3 className="company-name">CONTACT US</h3>
            <p className="company-description">
              We offer clean, secure, and private self-storage spaces of all sizes to residential and business customers.We can pick up your items for convinience
            </p>
            <p className="company-tagline">
              Westlands Common House off Waiyaki Way Nairobi, Kenya
              Tel: +254 704 333777
              Email: info@storagecentral-kenya.com
            </p>
          </div>

          {/* Shop Column */}
          <div className="footer-column">
            <h4 className="column-title">Services</h4>
            <ul className="footer-links">
              <li><a href="#storage">Storage Units</a></li>
              <li><a href="#transport">Transportation</a></li>
              <li><a href="#rent">Rent a Unit</a></li>
              <li><a href="#services">All Services</a></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h4 className="column-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#bookings">My Bookings</a></li>
              <li><a href="#calculator">Space Calculator</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="/admin/login">Admin Portal</a></li>
              <li><a href="/manager/login">Manager Portal</a></li>
            </ul>
          </div>

          {/* Social media */}
          <div className="footer-column">
            <h4 className="column-title">Stay In Touch</h4>
            <ul className="footer-links">
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#youtube">YouTube</a></li>
              <li><a href="#spotify">Spotify</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            Copyright © 2025. storelink logistics. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;