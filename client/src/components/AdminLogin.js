import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        onLogin(data.admin);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };



  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Sign in to access the dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@storelink.com"
              value={credentials.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                style={styles.passwordInput}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Remember me
            </label>
            <a href="#" style={styles.forgotLink}>Forgot password?</a>
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <button type="submit" disabled={loading} style={styles.signInButton}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        

        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account? <a href="#" style={styles.contactLink}>Contact IT Admin</a>
          </p>
          <p style={styles.copyright}>
            © 2025 storelink logistics. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    padding: '1rem',
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  form: {
    marginBottom: '1.5rem',
  },
  inputGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    width: '100%',
    padding: '0.75rem 3rem 0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeButton: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.25rem',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '0.5rem',
  },
  forgotLink: {
    fontSize: '0.875rem',
    color: '#4f46e5',
    textDecoration: 'none',
  },
  signInButton: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '2rem',
  },

  footer: {
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  contactLink: {
    color: '#4f46e5',
    textDecoration: 'none',
  },
  copyright: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: 0,
  },
  error: {
    color: '#ef4444',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
  },
};

export default AdminLogin;