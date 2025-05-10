import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Section5 = () => {
  const [formData, setFormData] = useState({
    tagline: '',
    mainDescription: '',
    mainHeading: '',
  });

  const [editedData, setEditedData] = useState({ ...formData });
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Fetch Section 5 data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5056/api/section5');
        setFormData(res.data);
        setEditedData(res.data);
        setStatusMessage({ type: '', text: '' });
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Failed to fetch section content.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Detect form changes
  useEffect(() => {
    const hasChanges =
      editedData.tagline !== formData.tagline ||
      editedData.mainDescription !== formData.mainDescription ||
      editedData.mainHeading !== formData.mainHeading;
    setIsEdited(hasChanges);
  }, [editedData, formData]);

  // Handle input change
  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  // Handle Save
  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put('http://localhost:5056/api/Section5/api/section5', editedData);
      setFormData(editedData);
      setIsEdited(false);
      setStatusMessage({ type: 'success', text: 'Section updated successfully!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to update section.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset
  const handleReset = () => {
    setEditedData(formData);
    setIsEdited(false);
    setStatusMessage({ type: '', text: '' });
  };

  return (
    <div className="container my-5">
      <h5 className="text-muted mb-4">Section 5 - Manage Plan Taglines</h5>

      {statusMessage.text && (
        <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {statusMessage.text}
        </div>
      )}

      <div className="card shadow-sm p-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Tagline</label>
          <input
            type="text"
            className="form-control"
            value={editedData.tagline}
            disabled={loading}
            onChange={e => handleChange('tagline', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            rows="4"
            className="form-control"
            value={editedData.mainDescription}
            disabled={loading}
            onChange={e => handleChange('mainDescription', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Heading</label>
          <input
            type="text"
            className="form-control"
            value={editedData.mainHeading}
            disabled={loading}
            onChange={e => handleChange('mainHeading', e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={!isEdited || loading}
          >
            Reset
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!isEdited || loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Section5;
