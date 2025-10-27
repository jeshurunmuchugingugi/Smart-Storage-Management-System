// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AdminLogin from './components/AdminLogin';
import HeroSection from './components/HeroSection';
import BookingForm from './components/BookingForm';
import BookingsList from './components/BookingsList';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import RentUnit from './components/RentUnit';
import StorageUnits  from './components/StorageUnits';

import './App.css';

const App = () => {
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
          <Route path="/storage" element={<StorageUnits />} />
          <Route path="/rent-unit" element={<RentUnit />} />
          <Route path="/" element={
            <>
              <Header />
              <HeroSection />
              <HowItWorks />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;