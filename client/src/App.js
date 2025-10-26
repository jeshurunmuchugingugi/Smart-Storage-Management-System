// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (token && user) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = (admin) => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/admin-secret-login" element={
              isAdminLoggedIn ? 
                <AdminDashboard onLogout={handleAdminLogout} /> : 
                <AdminLogin onLogin={handleAdminLogin} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;