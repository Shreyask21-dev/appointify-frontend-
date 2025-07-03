'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const Section3 = () => {
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [relatedImage, setRelatedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/assets/img/stethoscope.jpg');
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isTaglineValid, setIsTaglineValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [isImageValid, setIsImageValid] = useState(true); // Image validation state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://appointify.coinagesoft.com/api/ConsultantProfile/getConsultantProfile`);
        const data = await response.json();
        
        if (data && data[0]) {
          const section3Data = data[0];

          // Safe access with fallback default values
          setTagline(section3Data?.section3_Tagline || '');
          setDescription(section3Data?.section3_Description || '');
          setPreviewUrl(section3Data?.section3_Image ? `https://appointify.coinagesoft.com${section3Data.section3_Image}` : '/assets/img/stethoscope.jpg');
          setStatusMessage({ type: '', text: '' });
        } else {
          setStatusMessage({ type: 'error', text: 'No data available for section 3' });
        }
      } catch (err) {
          setStatusMessage({ type: 'error', text: 'Failed to fetch section 3 content.' });
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, []);

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRelatedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEdited(true);
    }
  };

  // SAVE TO DATABASE
  const handleSave = async () => {
    // Validate fields
    if (!tagline.trim()) {
      setIsTaglineValid(false);
      return;
    } else {
      setIsTaglineValid(true);
    }

    if (!description.trim()) {
      setIsDescriptionValid(false);
      return;
    } else {
      setIsDescriptionValid(true);
    }

    if (!relatedImage) {
      setIsImageValid(false);  // Image is required validation
      return;
    } else {
      setIsImageValid(true);
    }

    try {
      const formData = new FormData();
      formData.append('Section3_Tagline', tagline);
      formData.append('section3_Description', description);
      formData.append('section3_Image', relatedImage); // ✅ added image

      setLoading(true);
      const response = await axios.patch(
        `https://appointify.coinagesoft.com/api/ConsultantProfile/updateConsultantProfile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setStatusMessage({ type: 'success', text: 'Section 3 updated successfully!' });
        setIsEdited(false);
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update Section 3' });
      }
    } catch (error) {
      console.error('Error updating section 3:', error);
      setStatusMessage({ type: 'error', text: 'An error occurred while saving Section 3.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="text-start mb-4 text-muted mt-5">Section 3 - Manage Consultant Info</h5>
       {statusMessage.text && (
        <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {statusMessage.text}
        </div>
      )}
      <div className="card p-4">
        {/* Image Upload */}
        <div className="row align-items-center mb-4">
          <div className="col-md-4 text-center">
            <div className="border border-secondary rounded mx-auto" style={{ width: '150px', height: '150px', overflow: 'hidden' }}>
              <img
                src={previewUrl}
                alt="Related"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <input
              type="file"
              className={`form-control mt-3 w-75 mx-auto ${!isImageValid ? 'is-invalid' : ''}`}  // Image validation
              accept="image/*"
              onChange={handleImageChange}
            />
            {!isImageValid && <div className="invalid-feedback">Image is required.</div>}  {/* Image error message */}
            <p className="mt-2 text-muted">Recommended size: 150x150</p>
          </div>

          <div className="col-md-8">
            {/* Tagline Input */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Tagline:</label>
              <input
                type="text"
                className={`form-control editable ${!isTaglineValid ? 'is-invalid' : ''}`}
                value={tagline}
                onChange={(e) => {
                  setTagline(e.target.value);
                  setIsEdited(true);
                }}
              />
              {!isTaglineValid && <div className="invalid-feedback">Tagline is required.</div>}
            </div>

            {/* Description Input */}
            <div>
              <label className="form-label fw-semibold">Description:</label>
              <textarea
                className={`form-control editable ${!isDescriptionValid ? 'is-invalid' : ''}`}
                rows="4"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsEdited(true);
                }}
              />
              {!isDescriptionValid && <div className="invalid-feedback">Description is required.</div>}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            className="btn btn-primary px-4 py-2 rounded-pill mt-3"
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

export default Section3;
