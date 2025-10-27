import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const StorageUnitsPage = () => {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const storageUnits = [
    {
      id: 1,
      name: 'A10',
      area: '10m2',
      price: 'Ksh. 29,532/month',
      location: 'Storage Central Mombasa Road, Ground Floor (Lower)',
      insurance: 'Ksh. 50,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg'
    },
    {
      id: 2,
      name: 'A11',
      area: '10m2',
      price: 'Ksh. 29,532/month',
      location: 'Storage Central Mombasa Road, Ground Floor (Lower)',
      insurance: 'Ksh. 50,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg'
    },
    {
      id: 3,
      name: 'A10',
      area: '10m2',
      price: 'Ksh. 29,532/month',
      location: 'Storage Central Mombasa Road, Ground Floor (Lower)',
      insurance: 'Ksh. 50,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg'
    },
    {
      id: 4,
      name: 'A10',
      area: '10m2',
      price: 'Ksh. 29,532/month',
      location: 'Storage Central Mombasa Road, Ground Floor (Lower)',
      insurance: 'Ksh. 50,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg'
    },
    {
      id: 5,
      name: 'A10',
      area: '10m2',
      price: 'Ksh. 29,532/month',
      location: 'Storage Central Mombasa Road, Ground Floor (Lower)',
      insurance: 'Ksh. 50,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg'
    },
    {
      id: 6,
      name: 'A10',
      area: '10m2',
      price: 'Ksh. 29,532/month',
      location: 'Storage Central Mombasa Road, Ground Floor (Lower)',
      insurance: 'Ksh. 50,000 insurance cover included. No deposit required',
      image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg'
    }
  ];

  const filteredUnits = filter === 'All' ? storageUnits : storageUnits.filter(unit => unit.area === filter);

  return (
    <>
      <Header />
      <div style={styles.container}>
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Filter by Floor Area</label>
        <select 
          style={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="10m2">10m2</option>
          <option value="15m2">15m2</option>
          <option value="20m2">20m2</option>
        </select>
      </div>

      <div style={styles.grid}>
        {filteredUnits.map((unit) => (
          <div 
            key={unit.id} 
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={styles.badge}>{unit.name}</div>
            <img src={unit.image} alt="Storage Unit" style={styles.image} />
            <div style={styles.cardContent}>
              <div style={styles.sizePrice}>
                <span style={styles.size}>{unit.area}</span>
                <span style={styles.price}>{unit.price}</span>
              </div>
              <p style={styles.location}>{unit.location}</p>
              <p style={styles.insurance}>{unit.insurance}</p>
              <button 
                style={styles.bookButton}
                onClick={() => navigate(`/book/${unit.id}`)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e6941a';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F5A623';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                BOOK AND PAY NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
  },
  filterSection: {
    backgroundColor: '#f5f5f5',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  filterLabel: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333'
  },
  filterSelect: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)'
    }
  },
  card: {
    backgroundColor: '#FFF5E9',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    position: 'relative',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  badge: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: '#F5A623',
    color: 'white',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    zIndex: 2
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '1.5rem'
  },
  sizePrice: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  size: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333'
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333'
  },
  location: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem',
    lineHeight: '1.4'
  },
  insurance: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '1.5rem',
    lineHeight: '1.4'
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#F5A623',
    color: 'white',
    border: 'none',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
};

export default StorageUnitsPage;