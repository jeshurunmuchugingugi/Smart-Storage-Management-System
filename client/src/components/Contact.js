import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Header from './Header';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: 'mdi:phone',
      title: 'Phone',
      details: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM'
    },
    {
      icon: 'mdi:email',
      title: 'Email',
      details: 'support@smartstorage.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: 'mdi:map-marker',
      title: 'Address',
      details: '123 Storage Street',
      subtitle: 'New York, NY 10001'
    }
  ];

  return (
    <>
    <Header/>
    <div className="contactPage">
      <div className="contactContainer">
        <div className="contactHeader">
          <h1 className="contactTitle">
            Contact <span className="titleAccent">Us</span>
          </h1>
          <p className="contactSubtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contactInfoGrid">
          {contactInfo.map((info, index) => (
            <div key={index} className="contactInfoCard">
              <div className="contactIcon">
                <Icon icon={info.icon} />
              </div>
              <h3 className="contactInfoTitle">{info.title}</h3>
              <p className="contactInfoDetails">{info.details}</p>
              <p className="contactInfoSubtitle">{info.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="contactFormSection">
          <h2 className="sectionTitle">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contactForm">
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="name" className="formLabel">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="formInput"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="email" className="formLabel">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="formInput"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            <div className="formGroup">
              <label htmlFor="subject" className="formLabel">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="formInput"
                placeholder="How can we help?"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="message" className="formLabel">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="formTextarea"
                rows="6"
                placeholder="Tell us more about your inquiry..."
                required
              ></textarea>
            </div>
            <button type="submit" className="submitButton">
              <Icon icon="mdi:send" className="buttonIcon" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;