'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Reusable editable field component
const EditableField = ({ label, icon, value, onSave }) => {
  const [edit, setEdit] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);


  const handleSave = () => {
    onSave(tempValue);
    setEdit(false);
  };
  

  return (
    <li className="d-flex align-items-center mb-2">
      <i className={`me-2 ${icon}`}></i>
      {label && <span className="fw-medium me-1">{label}</span>}
      {edit ? (
        <>
          <input
            className="form-control d-inline w-auto"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <i
            className="ri-check-line text-success ms-2 cursor-pointer"
            onClick={handleSave}
            title="Save"
          ></i>
        </>
      ) : (
        <span onClick={() => setEdit(true)} className="cursor-pointer">{value || '—'}</span>
      )}
    </li>
  );
};
const handleImageUpload = (e, imageType,setUser) => {
  const file = e.target.files[0];
  if (file) {
    setUser((prevUser) => ({
      ...prevUser,
      [imageType]: file// Store the file itself in state
    }));
  }
};

const ProfileModal = ({ user, setUser, onClose, onSave, onImageUpload }) => {
  const fields = ['fullName', 'role', 'location', 'countries', 'languages', 'hospitalClinicAddress', 'email','experience','joinDate'];

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Profile</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {fields.map((field) => (
              <div className="form-group mb-3" key={field}>
              <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <input
                  type="text"
                  className="form-control"
                  value={user[field] || ''}
                  onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                />
              </div>
            ))}

<div className="form-group mb-3">
  <label>Profile Image</label>
  <input
    type="file"
    className="form-control"
    onChange={(e) => handleImageUpload(e, 'profileImage',setUser)} // Handle file input change
  />
</div>

<div className="form-group mb-3">
  <label>Background Image</label>
  <input
    type="file"
    className="form-control"
    onChange={(e) => handleImageUpload(e, 'backgroundImage',setUser)} // Handle file input change
  />
</div>

          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={() => onSave(user)}>Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5056/api/ConsultantProfile/getConsultantProfile', {
          headers: { 
            Authorization: `Bearer ${token}` ,
          'Content-Type': 'multipart/form-data'
        },
        })
        .then((res) => {
          const data = res.data[0];
          if (data) setUser(data);
        })
        .catch((err) => console.error('Error fetching profile:', err));
    }
   
  }, [token,showModal]);

  const handleFieldUpdate = async (key, newValue) => {
    const updatedUser = { ...user, [key]: newValue };
    setUser(updatedUser);

    try {
      await axios.patch(
        'http://localhost:5056/api/ConsultantProfile/updateConsultantProfile',
        { key, value: newValue },
        {  headers: { 
          Authorization: `Bearer ${token}` ,
        'Content-Type': 'multipart/form-data'
      }, }
      );
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleSaveProfile = async (newData) => {
    const formData = new FormData();

    // Append text fields (non-image data)
    Object.keys(newData).forEach((key) => {
      if (key !== 'profileImage' && key !== 'backgroundImage') { // Avoid appending images here
        formData.append(key, newData[key]);
      }
    });
   
  
    // Append the profile and background image (as files)
    if (user.profileImage) {
      console.log(user.profileImage)
      formData.append('profileImage', user.profileImage); // Image file for profile
    }
  
    if (user.backgroundImage) {
      formData.append('backgroundImage', user.backgroundImage); // Image file for background
    }
    try {
      const res = await axios.get('http://localhost:5056/api/ConsultantProfile/getConsultantProfile', {
        headers: { 
        Authorization: `Bearer ${token}` 
    },
      });

      if (res.data.length > 0) {
        await axios.patch('http://localhost:5056/api/ConsultantProfile/updateConsultantProfile', newData, {
          headers: { 
            Authorization: `Bearer ${token}` ,
          'Content-Type': 'multipart/form-data'
        },
        });
      } else {
        await axios.post('http://localhost:5056/api/ConsultantProfile/addConsultantProfile', newData, {
           headers: { 
        Authorization: `Bearer ${token}` ,
      'Content-Type': 'multipart/form-data'
    },
        });
      }

      setUser(newData);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }


   
  };

 

  
  

  return (
    <main className="container-xxl flex-grow-1 container-p-y">
      <section className="row mb-6">
        <div className="col-md-12">
            {/* Navigation Tabs */}
            <div className="nav-align-top mb-4">
            <ul className="nav nav-pills flex-column flex-md-row mb-4 gap-2 gap-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" href="/Dashboard/Profile">
                  <i className="ri-group-line me-2"></i> My Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link " href="/Dashboard/Security">
                  <i className="ri-lock-line me-2"></i> Security
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/Dashboard/Billing">
                  <i className="ri-bookmark-line me-2"></i> Billing & Plans
                </Link>
              </li>
            </ul>
          </div>
          <div className="card">
            <div className="user-profile-header-banner position-relative">
            <img
             src={
              user.backgroundImage &&`http://localhost:5056${user.backgroundImage}` 
            }
              alt="Banner"
              className="rounded-top w-100"
              style={{height:"180px"}}
            />
            </div>

            <div className="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center p-4">
         <div className="position-relative mx-auto mx-sm-4 mt-2">
           <img
             src={user.profileImage && `http://localhost:5056${user.profileImage}` }
             alt="Profile"
             className="rounded-4 user-profile-img"
             style={{width:'150px',height:'150px'}}
           />
          </div>                         
             <div className="flex-grow-1 mt-4 mt-sm-0">
               <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                 <div>
                   <h4 className="mb-2">{user.fullName}</h4>
                   <ul className="list-inline mb-0 d-flex flex-wrap gap-3">
                     <EditableField
                       label="Role:"
                       icon="ri-palette-line"
                       value={user.role}
                       onSave={(val) => handleFieldUpdate('role', val)}
                     />
                     <EditableField
                       label="Location:"
                       icon="ri-map-pin-line"
                       value={user.location}
                      onSave={(val) => handleFieldUpdate('location', val)}
                     />
                    <EditableField
                      label="Join Date:"
                      icon="ri-calendar-line"
                      value={user.joinDate}
                      onSave={(val) => handleFieldUpdate('joinDate', val)}
                    />
                
                  <EditableField
                   label="Languages:"
                   icon="ri-chat-voice-line"
                   value={user.languages}
                   onSave={(val) => handleFieldUpdate('languages', val)}
                   />
                   <EditableField
                     label="Hospital/Clinic Address:"
                     icon="ri-hospital-line"
                     value={user.hospitalClinicAddress}
                     onSave={(val) => handleFieldUpdate('hospitalClinicAddress', val)}
                   />
                   <EditableField
                     label="Email:"
                     icon="ri-mail-line"
                     value={user.email}
                     onSave={(val) => handleFieldUpdate('email', val)}
                   />
                    <EditableField
                        label="Countries:"
                        icon="ri-globe-line"
                        value={user.countries}
                        onSave={(val) => handleFieldUpdate('countries', val)}
                      />
                  
             </ul>
           </div>
        </div>
      </div>
  </div>

            
          </div>
        </div>
      </section>

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Update Profile
      </button>

      {showModal && (
        <ProfileModal
          user={user}
          setUser={setUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProfile}
          onImageUpload={handleImageUpload}
        />
      )}
    </main>
  );
};

export default Profile;
