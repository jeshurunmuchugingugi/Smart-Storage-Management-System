import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Do I need to create an account to book a storage unit?',
      answer: 'No! Our platform allows you to browse available units and make bookings without creating an account. Simply select your unit, provide booking details, and complete payment.'
    },
    {
      question: 'How does the visual unit selection work?',
      answer: 'Our interactive facility map shows all storage units with real-time availability status. Green units are available, red units are occupied, and you can click on any available unit to see details and book instantly.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, mobile money (M-Pesa, Airtel Money), and PayPal. All transactions are secured with bank-level encryption.'
    },
    {
      question: 'How does the transport service work?',
      answer: 'Enter your pickup location and our smart system automatically calculates transport costs and available time slots. You can schedule pickup and delivery services directly through the platform.'
    },
    {
      question: 'Is my stored property insured?',
      answer: 'Yes, all stored items are covered by our comprehensive insurance policy. We also provide 24/7 security monitoring and climate-controlled environments for sensitive items.'
    },
    {
      question: 'Can I access my storage unit anytime?',
      answer: 'Our facilities offer 24/7 access with secure keypad entry. You\'ll receive access codes upon booking confirmation, and our security system tracks all entries for your peace of mind.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <div className="faq-badge">FAQ</div>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Find answers to common questions about our storage and transport services
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <Icon 
                  icon={openIndex === index ? 'mdi:minus' : 'mdi:plus'} 
                  className="faq-icon"
                />
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;