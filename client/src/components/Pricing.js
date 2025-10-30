import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const pricingPlans = [
    {
      name: 'A10',
      area: '10m2',
      price: '$49/month',
      location: 'Storage Central Downtown, Ground Floor (Lower)',
      insurance: '$50,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg',
      popular: false
    },
    {
      name: 'B15',
      area: '15m2',
      price: '$89/month',
      location: 'Storage Central Downtown, First Floor (Upper)',
      insurance: '$75,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg',
      popular: true
    },
    {
      name: 'C20',
      area: '20m2',
      price: '$149/month',
      location: 'Storage Central Downtown, Ground Floor (Drive-up)',
      insurance: '$100,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg',
      popular: false
    }
  ];

  

  return (
    <section className="pricingSection">
      <div className="pricingContainer">
        <div className="pricingHeader">
          <h2 className="pricingTitle">
            Simple <span className="titleAccent">Pricing</span>
          </h2>
          <p className="pricingSubtitle">
            Choose the perfect storage size for your needs with transparent, competitive pricing
          </p>
        </div>

        <div className="pricingGrid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricingCard ${plan.popular ? 'popular' : ''}`}>
            
              
              <div className="unitBadge">{plan.name}</div>
              <img src={plan.image} alt="Storage Unit" className="unitImage" />
              
              <div className="cardContent">
                <div className="sizePrice">
                  <span className="unitArea">{plan.area}</span>
                  <span className="unitPrice">{plan.price}</span>
                </div>
                <p className="unitLocation">{plan.location}</p>
                <p className="unitInsurance">{plan.insurance}</p>
                
                <Link to="/storage" className="bookButton">
                  BOOK AND PAY NOW
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="pricingFooter">
          <p className="pricingNote">
            All plans include free setup and no hidden fees. 
            <Link to="/contact" className="contactLink"> Contact us</Link> for custom enterprise solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;