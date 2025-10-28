import React from 'react';
import { Icon } from '@iconify/react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      icon: 'mdi:credit-card-outline',
      title: 'Instant Online Payments',
      description: 'Pay securely via M-PESA, Visa, or Mastercard quick and convenient.'
    },
    {
      icon: 'mdi:shield-check-outline',
      title: 'Secure & Protected',
      description: '24/7 surveillance and climate control keeps your items safe and secure.'
    },
    {
      icon: 'mdi:home-outline',
      title: 'Convenient Access',
      description: 'Easy pickup and delivery service right to your doorstep when you need it.'
    }
  ];

  return (
    <section className='whyChooseUsSection'>
      <div className='whyChooseUsContainer'>
            <h2 className='whyChooseUsTitle'>Why Choose Us</h2>
            <p className='whyChooseUsSubtitle'>
              Safe, simple, all-in-one storage and transport here's why customers trust us.
            </p>


        <div className='whyChooseUsContent'>


          <div className='whyChooseUsImage'>
            <img 
              src="https://storagecentral-kenya.com/wp-content/uploads/2025/09/2x16eclrsn0rg628cle4e.jpg" 
              alt="Storage facility workers" 
            />
          </div>



          <div className='whyChooseUsText'>
            <div className='featuresGrid'>
              {features.map((feature, index) => (
                <div key={index} className='featureCard'>
                  <div className='featureIcon'>
                    <Icon icon={feature.icon} />
                  </div>
                  <div className='featureContent'>
                    <h3 className='featureTitle'>{feature.title}</h3>
                    <p className='featureDescription'>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>



        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;