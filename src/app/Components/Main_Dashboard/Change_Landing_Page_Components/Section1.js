'use client';
import React, { useEffect, useState } from "react";
import '../../../../../dist/assets/vendor/aos/dist/aos.css';
import '../../../../../dist/assets/vendor/bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const Section1 = () => {
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [data, setData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ConsultantProfile/getConsultantProfile`);
        if (!response.ok) throw new Error("Failed to fetch consultant data");
        const result = await response.json();
        console.log("section1", result[0]);
        setData(result[0]);
        setEditableData(result[0]);
        setStatusMessage({ type: '', text: '' });
      } catch (error) {
        console.error("Error fetching consultant data:", error);
        setStatusMessage({ type: 'error', text: 'Failed to fetch section content.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setEditableData({ ...editableData, [field]: value });
    setIsEdited(true);
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditableData((prev) => ({
      ...prev,
      [platform]: value,
    }));
    setIsEdited(true);
  };

  const validateForm = () => {
    let formErrors = {};
    // Basic validation for required fields
    if (!editableData.fullName) formErrors.fullName = "Full Name is required";
    if (!editableData.role) formErrors.role = "Designation is required";
    if (!editableData.experience) formErrors.experience = "Experience is required";
    if (!editableData.email || !/\S+@\S+\.\S+/.test(editableData.email)) formErrors.email = "Valid Email is required";
    if (!editableData.hospitalClinicAddress) formErrors.hospitalClinicAddress = "Clinic Address is required";
    if (!editableData.locationURL || !/^(ftp|http|https):\/\/[^ "]+$/.test(editableData.locationURL)) {
      formErrors.locationURL = "Valid Clinic Address URL is required";
    }
    // Validate social media URLs
    ['facebookId', 'instagramId', 'twitterId', 'youtubeId'].forEach(platform => {
      if (editableData[platform] && !/^(ftp|http|https):\/\/[^ "]+$/.test(editableData[platform])) {
        formErrors[platform] = `Valid URL is required for ${platform}`;
      }
    });
    // Validate taglines
    ["tagline1", "tagline2", "tagline3"].forEach((tagline) => {
      if (!editableData[tagline]) formErrors[tagline] = `${tagline} is required`;
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();

      // Append normal fields
      Object.entries(editableData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value ?? ''); // convert null to empty string
        }
      });

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      const response = await axios.patch(
        `${API_URL}/api/ConsultantProfile/updateConsultantProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setStatusMessage({ type: 'success', text: 'Section 1 updated successfully!' });
        setIsEdited(false);
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update profile!' });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatusMessage({ type: 'error', text: "An error occurred while updating the profile." });
    }
  };

  if (!editableData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="mb-5">
      <h5 className="mb-4 text-muted">Section 1 - Manage Banner Info</h5>
      {statusMessage.text && (
        <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {statusMessage.text}
        </div>
      )}
      <div className="card p-4 shadow-sm rounded-4">

        {/* Profile Image */}
        <div className="row g-4 justify-content-center mb-4">
          <div className="col-md-6 text-center">
            <img
              src={
                editableData.profileImage
                  ? editableData.profileImage.startsWith('blob:')
                    ? editableData.profileImage
                    : `${API_URL}/${editableData.profileImage}`
                  : '/assets/img/160x160/img8.jpg'
              }
              alt="Profile"
              className="border border-secondary rounded-circle"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <input
              type="file"
              className="form-control w-75 mx-auto mt-3"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfileImageFile(file);
                  setEditableData((prev) => ({
                    ...prev,
                    profileImage: URL.createObjectURL(file),
                  }));
                  setIsEdited(true);
                }
              }}
            />
            <p className="text-muted mt-1">Recommended size: 160x160</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="row gx-5">
          <div className="col-md-6">
            {[
              ["Full Name", "fullName"],
              ["Designation", "role"],
              ["Experience", "experience"],
            ].map(([label, field]) => (
              <div className="mb-3" key={field}>
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type="text"
                  className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                  value={editableData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={editableData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Clinic Address</label>
              <input
                type="text"
                className={`form-control ${errors.hospitalClinicAddress ? 'is-invalid' : ''}`}
                value={editableData.hospitalClinicAddress}
                onChange={(e) => handleInputChange("hospitalClinicAddress", e.target.value)}
              />
              {errors.hospitalClinicAddress && <div className="invalid-feedback">{errors.hospitalClinicAddress}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Clinic Address URL</label>
              <input
                type="text"
                className={`form-control ${errors.locationURL ? 'is-invalid' : ''}`}
                value={editableData.locationURL}
                onChange={(e) => handleInputChange("locationURL", e.target.value)}
              />
              {errors.locationURL && <div className="invalid-feedback">{errors.locationURL}</div>}
            </div>
          </div>
        </div>

        {/* Social Media + Taglines */}
        <div className="row gx-5 mt-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Social Media</label>

            {[
              { platform: 'facebookId', icon: 'bi-facebook' },
              { platform: 'instagramId', icon: 'bi-instagram' },
              { platform: 'twitterId', icon: 'bi-twitter' },
              { platform: 'youtubeId', icon: 'bi-youtube' },
            ].map(({ platform, icon }) => (
              <div className="input-group mb-2" key={platform}>
                <span className="input-group-text">
                  <i className={icon}></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors[platform] ? 'is-invalid' : ''}`}
                  value={editableData[platform] || ''}
                  onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                />
                {errors[platform] && <div className="invalid-feedback">{errors[platform]}</div>}
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Taglines</label>

            {["tagline1", "tagline2", "tagline3"].map((tagline, idx) => (
              <div className="mb-2" key={tagline}>
                <label className="form-label">{`Tagline ${idx + 1}`}</label>
                <input
                  type="text"
                  className={`form-control ${errors[tagline] ? 'is-invalid' : ''}`}
                  value={editableData[tagline] || ""}
                  onChange={(e) => handleInputChange(tagline, e.target.value)}
                />
                {errors[tagline] && <div className="invalid-feedback">{errors[tagline]}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-4">
          <button
            className="btn btn-primary px-4 py-2 rounded-pill"
            disabled={!isEdited || loading}
            onClick={handleSave}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Section1;
