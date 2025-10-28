// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import HeroSection from './components/HeroSection';
import BookingForm from './components/BookingForm';
import BookingsList from './components/BookingsList';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import RentUnit from './components/RentUnit';
import Services from './components/Services';
import StorageUnits from './components/StorageUnits'
import Testimonials  from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Pricing from './components/Pricing';
import './App.css';

const App = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/units');
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.log('Backend not available, using static data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleAdminLogin = (admin) => {
    console.log('Admin logged in:', admin);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminLogin onLogin={handleAdminLogin} />} />
          <Route path="/book/:unitId" element={<BookingForm />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/about" element={<About />} />
          <Route path="/storage" element={<StorageUnits units={units} loading={loading} onRefresh={fetchUnits} />} />
          <Route path="/rent-unit" element={<RentUnit />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={
            <>
              <Header />
              <HeroSection />
              <HowItWorks />
              <WhyChooseUs />
              <Testimonials/>
              <Pricing />
              <FAQ/>
              < Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;