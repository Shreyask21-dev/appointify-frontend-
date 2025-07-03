'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
const API_URL = process.env.REACT_APP_API_URL;
const UsersList = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://appointify.coinagesoft.com/api/CustomerAppointment/unique-users`, {
        headers: {
          Authorization: `Bearer ${token}`  // replace with your JWT token
        }
      });
      console.log("users", response.data);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };



  useEffect(() => {
    fetchPatients();
  }, []);

  const [newPatient, setNewPatient] = useState({
    name: '', email: '', phone: '', createDate: '', totalAppointments: '', lastAppointment: ''
  });

  const handleEdit = (patient) => {
    setIsEditMode(true);
    setEditingPatient(patient);
    setNewPatient({
      id: patient.userId,
      firstName: patient.firstName ,
       lastName : patient.lastName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      totalAppointments: patient.totalAppointments,
      lastAppointment: patient.lastAppointment,

    });
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditingPatient(null);
    setNewPatient({
      id: "",
      name: "",
      email: "",
      phoneNumber: "",
      createdDate: "",
      totalAppointments: 0,
      lastAppointment:''
    });
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/patch/${newPatient.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` // if JWT token is stored
        },
        body: JSON.stringify({
          id: newPatient.userId,
          firstName: newPatient.firstName ,
          lastName : newPatient.lastName,
          email: newPatient.email,
          phone: newPatient.phoneNumber,
     
        })
      });

      if (response.ok) {
        alert("Patient updated successfully");
        setShowForm(false);
        setIsEditMode(false);
        setEditingPatient(null);
        fetchPatients(); // Refresh patient list after updating
      } else {
        const err = await response.text();
        alert("Update failed: " + err);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const res = await fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/delete/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          alert("Patient deleted successfully");
          fetchPatients(); // reload table data
        } else {
          console.log(userId)
          const error = await res.text();
          alert("Failed to delete: " + error);
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({
      ...newPatient,
      [name]: ( name === "totalAppointments") ? parseInt(value) : value
    });
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    setPatients([
      ...patients,
      { id: patients.length + 1, ...newPatient }
    ]);
    setShowForm(false);
    setNewPatient({ name: '', email: '', phoneNumber: '' });
  };

  return (
    <div className="card p-3 shadow-sm mb-5">
      <div className="table-responsive mb-5">
        <table className="table table-bordered align-middle text-nowrap">
          <thead className="table-light">
            <tr>
              <th style={{ minWidth: '50px' }}>#</th>
              <th style={{ minWidth: '150px' }}>Name</th>
              <th style={{ minWidth: '180px' }}>Email</th>
              <th style={{ minWidth: '140px' }}>Phone</th>
              <th style={{ minWidth: '100px' }}>Total Appointments</th>
              <th style={{ minWidth: '130px' }}>Last Appointment Date</th>
              <th style={{ minWidth: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.userId}>
                <td>{index + 1}</td>
                <td>{patient.firstName} {patient.lastName}</td>
                <td>{patient.email}</td>
                <td>{patient.phoneNumber}</td>
                <td>{patient.totalAppointments}</td>
                <td>{patient.lastAppointment}</td>


                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(patient)}><FaEdit /></button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(patient.userId)} ><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Update Patient Modal */}
      {showForm && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">{isEditMode ? "Update Patient Data" : "Add New Patient"}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={isEditMode ? handleUpdatePatient : handleAddPatient}>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={newPatient.firstName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={newPatient.lastName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={newPatient.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={newPatient.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Total Appointments</label>
                    <input
                      type="number"
                      className="form-control"
                      name="totalAppointments"
                      value={newPatient.totalAppointments}
                      required
                      readOnly
                    />
                  </div>

                   <div className="mb-3">
                    <label className="form-label">Last Appointment Date</label>
                    <input
                      className="form-control"
                      name="lastAppointment"
                      value={newPatient.lastAppointment}
                      required
                      readOnly
                    />
                  </div>

                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-2">Save Changes</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal}>Cancel</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
