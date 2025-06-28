'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = process.env.REACT_APP_API_URL;
const Add_Plan = () => {
  const [formData, setFormData] = useState({
    planName: '',
    planPrice: '',
    planDuration: '',
    planDescription: '',
    planFeatures: '',
  });

  const editorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const validateForm = () => {
    const htmlContent = editorRef.current?.innerHTML || '';
    if (
      !formData.planName ||
      !formData.planPrice ||
      !formData.planDuration ||
      !formData.planDescription ||
      !htmlContent.trim()
    ) {
      toast.error('Please fill all fields before submitting the plan.');
      return false;
    }

    if (isNaN(formData.planPrice) || formData.planPrice <= 0) {
      toast.error('Please enter a valid plan price.');
      return false;
    }

    if (isNaN(formData.planDuration) || formData.planDuration.trim() === '') {
      toast.error('Please enter a valid duration.');
      return false;
    }

    if (!htmlContent.trim()) {
      toast.error('Please add at least one feature.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const htmlContent = editorRef.current?.innerHTML || '';

    const planData = {
      planName: formData.planName,
      planPrice: parseFloat(formData.planPrice),
      planDuration: formData.planDuration,
      planDescription: formData.planDescription,
      planFeatures: htmlContent,
    };

    setFormData({
      planName: '',
      planPrice: '',
      planDuration: '',
      planDescription: '',
      planFeatures: '',
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/ConsultationPlan/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error('Failed to add plan. Please check your credentials or server.');
      }

      const result = await response.json();
      toast.success(result.message || 'Plan added successfully!');

      // Reset form
      setFormData({
        planName: '',
        planPrice: '',
        planDuration: '',
        planDescription: '',
        planFeatures: '',
      });

      editorRef.current.innerHTML = '';

    } catch (error) {
      toast.error(error.message);
    }

    console.log('Form Data:', { ...formData, planFeatures: htmlContent });
  };

  return (
    <div className="container-xxl py-4">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
          <h4 className="fw-bold text-black m-0">Add a New Plan</h4>
          <button
            type="submit"
            className="btn btn-primary shadow-sm px-4 py-2 rounded-pill"
            style={{ fontWeight: '600', letterSpacing: '0.5px' }}
          >
             Publish Plan
          </button>
        </div>

        {/* Form Card */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-9 mt-5">
            <div
              className="rounded-4 border-0 p-4"
              style={{
                backgroundColor: '#f9f9ff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h5 className="card-title text-secondary mb-4"> Plan Information</h5>

              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="planName"
                  name="planName"
                  value={formData.planName}
                  onChange={handleChange}
                  placeholder="Plan Name"
                  style={{ backgroundColor: '#ffffff' }}
                />
                <label htmlFor="planName">Plan Name</label>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control rounded-3"
                      id="planPrice"
                      name="planPrice"
                      value={formData.planPrice}
                      onChange={handleChange}
                      placeholder="Price"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                    <label htmlFor="planPrice">Plan Price (₹)</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      id="planDuration"
                      name="planDuration"
                      value={formData.planDuration}
                      onChange={handleChange}
                      placeholder="Duration"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                    <label htmlFor="planDuration">Plan Duration (e.g 30 minutes)</label>
                  </div>
                </div>
              </div>

              <div className="form-floating mt-4">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="planDescription"
                  name="planDescription"
                  value={formData.planDescription}
                  onChange={handleChange}
                  placeholder="Description"
                  style={{ backgroundColor: '#ffffff' }}
                />
                <label htmlFor="planDescription">Plan Description</label>
              </div>

              {/* Features Toolbar */}
              <div className="mt-5">
                <label className="mb-2 fw-semibold text-dark">Plan Features</label>
                <div className="d-flex gap-2 flex-wrap mb-3 p-2 bg-light shadow-sm rounded-3 justify-content-start">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => formatText('bold')}
                    title="Bold"
                  >
                    <i className="fas fa-bold"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => formatText('italic')}
                    title="Italic"
                  >
                    <i className="fas fa-italic"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => formatText('underline')}
                    title="Underline"
                  >
                    <i className="fas fa-underline"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => formatText('insertOrderedList')}
                    title="Numbered List"
                  >
                    <i className="fas fa-list-ol"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => formatText('insertUnorderedList')}
                    title="Bullet List"
                  >
                    <i className="fas fa-list-ul"></i>
                  </button>
                </div>

                {/* Features Editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  className="form-control p-4 rounded-3"
                  style={{
                    minHeight: '200px',
                    outline: 'none',
                    backgroundColor: '#fff',
                    boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #dee2e6',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Add_Plan;
