import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! How can we help you today?', sender: 'support', time: '10:30 AM' }
  ]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: chatMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
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
    <div className="contactPage">
      <div className="contactContainer">
        {/* Header */}
        <div className="contactHeader">
          <h1 className="contactTitle">
            Get In <span className="titleAccent">Touch</span>
          </h1>
          <p className="contactSubtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
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

        {/* Main Content */}
        <div className="contactContent">
          {/* Contact Form */}
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
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submitButton">
                <Icon icon="mdi:send" className="buttonIcon" />
                Send Message
              </button>
            </form>
          </div>

          {/* Chat Section */}
          <div className="chatSection">
            <h2 className="sectionTitle">Live Chat</h2>
            <div className="chatContainer">
              <div className="chatMessages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`chatMessage ${msg.sender}`}>
                    <div className="messageContent">
                      <p className="messageText">{msg.text}</p>
                      <span className="messageTime">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="chatForm">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="chatInput"
                />
                <button type="submit" className="chatSendButton">
                  <Icon icon="mdi:send" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;