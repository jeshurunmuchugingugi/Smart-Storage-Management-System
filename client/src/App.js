// src/App.js
import React from 'react';
import AdminLogin from './components/AdminLogin';
import './App.css';

const App = () => {
  const handleAdminLogin = (admin) => {
    console.log('Admin logged in:', admin);
  };

  return (
    <div className="App">
      <AdminLogin onLogin={handleAdminLogin} />
    </div>
  );
};

export default App;