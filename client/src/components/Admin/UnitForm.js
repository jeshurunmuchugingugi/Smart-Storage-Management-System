// This handles both creating and editing a unit.
import React, { useState, useEffect } from 'react';

const UnitForm = ({ editingUnit, setEditingUnit, setShowCreateForm, fetchData }) => {
  const [formData, setFormData] = useState({
    unit_number: '',
    site: '',
    size: '',
    monthly_rate: '',
    status: 'available',
    location: ''
  });

  useEffect(() => {
    if (editingUnit && editingUnit.unit_id) {
      setFormData({
        unit_number: editingUnit.unit_number,
        site: editingUnit.site,
        size: editingUnit.size || '',
        monthly_rate: editingUnit.monthly_rate,
        status: editingUnit.status,
        location: editingUnit.location || ''
      });
    }
  }, [editingUnit]);

  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      let response = await fetch(url, { ...options, headers });

      // retry logic if 401
      if (response.status === 401 && token) {
        try {
          const refreshResponse = await fetch('/api/admin/refresh-token', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (refreshResponse.ok) {
            const { access_token } = await refreshResponse.json();
            localStorage.setItem('admin_token', access_token);
            response = await fetch(url, { ...options, headers: { ...headers, 'Authorization': `Bearer ${access_token}` } });
          }
        } catch {}
      }
      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.unit_number || !formData.site || !formData.size || !formData.monthly_rate) {
      alert('Please fill in all required fields');
      return;
    }

    const unitData = {
      ...formData,
      monthly_rate: parseFloat(formData.monthly_rate)
    };

    try {
      let response;
      if (editingUnit && editingUnit.unit_id) {
        response = await apiCall(`/api/units/${editingUnit.unit_id}`, {
          method: 'PUT',
          body: JSON.stringify(unitData)
        });
      } else {
        response = await apiCall('/api/units', {
          method: 'POST',
          body: JSON.stringify(unitData)
        });
      }

      if (response.ok) {
        fetchData();
        setShowCreateForm(false);
        setEditingUnit(null);
        setFormData({ unit_number: '', site: '', monthly_rate: '', status: 'available', location: '' });
        alert(editingUnit ? 'Unit updated successfully!' : 'Unit created successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Error: ${errorData.error || 'Failed to submit unit'}`);
      }
    } catch (error) {
      alert('Failed to submit unit. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">{editingUnit ? 'Edit Unit' : 'Create New Unit'}</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Unit Number"
          value={formData.unit_number}
          onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Site"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Size"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Monthly Rate"
          value={formData.monthly_rate}
          onChange={(e) => setFormData({ ...formData, monthly_rate: e.target.value })}
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <div className="form-actions">
          <button type="submit" className="save-btn">{editingUnit ? 'Update Unit' : 'Create Unit'}</button>
          <button type="button" className="cancel-btn" onClick={() => {
            setShowCreateForm(false);
            setEditingUnit(null);
            setFormData({ unit_number: '', site: '', monthly_rate: '', status: 'available', location: '' });
          }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UnitForm;