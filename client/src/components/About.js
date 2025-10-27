import React from 'react';
import './About.css';
const About = () => {
  return (
    <div className='container'>
      {/* Hero Section */}
      <div className='hero'>
        <h1 className='heroTitle'>Smart Storage Management System</h1>
        <p className='heroSubtitle'>
          Intelligent, automated, and secure storage solutions for the modern world
        </p>
      </div>

      {/* About Section */}
      <div className='aboutSection'>
        <div className='aboutContent'>
          <div className='textContent'>
            <div className='badge'>About us</div>
            <h2 className='sectionTitle'>Smart Storage, Smarter Solutions</h2>
            
            <p className='paragraph'>
              Our Smart Storage Management System revolutionizes how you store and manage 
              your belongings. Using cutting-edge technology and intelligent automation, 
              we provide secure, efficient, and user-friendly storage solutions.
            </p>
            
            <p className='paragraph'>
              Experience seamless storage management with real-time monitoring, automated 
              inventory tracking, and instant access control. Our digital-first approach 
              ensures you have complete visibility and control over your stored items.
            </p>
            
            <p className='paragraph'>
              From personal belongings to business inventory, our smart system adapts 
              to your needs with flexible storage options, climate control, and 24/7 
              security monitoring for ultimate peace of mind.
            </p>
          </div>
          
          <div className='imageContainer'>
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" 
              alt="Storage facility" 
              className='aboutImage'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;