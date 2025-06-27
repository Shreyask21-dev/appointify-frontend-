'use client';
import React, { useState, useEffect } from "react";
import '../../../../../dist/assets/vendor/aos/dist/aos.css';
import '../../../../../dist/assets/vendor/bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
import validator from 'validator';

const Section2 = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    experience: "",
    certificates: "", // Empty by default
    description: "",
    section2_Tagline: "",
    section2_Image: "/assets/img/160x160/img8.jpg",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

const fetchProfile = async () => {
  try {
    const response = await fetch("https://appointify.coinagesoft.com/api/ConsultantProfile/getConsultantProfile");
    if (!response.ok) throw new Error("Failed to fetch consultant data");

    const result = await response.json();
    const profile = result[0] || {};

    // Explicitly set certificates to an empty string if it's null
    const certificates = profile.certificates === "null" ? "" : profile.certificates;

    setFormData(prev => ({
      ...prev,
      fullName: profile.fullName || "",
      role: profile.role || "",
      experience: profile.experience || "",
      certificates: certificates, // Now ensures an empty string if null
      description: profile.description || "",
      section2_Tagline: profile.section2_Tagline || "",
      section2_Image: profile.section2_Image || "/assets/img/160x160/img8.jpg"
    }));

    setStatusMessage({ type: '', text: '' });
  } catch (error) {
    console.error("Error fetching consultant data:", error);
    setStatusMessage({ type: 'error', text: 'Failed to fetch section 2 content.' });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsEditing(true);
    }
  };

  const handleValidation = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required.';
    }
    if (!formData.experience) {
      newErrors.experience = 'Experience is required.';
    }

    // Certificates field is not validated
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSave = async () => {
  if (!handleValidation()) return; // Exit if validation fails

  setLoading(true);
  try {
    // Prepare the form data to be sent
    const updatedFormData = new FormData();

    // Loop through formData and append each value to FormData
    for (const key in formData) {
      if (key !== "section2_Image") {
        // If the certificates field is empty, set it to null before sending
        updatedFormData.append(
          key,
          key === "certificates" && formData[key] === "" ? null : formData[key]
        );
      }
    }

    // Handle the image file if present
    if (imageFile) {
      updatedFormData.append("section2_Image", imageFile);
    }

    // Send the data to the backend
    const response = await axios.patch(
      "https://appointify.coinagesoft.com/api/ConsultantProfile/updateConsultantProfile",
      updatedFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Handle successful response
    if (response.status === 200) {
      setIsEditing(false);
      setImageFile(null);
      await fetchProfile(); // 🔁 Refresh to get updated image path
      setStatusMessage({ type: 'success', text: 'Section 2 updated successfully!' });
    } else {
      setStatusMessage({ type: 'error', text: 'Failed to update section 2.' });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    setStatusMessage({ type: 'error', text: "An error occurred while updating the profile." });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <h5 className="text-muted mt-5 mb-4">Section 2 - Manage Consultant Info</h5>
      
      {statusMessage.text && (
        <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {statusMessage.text}
        </div>
      )}
      <div className="card p-4 shadow-sm">

        {/* Profile Image Upload */}
        <div className="text-center mb-4">
          <img
            src={formData.section2_Image ? `http://4.213.95.138:9090${formData.section2_Image}` : "/assets/img/160x160/img8.jpg"}
            alt="Section 2 Preview"
            id="section2_Image"
            className="rounded-circle border border-secondary"
            style={{ width: "160px", height: "160px", objectFit: "cover" }}
          />
          <div className="mt-3">
            <input
              type="file"
              className="form-control w-auto mx-auto"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <p className="mt-2 text-muted">Recommended size: 400x500</p>
        </div>

        {/* Profile Details */}
        <div className="row gx-4 gy-3">
          <div className="col-md-6">
            {["fullName", "role", "experience", "certificates"].map((field) => (
              <div className="row mb-3 align-items-center" key={field}>
                <label className="col-sm-4 col-form-label text-capitalize fw-semibold">
                  {field.replace(/([A-Z])/g, " $1")}:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id={field}
                    className={`form-control editable ${errors[field] ? 'is-invalid' : ''}`}
                    value={formData[field] || ""}
                    onChange={handleChange}
                  />
                  {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Description:</label>
              <textarea
                id="description"
                className={`form-control editable ${errors.description ? 'is-invalid' : ''}`}
                rows="3"
                value={formData.description || ""}
                onChange={handleChange}
              ></textarea>
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Tagline:</label>
              <input
                type="text"
                id="section2_Tagline"
                className={`form-control editable ${errors.section2_Tagline ? 'is-invalid' : ''}`}
                value={formData.section2_Tagline || ""}
                onChange={handleChange}
              />
              {errors.section2_Tagline && <div className="invalid-feedback">{errors.section2_Tagline}</div>}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-4">
          <button
            className="btn btn-primary px-4 rounded-pill mt-3"
            disabled={!isEditing || loading}
            onClick={handleSave}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Section2;
