import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Checking stored auth data...');
    const token = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_user');
    
    console.log('AuthContext: Token exists:', !!token);
    console.log('AuthContext: Admin data exists:', !!adminData);
    
    if (token && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        console.log('AuthContext: Setting admin from storage:', parsedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdmin(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (adminData) => {
    console.log('AuthContext: Setting admin data:', adminData);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};