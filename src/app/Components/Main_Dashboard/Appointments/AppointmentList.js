'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


export const appointmentStatusMap = {
  0: 'Scheduled',
  1: 'Completed',
  2: 'Cancelled',
  3: 'Rescheduled',
};

export const appointmentActionMap = {
  0: 'Pending',
  1: 'Mark As Completed',
  2: 'Cancel Appointment',
  3: 'Reschedule',
};

const AppointmentList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:5056/api/CustomerAppointment/GetAllAppointments',{
    headers: { 
      Authorization: `Bearer ${token}` ,
    'Content-Type': 'multipart/form-data'
  },
  }) // Use actual API URL
      .then(response => {
        console.log(response)
        setAppointments(response.data);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  // Update local editable fields
  const handleEdit = (appt) => {
    setSelectedAppt({ ...appt });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAppt(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    console.log("appointment id "+ id)
    // Optimistically remove the appointment from the state
    const updatedAppointments = appointments.filter((appt) => appt.id !== id);
    setAppointments(updatedAppointments);
  
    // Send a DELETE request to the backend
    axios.delete(`http://localhost:5056/api/CustomerAppointment/DeleteAppointment/${id}`)
      .then(response => {
        console.log(`Appointment ${id} deleted successfully.`);
      })
      .catch(error => {
        console.error("Error deleting appointment:", error.response || error.message);
        // Optionally, you can revert the UI change if the API request fails
        setAppointments(appointments);  // Rollback to previous state if needed
      });
  };
  

  const handleSaveChanges = () => {
    const token = localStorage.getItem('token');

  
    axios.put(
      `http://localhost:5056/api/CustomerAppointment/UpdateAppointment/${selectedAppt.appointmentId}`,
      {
        "Name": selectedAppt.name,
        "email": selectedAppt.email,
        "PhoneNumber": selectedAppt.phoneNumber,
        "plan": selectedAppt.plan,
        "amount": selectedAppt.amount,  
        "duration": selectedAppt.duration

},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      console.log('Updated successfully:', selectedAppt);
  
      // Update frontend list locally
      const updatedAppointments = appointments.map((appt) =>
        appt.id === selectedAppt.id ? selectedAppt : appt
      );
      console.log('selectedAppt.id successfully:', selectedAppt);
      setAppointments(updatedAppointments);
      setShowModal(false);
      setSelectedAppt(null);
    })
    .catch(error => {
      console.error('Error updating appointment:', error.response?.data || error.message);
    
      alert('Failed to update appointment');
    });

    
  };
  

  return (
   <>
        <div className="card  rounded-4 mt-5">
          <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Appointments</h5>
          </div>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0 text-nowrap">
              <thead className="table-light">
                <tr>
                  <th>Sr. No</th>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Duration</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                  <th>Appointment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr key={index}>
                     <td>{index+1}</td>
                    <td>{appt.appointmentId}</td>
                    <td>{appt.name}</td>
                    <td>{appt.email}</td>
                    <td>{appt.phoneNumber}</td>
                    <td>{appt.duration}</td>
                    <td>{appt.plan}</td>
                    <td>{appt.amount}</td>
                    <td>{appt.paymentId}</td>
                    <td>
                      <span className={`badge bg-${appt.appointmentStatus === 'Confirmed' ? 'primary' : 'danger'}`}>
                        {appointmentStatusMap[appt.appointmentStatus]}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(appt)}>
                          <i className="ri-edit-line me-1"></i>Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(appt.appointmentId)}>
                          <i className="ri-delete-bin-line me-1"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && selectedAppt && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Appointment</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <form>
                 
                    <div className="mb-3">
                      <label className="form-label">Patient Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={selectedAppt.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={selectedAppt.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={selectedAppt.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        className="form-control"
                        name="time"
                        value={selectedAppt.duration}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Plan</label>
                      <input
                        type="text"
                        className="form-control"
                        name="plan"
                        value={selectedAppt.plan}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        name="amount"
                        value={selectedAppt.amount}
                        onChange={handleChange}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

      
        </>
  );
};

export default AppointmentList;
