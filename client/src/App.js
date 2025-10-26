// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AdminLogin from './components/AdminLogin';
import HeroSection from './components/HeroSection';
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
          <Route path="/" element={
            <>
              <Header />
              <HeroSection />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;