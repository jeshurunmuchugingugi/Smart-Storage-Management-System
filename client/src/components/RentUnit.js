import React from 'react';
import { Link } from 'react-router-dom';
import './RentUnit.css';

const RentUnit = ({ units, loading }) => {
  const availableUnits = units.filter(unit => unit.status === 'available');

  if (loading) {
    return <div className="loading">Loading available units...</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Rent A Storage Unit</h1>
      <p className="subtitle">
        Choose from {availableUnits.length} available storage units
      </p>
      
      {availableUnits.length === 0 ? (
        <div className="noUnits">
          <p>No units available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="unitsGrid">
          {availableUnits.map(unit => (
            <div key={unit.unit_id} className="unitCard">
              <div className="unitHeader">
                <h3 className="unitNumber">{unit.unit_number}</h3>
                <span className="availableBadge">Available</span>
              </div>
              
              <div className="unitDetails">
                <p><strong>Site:</strong> {unit.site}</p>
                <p><strong>Location:</strong> {unit.location}</p>
                <p><strong>Monthly Rate:</strong> 
                  <span className="price">${unit.monthly_rate}</span>
                </p>
              </div>
              
              {unit.features && unit.features.length > 0 && (
                <div className="features">
                  <strong>Features:</strong>
                  <div className="featureTags">
                    {unit.features.map(feature => (
                      <span key={feature.feature_id} className="featureTag">
                        {feature.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Link 
                to={`/book/${unit.unit_id}`}
                className="rentButton"
              >
                Rent This Unit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default RentUnit;