import React from 'react';
import    './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className='section'>
      <div className='container'>
        <h2 className='title'>
          How Our <span className='accent'>Logistics</span> Work
        </h2>
        <p className='subtitle'>
          We'll come, storage and transport anything from your doorstep to our
          warehouse. Here's how we offer world-class service.
        </p>
        
        <div className='stepsGrid'>
          <div className='step'>
            <div className='stepImage'>
              <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop" alt="Pick Up" className='image' />
            </div>
            <div className='stepContent'>
              <div className='stepIcon'> 
                <span class="material-symbols-outline">home</span>

              </div>
              <h3 className='stepTitle'>Pick Up</h3>
              <p className='stepDescription'>
                We pick up your belongings, transport to a convenient store, and
                confirm your new booking.
              </p>
            </div>
          </div>

          <div className='step'>
            <div className='stepImage'>
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" alt="Transport" className='image' />
            </div>
            <div className='stepContent'>
              <div className='stepIcon'></div>
              <h3 className='stepTitle'>Transport</h3>
              <p className='stepDescription'>
                We pick up from your location, deliver to convenient store, and
                confirm your new booking.
              </p>
            </div>
          </div>

          <div className='step'>
            <div className='stepImage'>
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop" alt="Store" className='image' />
            </div>
            <div className='stepContent'>
              <div className='stepIcon'></div>
              <h3 className='stepTitle'>Store</h3>
              <p className='stepDescription'>
                Enjoy our pickup location, select a convenient store, and
                confirm your new booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;