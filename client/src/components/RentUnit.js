import React from 'react';
import { Link } from 'react-router-dom';
import './RentUnit.css';

const RentUnit = ({ units = [], loading, error }) => {
  const availableUnits = units.filter(unit => unit.status === 'available');

  if (loading) {
    return <div className="loading">Loading storage units...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Storage Unit Rentals</h1>
      <p className="subtitle">
        {availableUnits.length} units ready for rent
      </p>
      
      {availableUnits.length === 0 ? (
        <div className="noUnits">
          <p>Currently no units available. Check back soon.</p>
        </div>
      ) : (
        <div className="unitsGrid">
          {availableUnits.map(unit => (
            <div key={unit.unit_id} className="unitCard">
              <div className="unitHeader">
                <h3 className="unitNumber">Unit {unit.unit_number}</h3>
                <span className="availableBadge">Available</span>
              </div>
              
              <div className="unitDetails">
                <div className="detailRow">
                  <span className="label">Site:</span>
                  <span className="value">{unit.site}</span>
                </div>
                {unit.location && (
                  <div className="detailRow">
                    <span className="label">Location:</span>
                    <span className="value">{unit.location}</span>
                  </div>
                )}
                <div className="detailRow">
                  <span className="label">Monthly Rate:</span>
                  <span className="price">${unit.monthly_rate}</span>
                </div>
              </div>
              
              {unit.features && unit.features.length > 0 && (
                <div className="features">
                  <span className="featuresLabel">Features:</span>
                  <div className="featureTags">
                    {unit.features.map((feature, index) => (
                      <span key={feature.feature_id || index} className="featureTag">
                        {feature.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="cardActions">
                <Link 
                  to={`/book/${unit.unit_id}`}
                  className="rentButton"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentUnit;