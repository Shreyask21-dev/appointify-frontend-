'use client';
import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Plan_Widget from './Plan_Widget';

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
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchPlans = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5056/api/ConsultationPlan/get-all', {
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
      const response = await fetch(`http://localhost:5056/api/ConsultationPlan/delete/${planToDelete.planId}`, {
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

  const handleSave = async () => {
    // Check if editingIndex is valid
    if (editingIndex < 0 || editingIndex >= plans.length) {
        console.warn('Invalid editing index:', editingIndex);
        return; // Exit if there's no valid index
    }

    // Retrieve the token for authorization
    const token = localStorage.getItem('token');
    
    // Retrieve the planId based on the editingIndex
    const planId = plans[editingIndex].planId; // This needs to be defined correctly

    // Construct the plan object for the update
    const updatedPlan = {
        planId, // Send the planId that needs to be updated
        planName: editedPlan.name, 
        planPrice: parseFloat(editedPlan.price) || 0,
        planDuration: editedPlan.duration, 
        planDescription: editedPlan.description,
        planFeatures: editorRef.current.innerHTML,
    };

    // Debug log to review the updated plan structure
    console.log('Updated Plan:', updatedPlan);

    try {
        // Sending the PUT request to update the plan
        const response = await fetch(`http://localhost:5056/api/ConsultationPlan/update/${planId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedPlan),
        });

        // Handle response
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Update failed with status', response.status, errorData);
            throw new Error(`Update failed with status ${response.status}: ${errorData.message || response.statusText}`);
        }

        // Update the plan in the local state
        const updatedPlans = [...plans];
        updatedPlans[editingIndex] = { ...updatedPlan, planId }; // Replace with the updated plan details
        setPlans(updatedPlans); // Update state with the new plans

        setEditingIndex(null); // Clear editing index on success

        // Hide the modal after successfully saving
        const editModal = window.bootstrap.Modal.getInstance(document.getElementById('editModal'));
        editModal.hide();
        
    } catch (error) {
        // Log any errors that occur during the fetch
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
        <div className="card h-100 shadow-sm border-0 rounded-4 px-0" >
          <div className="card-header text-center text-black">
            <div className="mb-2">
              <span id={`pricingCount${index}`} className="fs-2 text-dark fw-semibold">
                {plan.planDuration}
              <span className='fs-5'> min</span>
              </span>
            </div>
            <h3 className="card-title fs-5 mt-1 lh-1">{plan.planName}</h3> {/* Added margin to separate from duration */}
            <p className="card-text justify-start mt-2">{plan.planDescription}</p> {/* Adjusted margin for better separation */}
          </div>

          <div className="card-body d-flex flex-column align-items-center py-0">
            <h5 className="text-dark fw-bold mt-3">Price: ₹{plan.planPrice}</h5>
            
            <div className=" text-black" dangerouslySetInnerHTML={{ __html: plan.planFeatures }} />
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
                  className="form-control rounded-3"
                  id="planName"
                  name="name"
                  value={editedPlan.name}
                  onChange={handleChange}
                  placeholder="Plan Name"
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
                      name="price"
                      value={editedPlan.price}
                      onChange={handleChange}
                      placeholder="Price"
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
                      name="duration"
                      value={editedPlan.duration}
                      onChange={handleChange}
                      placeholder="Duration"
                    />
                    <label htmlFor="planDuration">Plan Duration (e.g. 30 minutes)</label>
                  </div>
                </div>
              </div>

              <div className="form-floating mt-4">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="planDescription"
                  name="description"
                  value={editedPlan.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <label htmlFor="planDescription">Plan Description</label>
              </div>

              {/* Features Toolbar */}
              <div className="mt-5">
                <label className="mb-2 fw-semibold text-dark">Plan Features</label>
                <div className="d-flex gap-2 flex-wrap mb-3 p-2 bg-light shadow-sm rounded-3 justify-content-start">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => formatText('bold')} title="Bold">
                    <i className="fas fa-bold"></i>
                  </button>
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => formatText('italic')} title="Italic">
                    <i className="fas fa-italic"></i>
                  </button>
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => formatText('underline')} title="Underline">
                    <i className="fas fa-underline"></i>
                  </button>
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => formatText('insertOrderedList')} title="Numbered List">
                    <i className="fas fa-list-ol"></i>
                  </button>
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => formatText('insertUnorderedList')} title="Bullet List">
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
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan_List;
