'use client';
import React, { useState, useEffect } from "react";
import '../../../../../dist/assets/vendor/aos/dist/aos.css';
import '../../../../../dist/assets/vendor/bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";

const Section2 = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    experience: "",
    certificates: "",
    description: "",
    section2_Tagline: "",
    facebookId: "",
    instagramId: "",
    twitterId: "",
    youtubeId: "",
    section2_Image: "/assets/img/160x160/img8.jpg",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5056/api/ConsultantProfile/getConsultantProfile");
      if (!response.ok) throw new Error("Failed to fetch consultant data");
      const result = await response.json();
      const profile = result[0] || {};
      console.log("section2", profile);
      setFormData(prev => ({ ...prev, ...profile }));
    } catch (error) {
      console.error("Error fetching consultant data:", error);
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

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({ ...prev, [platform]: value }));
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      const updatedFormData = new FormData();

      for (const key in formData) {
        if (key !== "section2_Image") {
          updatedFormData.append(key, formData[key]);
        }
      }

      if (imageFile) {
        updatedFormData.append("section2_Image", imageFile);
      }

      const response = await axios.patch(
        "http://localhost:5056/api/ConsultantProfile/updateConsultantProfile",
        updatedFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        setImageFile(null);
        await fetchProfile(); // 🔁 Refresh to get updated image path
      } else {
        alert("Failed to update profile.");
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <>
      <h5 className="text-muted mt-5 mb-4">Section 2 - Manage Consultant Info</h5>
      <div className="card p-4 shadow-sm">

        {/* Profile Image Upload */}
        <div className="text-center mb-4">
          <img
            src={
              formData.section2_Image
                ? `http://localhost:5056${formData.section2_Image}`
                : "/assets/img/160x160/img8.jpg"
            }
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
                    className="form-control editable"
                    value={formData[field] || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Description:</label>
              <textarea
                id="description"
                className="form-control editable"
                rows="3"
                value={formData.description || ""}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Tagline:</label>
              <input
                type="text"
                id="section2_Tagline"
                className="form-control editable"
                value={formData.section2_Tagline || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-4">
          <label className="form-label fw-semibold mb-2">Social Media:</label>
          <div className="row g-3">
            {[
              { platform: 'facebookId', icon: 'bi-facebook' },
              { platform: 'instagramId', icon: 'bi-instagram' },
              { platform: 'twitterId', icon: 'bi-twitter' },
              { platform: 'youtubeId', icon: 'bi-youtube' },
            ].map(({ platform, icon }) => (
              <div className="input-group mb-2" key={platform}>
                <span className="input-group-text">
                  <i className={`bi ${icon}`}></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={formData[platform] || ''}
                  onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-4">
          <button
            className="btn btn-primary px-4 rounded-pill mt-3"
            disabled={!isEditing}
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default Section2;
