import React from 'react';
import { Icon } from '@iconify/react';
import './About.css';

const About = () => {
  const stats = [
    { number: '500+', label: 'Storage Units' },
    { number: '24/7', label: 'Security Monitoring' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '1000+', label: 'Happy Customers' }
  ];

  const features = [
    {
      icon: 'mdi:shield-check',
      title: 'Secure & Safe',
      description: '24/7 surveillance '
    },
    {
      icon: 'mdi:clock-fast',
      title: 'Real-Time Access',
      description: 'Instant access to your storage units anytime'
    },
    {
      icon: 'mdi:phone-in-talk',
      title: 'Expert Support',
      description: 'Professional customer service when you need it'
    }
  ];

  return (
    <section className='aboutSection'>
      <div className='aboutContainer'>
        {/* Main About Content */}
        <div className='aboutContent'>
          <div className='textContent'>
            <h2 className='aboutTitle'>
              About <span className='titleAccent'>Our Company</span>
            </h2>
            
            <p className='aboutDescription'>
              We revolutionize storage management with cutting-edge technology and intelligent automation. 
              Our platform provides secure, efficient, and user-friendly storage solutions for modern needs.
            </p>
            
            <p className='aboutDescription'>
              Experience seamless storage with real-time monitoring, automated inventory tracking, 
              and instant access control. Our digital-first approach ensures complete visibility 
              and control over your stored items.
            </p>

            {/* Stats */}
            <div className='statsGrid'>
              {stats.map((stat, index) => (
                <div key={index} className='statItem'>
                  <div className='statNumber'>{stat.number}</div>
                  <div className='statLabel'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className='imageContent'>
            <div className='imageWrapper'>
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=500&fit=crop&crop=center" 
                alt="Modern storage facility" 
                className='aboutImage'
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='featuresSection'>
          <h3 className='featuresTitle'>Why Choose Us</h3>
          <div className='featuresGrid'>
            {features.map((feature, index) => (
              <div key={index} className='featureCard'>
                <div className='featureIcon'>
                  <Icon icon={feature.icon} />
                </div>
                <h4 className='featureTitle'>{feature.title}</h4>
                <p className='featureDescription'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;