'use client';
import React, { useEffect, useState } from "react";
import '../../../../../dist/assets/vendor/aos/dist/aos.css';
import '../../../../../dist/assets/vendor/bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";

const Section1 = () => {
  const [data, setData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5056/api/ConsultantProfile/getConsultantProfile");
        if (!response.ok) throw new Error("Failed to fetch consultant data");
        const result = await response.json();
        console.log("result",result[0]);
        setData(result[0]);
        setEditableData(result[0]);
      } catch (error) {
        console.error("Error fetching consultant data:", error);
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

  const handleSave = async () => {
    try {
      const formData = new FormData();
  
      // Append normal fields
      Object.entries(editableData).forEach(([key, value]) => {
        // Skip undefined values entirely
        if (value !== undefined) {
          formData.append(key, value ?? ''); // convert null to empty string
        }
      });
  
      // Append images if selected
      if (backgroundImageFile) {
        formData.append('backgroundImage', backgroundImageFile);
      }
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
  
      const response = await axios.patch(
        "http://localhost:5056/api/ConsultantProfile/updateConsultantProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        alert("Profile updated successfully!");
        setIsEdited(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };
  

  if (!editableData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="mb-5">
      <h5 className="mb-4 text-muted">Section 1 - Manage Banner Info</h5>
      <div className="card p-4 shadow-sm rounded-4">

        {/* Images Section */}
        <div className="row g-4 justify-content-center mb-4">

          {/* Background Image */}
          <div className="col-md-6 text-center">
            <div
              className="position-relative rounded overflow-hidden mx-auto"
              style={{
                maxWidth: "100%",
                height: "200px",
                backgroundColor: "#f0f0f0",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  editableData.backgroundImage
                    ? `http://localhost:5056${editableData.backgroundImage}`  // Add the base URL for the background image
                    : '/assets/img/1920x400/img1.jpg'
                }
                alt="Background Preview"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
            <input
              type="file"
              className="form-control w-75 mx-auto mt-3"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setBackgroundImageFile(file);
                  setEditableData((prev) => ({
                    ...prev,
                    backgroundImage: URL.createObjectURL(file),
                  }));
                  setIsEdited(true);
                }
              }}
            />
          </div>

          {/* Profile Image */}
          <div className="col-md-6 text-center">
            <img
              src={
                editableData.profileImage
                  ? editableData.profileImage.startsWith('blob:')
                    ? editableData.profileImage
                    : `http://localhost:5056/${editableData.profileImage}`
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
                  className="form-control"
                  value={editableData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={editableData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Clinic Address</label>
              <input
                type="text"
                className="form-control"
                value={editableData.hospitalClinicAddress}
                onChange={(e) => handleInputChange("hospitalClinicAddress", e.target.value)}
              />
            </div>
             <div className="mb-3">
              <label className="form-label fw-semibold">Clinic Address URL</label>
              <input
                type="text"
                className="form-control"
                value={editableData.locationURL}
                onChange={(e) => handleInputChange("hospitalClinicAddress", e.target.value)}
              />
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
                  className="form-control"
                  value={editableData[platform] || ''}
                  onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                />
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
                  className="form-control"
                  value={editableData[tagline] || ""}
                  onChange={(e) => handleInputChange(tagline, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-4">
          <button
            className="btn btn-primary px-4 py-2 rounded-pill"
            disabled={!isEdited}
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default Section1;
