// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AdminLogin from './components/AdminLogin';
import BookingForm from './components/BookingForm';
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
          <Route path="/" element={
            <>
              <Header />
              <div>Welcome to Storage System</div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;