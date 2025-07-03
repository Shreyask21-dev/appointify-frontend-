'use client';
import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Plan_Widget from './Plan_Widget';
const API_URL = process.env.REACT_APP_API_URL;
const Plan_List = () => {
  const [plans, setPlans] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPlan, setEditedPlan] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    features: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    features: '',
  });
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchPlans = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`https://appointify.coinagesoft.com/api/ConsultationPlan/get-all`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setPlans(data);
        } else {
          console.error('Expected an array for plans, but got:', data);
          setPlans([]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        setPlans([]);
      }
    };

    fetchPlans(); // Call the fetch function
  }, []);

  const handleEdit = (index) => {
    if (index < 0 || index >= plans.length) return;

    const selectedPlan = plans[index];
    setEditingIndex(index);
    setEditedPlan({
      name: selectedPlan.planName,
      price: selectedPlan.planPrice,
      duration: selectedPlan.planDuration,
      description: selectedPlan.planDescription,
      features: selectedPlan.planFeatures,
    });

    // Set contentEditable with current features for editing
    if (editorRef.current) {
      editorRef.current.innerHTML = selectedPlan.planFeatures; // Display existing features
    }

    // Trigger modal open (Bootstrap modal)
    const editModal = new window.bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  };

  const handleDelete = async (index) => {
    if (index < 0 || index >= plans.length) return;

    const token = localStorage.getItem('token');
    const planToDelete = plans[index];

    try {
      const response = await fetch(`https://appointify.coinagesoft.com/api/ConsultationPlan/delete/${planToDelete.planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const updatedPlans = plans.filter((_, i) => i !== index);
        setPlans(updatedPlans);
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate name
    if (!editedPlan.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate price
    if (!editedPlan.price || isNaN(editedPlan.price) || parseFloat(editedPlan.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
      isValid = false;
    }

    // Validate duration
    if (!editedPlan.duration) {
      newErrors.duration = 'Duration is required';
      isValid = false;
    }

    // Validate description
    if (!editedPlan.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    // Validate features (check if content is entered in the editor)
    if (!editorRef.current || !editorRef.current.innerHTML.trim()) {
      newErrors.features = 'Features are required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    // Check if form is valid
    if (!validateForm()) {
      return; // If form is invalid, don't proceed with the save
    }

    // Retrieve the token for authorization
    const token = localStorage.getItem('token');
    const planId = plans[editingIndex].planId;

    const updatedPlan = {
      planId,
      planName: editedPlan.name,
      planPrice: parseFloat(editedPlan.price) || 0,
      planDuration: editedPlan.duration,
      planDescription: editedPlan.description,
      planFeatures: editorRef.current.innerHTML,
    };

    try {
      const response = await fetch(`https://appointify.coinagesoft.com/api/ConsultationPlan/update/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPlan),
      });

      if (response.ok) {
        const updatedPlans = [...plans];
        updatedPlans[editingIndex] = { ...updatedPlan, planId };
        setPlans(updatedPlans);
        setEditingIndex(null);

        const editModal = window.bootstrap.Modal.getInstance(document.getElementById('editModal'));
        editModal.hide();
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlan((prev) => ({ ...prev, [name]: value }));
  };

  const formatText = (formatType) => {
    document.execCommand(formatType);
  };

  return (
    <div className="container py-4">
      <Plan_Widget />
      <div className="row">
        {plans.length === 0 ? (
          <div>No plans available.</div>
        ) : (
          plans.map((plan, index) => (
            <div className="col-md mb-3 mb-md-0 col-lg-4 col-md-6 col-12 mt-4" key={plan.planId}>
              <div className="card h-100 shadow-sm border-0 rounded-4 px-0">
                <div className="card-header text-center text-black">
                  <div className="mb-2">
                    <span id={`pricingCount${index}`} className="fs-2 text-dark fw-semibold">
                      {plan.planDuration}
                      <span className="fs-5"> min</span>
                    </span>
                  </div>
                  <h3 className="card-title fs-5 mt-1 lh-1">{plan.planName}</h3>
                  <p className="card-text justify-start mt-2">{plan.planDescription}</p>
                </div>

                <div className="card-body d-flex flex-column align-items-center py-0">
                  <h5 className="text-dark fw-bold mt-3">Price: ₹{plan.planPrice}</h5>

                  <div className="text-black" dangerouslySetInnerHTML={{ __html: plan.planFeatures }} />
                </div>

                <div className="card-footer text-center">
                  <button type="button" className="btn btn-ghost-light bg-warning text-white me-2" onClick={() => handleEdit(index)}>
                    Edit
                  </button>

                  <button type="button" className="btn btn-ghost-light bg-danger text-white" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content rounded-4">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Plan Information</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-4">
                <input
                  type="text"
                  className={`form-control rounded-3 ${errors.name ? 'border-danger' : ''}`}
                  id="planName"
                  name="name"
                  value={editedPlan.name}
                  onChange={handleChange}
                  placeholder="Plan Name"
                />
                <label htmlFor="planName">Plan Name</label>
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className={`form-control rounded-3 ${errors.price ? 'border-danger' : ''}`}
                      id="planPrice"
                      name="price"
                      value={editedPlan.price}
                      onChange={handleChange}
                      placeholder="Price"
                    />
                    <label htmlFor="planPrice">Plan Price (₹)</label>
                    {errors.price && <div className="text-danger">{errors.price}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control rounded-3 ${errors.duration ? 'border-danger' : ''}`}
                      id="planDuration"
                      name="duration"
                      value={editedPlan.duration}
                      onChange={handleChange}
                      placeholder="Duration"
                    />
                    <label htmlFor="planDuration">Plan Duration (e.g. 30 minutes)</label>
                    {errors.duration && <div className="text-danger">{errors.duration}</div>}
                  </div>
                </div>
              </div>

              <div className="form-floating mt-4">
                <input
                  type="text"
                  className={`form-control rounded-3 ${errors.description ? 'border-danger' : ''}`}
                  id="planDescription"
                  name="description"
                  value={editedPlan.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <label htmlFor="planDescription">Plan Description</label>
                {errors.description && <div className="text-danger">{errors.description}</div>}
              </div>

              <div className="mt-4">
                <label htmlFor="planFeatures" className="form-label">Plan Features</label>
                <div
                  id="planFeatures"
                  className={`border p-2 ${errors.features ? 'border-danger' : ''}`}
                  contentEditable
                  ref={editorRef}
                />
                {errors.features && <div className="text-danger">{errors.features}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan_List;
