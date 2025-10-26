import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="content">
          {/* Company Info */}
          <div className="section">
            <h3 className="logo">LOGISTICS & STORAGE</h3>
            <p className="description">
              Secure Storage Solutions & Transport Services
            </p>
            <p className="contact">
              Call us: +2547 123-4567
            </p>
          </div>

          {/* Services */}
          <div className="section">
            <h4 className="section-title">Services</h4>
            <ul className="link-list">
              <li><a href="/storage" className="link">Storage Units</a></li>
              <li><a href="/transport" className="link">Transportation</a></li>
              <li><a href="/rent" className="link">Unit Rental</a></li>
              <li><a href="/services" className="link">All Services</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="section">
            <h4 className="section-title">Quick Links</h4>
            <ul className="link-list">
              <li><a href="/about" className="link">About Us</a></li>
              <li><a href="/bookings" className="link">My Bookings</a></li>
              <li><a href="/contact" className="link">Contact</a></li>
              <li><a href="/support" className="link">Support</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="section">
            <h4 className="section-title">Stay In Touch</h4>
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12h24z"/>
                </svg>
                Facebook
              </a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"/>
                </svg>
                Instagram
              </a>
              <a href="https://youtube.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12l9.5 3.6L15.8 12z"/>
                </svg>
                YouTube
              </a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.6c-.9.4-1.8.7-2.8.8 1-.6 1.8-1.6 2.2-2.7z"/>
                </svg>
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bottom-bar">
          <p className="copyright">
            Copyright © 2025 Logistics & Storage. All rights reserved.
          </p>
          <div className="bottom-links">
            <a href="/privacy" className="bottom-link">Privacy</a>
            <a href="/terms" className="bottom-link">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};



export default Footer;