'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Section3 = () => {
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [relatedImage, setRelatedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/assets/img/stethoscope.jpg');
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5056/api/ConsultantProfile/getConsultantProfile');
        const data = await response.json();
        
        if (data && data[0]) {
          const section3Data = data[0];

          // Safe access with fallback default values
          setTagline(section3Data?.section3_Tagline || '');
          setDescription(section3Data?.section3_Description || '');
          setPreviewUrl(section3Data?.section3_Image ? `http://localhost:5056${section3Data.section3_Image}` : '/assets/img/stethoscope.jpg');
        } else {
          console.log('No data available for section 3');
        }
      } catch (error) {
        console.log('Error fetching section 3 data:', error);
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
    try {
      const formData = new FormData();
      formData.append('Section3_Tagline', tagline);
      formData.append('section3_Description', description);

      if (relatedImage) {
        formData.append('section3_Image', relatedImage); // ✅ corrected key
      }

      const response = await axios.patch(
        'http://localhost:5056/api/ConsultantProfile/updateConsultantProfile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('Section 3 updated successfully!');
        setIsEdited(false);
      } else {
        alert('Failed to update Section 3.');
      }
    } catch (error) {
      console.error('Error updating section 3:', error);
      alert('An error occurred while saving Section 3.');
    }
  };

  return (
    <div>
      <h5 className="text-start mb-4 text-muted mt-5">Section 3 - Manage Consultant Info</h5>

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
              className="form-control mt-3 w-75 mx-auto"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="mt-2 text-muted">Recommended size: 150x150</p>
          </div>

          <div className="col-md-8">
            <div className="mb-4">
              <label className="form-label fw-semibold">Tagline:</label>
              <input
                type="text"
                className="form-control editable"
                value={tagline}
                onChange={(e) => {
                  setTagline(e.target.value);
                  setIsEdited(true);
                }}
              />
            </div>

            <div>
              <label className="form-label fw-semibold">Description:</label>
              <textarea
                className="form-control editable"
                rows="4"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsEdited(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            className="btn btn-primary px-4 py-2 rounded-pill mt-3"
            onClick={handleSave}
            disabled={!isEdited}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Section3;
