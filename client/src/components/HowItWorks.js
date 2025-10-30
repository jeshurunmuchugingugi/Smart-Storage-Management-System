import React from 'react';
import { Icon } from '@iconify/react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: 'mdi:truck-outline',
      image: 'https://img.freepik.com/free-photo/close-up-delivery-person-with-parcel_23-2149095903.jpg',
      title: 'Schedule Pickup',
      description: 'Book online or call us to schedule a convenient pickup time. Our team will come to your location with all necessary equipment.'
    },
    {
      number: '02', 
      icon: 'mdi:package-variant',
      image: 'https://media.istockphoto.com/id/1438633182/photo/delivery-house-move-cargo-truck-service-man-checking-box-list-from-digital-tablet-for.jpg?s=612x612&w=0&k=20&c=Y4lXlsNkvX9iKNVsuoK5rEZum2fZlD0eurrKJrvgF8A=',
      title: 'Secure Transport',
      description: 'We carefully pack and transport your items using professional-grade materials and climate-controlled vehicles.'
    },
    {
      number: '03',
      icon: 'mdi:warehouse',
      image: 'https://img.freepik.com/premium-photo/lockers-storing-visitors-security-locker_1305391-288.jpg?semt=ais_hybrid&w=740&q=80',
      title: 'Safe Storage',
      description: 'Your belongings are stored in our secure, monitored facility with 24/7 surveillance and climate control.'
    }
  ];

  return (
    <section className='howItWorksSection'>
      <div className='howItWorksContainer'>
        <div className='howItWorksHeader'>
          <button className='howItBtn'>HOW IT WORKS</button>
          <h2 className='howItWorksTitle'>
            How Our <span className='titleAccent'>Logistics</span> Work
          </h2>
          <p className='howItWorksSubtitle'>
We’ve made storage and transport effortless. From your doorstep to our secure units, here’s how we take care of everything for you.          </p>
        </div>
        
        <div className='stepsContainer'>
          {steps.map((step, index) => (
            <div key={index} className='stepCard'>
              <div className='stepNumber'>{step.number}</div>
              <div className='stepImageContainer'>
                <img src={step.image} alt={step.title} className='stepImage' />
                <div className='stepIconOverlay'>
                  <Icon icon={step.icon} className='stepIcon' />
                </div>
              </div>
              <h3 className='stepTitle'>{step.title}</h3>
              <p className='stepDescription'>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;