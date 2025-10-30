// This will handle the Units tab UI, show the table, and integrate the Unit Form.
import React, { useState } from 'react';
import UnitForm from './UnitForm';
import { useAuth } from '../../contexts/AuthContext';

const UnitsTab = ({ units, fetchData, handleDeleteUnit }) => {
  const { admin } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  return (
    <div>
      <div className="section-header">
        <h2>Storage Units Management</h2>
        {admin?.role === 'admin' && (
          <button onClick={() => setShowCreateForm(true)} className="create-btn">
            <span className="btn-icon">+</span> Add New Unit
          </button>
        )}
      </div>

      {(showCreateForm || editingUnit) && (
        <UnitForm
          editingUnit={editingUnit}
          setEditingUnit={setEditingUnit}
          setShowCreateForm={setShowCreateForm}
          fetchData={fetchData}
        />
      )}

      <div className="admin-table">
        <div className="table-header">
          <div className="table-cell">Unit Number</div>
          <div className="table-cell">Site</div>
          <div className="table-cell">Size</div>
          <div className="table-cell">Monthly Rate</div>
          <div className="table-cell">Status</div>
          <div className="table-cell">Location</div>
          <div className="table-cell">Actions</div>
        </div>
        {Array.isArray(units) && units.map(unit => (
          <div key={unit.unit_id} className="table-row">
            <div className="table-cell">{unit.unit_number}</div>
            <div className="table-cell">{unit.site}</div>
            <div className="table-cell">{unit.size || 'N/A'}</div>
            <div className="table-cell">{unit.monthly_rate}</div>
            <div className="table-cell">{unit.status}</div>
            <div className="table-cell">{unit.location || 'N/A'}</div>
            <div className="table-cell">
              {admin?.role === 'admin' && (
                <>
                  <button onClick={() => setEditingUnit(unit)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteUnit(unit.unit_id)} className="delete-btn">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitsTab;