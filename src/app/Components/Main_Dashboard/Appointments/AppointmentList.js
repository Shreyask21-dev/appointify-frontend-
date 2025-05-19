import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const appointmentStatusMap = {
  0: 'Scheduled',
  1: 'Completed',
  2: 'Cancelled',
  3: 'Rescheduled',
  4:'Pending'
};

export const paymentStatusMap = {
  0: 'Pending',
  1: 'Paid',
  2: 'Failed',
  3: 'Refunded'
};

const AppointmentList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5056/api/CustomerAppointment/GetAllAppointments', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        const sortedAppointments = [...response.data].sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
          setAppointments(sortedAppointments);

        // setAppointments(response.data);
        console.log("Appointments", response.data)
        
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, [appointments]);

  const handleEdit = (appt) => {
    setSelectedAppt({ ...appt });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAppt(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const numericFields = ['paymentStatus', 'appointmentStatus'];

    setSelectedAppt((prevState) => ({
      ...prevState,
      [name]: numericFields.includes(name) ? parseInt(value) : value
    }));
  };

  const handleDelete = (id) => {
    const updatedAppointments = appointments.filter((appt) => appt.id !== id);
    setAppointments(updatedAppointments);

    axios.delete(`http://localhost:5056/api/CustomerAppointment/DeleteAppointment/${id}`)
      .then(() => {
        console.log(`Appointment ${id} deleted successfully.`);
      })
      .catch(error => {
        console.error("Error deleting appointment:", error.response || error.message);
        setAppointments(appointments);  // Rollback on failure
      });
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem('token');
    console.log("Selected appointment before update:", selectedAppt);
    axios.put(
      `http://localhost:5056/api/CustomerAppointment/UpdateAppointment/${selectedAppt.id}`,
      {
        
        firstName: selectedAppt.firstName,
        lastName: selectedAppt.lastName,
        email: selectedAppt.email,
        phoneNumber: selectedAppt.phoneNumber,
        duration: selectedAppt.duration,
        plan: selectedAppt.plan,
        amount: selectedAppt.amount,
        appointmentTime: selectedAppt.appointmentTime,
        appointmentDate: selectedAppt.appointmentDate,
        paymentMethod: selectedAppt.paymentMethod,
        appointmentStatus: selectedAppt.appointmentStatus,
        paymentStatus: selectedAppt.paymentStatus,
        paymentId: selectedAppt.paymentId

      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {

   
        const updatedAppointments = appointments.map((appt) =>
          appt.id === selectedAppt.id ? response.data : appt
        );
        console.log("selectedAppt", selectedAppt)
        console.log("updatedAppointments", updatedAppointments)
        setAppointments(updatedAppointments);
        setShowModal(false);
        setSelectedAppt(null);
      })
      .catch((error) => {
        console.error('Error updating appointment:', error.response?.data || error.message);
        alert('Failed to update appointment');
      });
  };

  const handleViewInvoice = (apptId) => {
    // For now, we will just log the appointment id or open a placeholder.
    console.log(`Viewing invoice for appointment ${apptId}`);
    // You can replace this with logic to open an invoice PDF or redirect to an invoice page.
    window.open(`/invoice/${apptId}`, '_blank'); // Adjust URL as needed
  };

  return (
    <>
      <div className="card rounded-4 mt-5">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Appointments</h5>
        </div>
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0 text-nowrap">
            <thead className="table-light">
              <tr>
                <th>Sr. No</th>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Duration</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Time</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Payment ID</th>
                <th>Payment Status</th>
                <th>Appointment Status</th>
                <th>Actions</th>
                <th>View Invoice</th> 
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id || index}>
                  <td>{index + 1}</td>
                  <td>{appt.firstName} {appt.lastName}</td>
                  <td>{appt.email}</td>
                  <td>{appt.phoneNumber}</td>
                  <td>{appt.duration}</td>
                  <td>{appt.plan}</td>
                  <td>{appt.amount}</td>
                  <td>{appt.appointmentTime}</td>
                  <td>{appt.appointmentDate}</td>
                  <td>{appt.paymentMethod}</td>
                  <td>{appt.paymentId === null ? "None" : appt.paymentId }</td>
                  <td>
                    <span className={`badge bg-${appt.paymentStatus === 0 ? 'primary' :
                        appt.paymentStatus === 1 ? 'success' :
                          appt.paymentStatus === 2 ? 'danger' :
                            appt.paymentStatus === 3 ? 'warning' : 'secondary'
                      }`}>
                      {paymentStatusMap[appt.paymentStatus]}
                    </span>

                  </td>
                  <td>
                   
                     <span className={`badge bg-${appt.appointmentStatus === 0 ? 'primary' :
                        appt.appointmentStatus === 1 ? 'success' :
                          appt.appointmentStatus === 2 ? 'danger' :
                            appt.appointmentStatus === 3 ? 'warning' :
                             appt.appointmentStatus === 4 ? 'danger' : 'secondary'
                      }`}>
                      {appointmentStatusMap[appt.appointmentStatus]}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(appt)}>
                        <i className="ri-edit-line me-1"></i>Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(appt.id)}>
                        <i className="ri-delete-bin-line me-1"></i>Delete
                      </button>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-info" onClick={() => handleViewInvoice(appt.id)}>
                      <i className="ri-file-list-line me-1"></i>View Invoice
                    </button>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for editing appointment */}
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
                  {/* Patient Name */}
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" name="firstName" value={selectedAppt.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="lastName" value={selectedAppt.lastName} onChange={handleInputChange} />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={selectedAppt.email} onChange={handleInputChange} />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" name="phoneNumber" value={selectedAppt.phoneNumber} onChange={handleInputChange} />
                  </div>

                  {/* Duration */}
                  <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <input type="text" className="form-control" name="duration" value={selectedAppt.duration} onChange={handleInputChange} />
                  </div>

                  {/* Plan */}
                  <div className="mb-3">
                    <label className="form-label">Plan</label>
                    <input type="text" className="form-control" name="plan" value={selectedAppt.plan} onChange={handleInputChange} />
                  </div>

                  {/* Amount */}
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control" name="amount" value={selectedAppt.amount} onChange={handleInputChange} />
                  </div>

                  {/* Time */}
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input type="text" className="form-control" name="appointmentTime" value={selectedAppt.appointmentTime} onChange={handleInputChange} />
                  </div>

                  {/* Date */}
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" name="appointmentDate" value={selectedAppt.appointmentDate} onChange={handleInputChange} />
                  </div>

                  {/* Payment Method */}
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" name="paymentMethod" value={selectedAppt.paymentMethod || ''} onChange={handleInputChange}>
                      <option value="">Select Payment Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Gpay/Online">Gpay/Online</option>
                    </select>
                  </div>



                  {/* Payment Status */}
                  <div className="mb-3">
                    <label className="form-label">Payment Status</label>
                    <select className="form-select" name="paymentStatus" value={selectedAppt.paymentStatus} onChange={handleInputChange}>
                      <option value={0}>Pending</option>
                      <option value={1}>Paid</option>
                      <option value={2}>Failed</option>
                      <option value={3}>Refunded</option>
                    </select>
                  </div>

                  {/* Appointment Status */}
                  <div className="mb-3">
                    <label className="form-label">Appointment Status</label>
                    <select className="form-select" name="appointmentStatus" value={selectedAppt.appointmentStatus} onChange={handleInputChange}>
                      <option value={0}>Scheduled</option>
                      <option value={1}>Completed</option>
                      <option value={2}>Cancelled</option>
                      <option value={3}>Rescheduled</option>
                       <option value={4}>Pending</option>
                    </select>

                  </div>
                  <div className="mb-3">
                    <label className="form-label">PaymentId</label>
                    <input type="text" className="form-control" name="paymentId" value={selectedAppt.paymentId} onChange={handleInputChange} />
                  </div>

                  <div className="text-center mt-3">
                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentList;
