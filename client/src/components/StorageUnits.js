import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const StorageUnitsPage = ({ units, loading, onRefresh }) => {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  // Static fallback data when backend is not available
  const staticUnits = [
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

  // Use backend data if available, otherwise use static data
  const storageUnits = units && units.length > 0 ? units.map(unit => ({
    id: unit.unit_id,
    name: unit.unit_number,
    area: `${unit.size || 10}m2`,
    price: `Ksh. ${unit.monthly_rate}/month`,
    location: unit.location ? `Location: ${unit.location}` : `Site: ${unit.site}`,
    site: `Site: ${unit.site}`,
    insurance: 'Ksh. 50,000 insurance cover included. No deposit required',
    image: 'https://www.sparefoot.com/blog/wp-content/uploads/2024/08/how-much-is-a-storage-unit-hero-1334x1334.jpg',
    status: unit.status,
    features: unit.features
  })) : staticUnits;

  const filteredUnits = filter === 'All' ? storageUnits : storageUnits.filter(unit => unit.area === filter);

  if (loading) {
    return (
      <>
        <Header />
        <div style={styles.container}>
          <div style={styles.loading}>Loading storage units...</div>
        </div>
      </>
    );
  }

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
        {filteredUnits && filteredUnits.length > 0 ? filteredUnits.map((unit) => (
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
            {unit.status && (unit.status === 'available' || unit.status === 'booked') && (
              <div style={{
                ...styles.statusBadge,
                backgroundColor: unit.status === 'booked' ? '#fecaca' : unit.status === 'available' ? '#dcfce7' : '#f0fdf4',
                color: unit.status === 'booked' ? '#dc2626' : unit.status === 'available' ? '#166534' : '#d97706'
              }}>
                {unit.status.toUpperCase()}
              </div>
            )}
            <img src={unit.image} alt="Storage Unit" style={styles.image} />
            <div style={styles.cardContent}>
              <div style={styles.sizePrice}>
                <span style={styles.size}>{unit.area}</span>
                <span style={styles.price}>{unit.price}</span>
              </div>

              <div style={styles.locandsite}>
                 <p style={styles.location}>{unit.location}</p>
              <p style={styles.site}>{unit.site}</p>
              </div>

              {unit.features && unit.features.length > 0 && (
                <div style={styles.featuresSection}>
                  <div style={styles.featuresList}>
                    {unit.features.map((feature, index) => (
                      <span key={index} style={styles.featureBadge}>
                        {feature.name || feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p style={styles.insurance}>{unit.insurance}</p>
              {(!unit.status || unit.status === 'available') ? (
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
              ) : (
                <button 
                  style={{
                    ...styles.bookButton,
                    backgroundColor: '#9CA3AF',
                    cursor: 'not-allowed'
                  }}
                  disabled
                >
                  NOT AVAILABLE
                </button>
              )}
            </div>
          </div>
        )) : (
          <div style={styles.noUnits}>
            <p style={styles.noUnitsText}>No storage units available at the moment.</p>
            {onRefresh && (
              <button style={styles.refreshButton} onClick={onRefresh}>
                Refresh
              </button>
            )}
          </div>
        )}
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
  locandsite:{
    marginTop:'0px',
    display:'flex',
    justifyContent:'space-between'
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
    color: '#1A2637',
    marginBottom: '0.5rem',
    lineHeight: '1.4'
  },
    site: {
    fontSize: '0.9rem',
    color: '#1A2637',
    marginBottom: '0.5rem',
    lineHeight: '1.4'
  },
  insurance: {
    fontSize: '0.95rem',
    color: '#888',
    marginBottom: '1.5rem',
    lineHeight: '1.4',
    textAlign:'left',
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
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#64748b',
    padding: '2rem'
  },
  statusBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500',
    zIndex: 2
  },
  featuresSection: {
    marginBottom: '1rem'
  },
  featuresList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  featureBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem'
  },
  noUnits: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '2rem'
  },
  noUnitsText: {
    color: '#64748b',
    fontSize: '1.1rem',
    marginBottom: '1rem'
  },
  refreshButton: {
    backgroundColor: '#F5A623',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default StorageUnitsPage;