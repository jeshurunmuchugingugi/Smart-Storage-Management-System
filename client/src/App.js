// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLogin from './components/Admin/AdminLogin';
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
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Pricing from './components/Pricing';
import Payment from './components/Payment';
import { API_BASE_URL } from './services/api';
import './App.css';

const App = () => {

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch storage units from backend
  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/units`);
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

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchUnits();
  }, [refreshTrigger]);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/manager/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard onDataChange={triggerRefresh} />
            </ProtectedRoute>
          } />
          <Route path="/book/:unitId" element={<BookingForm />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
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
    </AuthProvider>
  );
};

export default App;
