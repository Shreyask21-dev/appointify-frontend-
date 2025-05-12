'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UsersList = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5056/api/PatientProfile/all', {
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
  }, [patients]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const [newPatient, setNewPatient] = useState({
    name: '', email: '', phone: '', createDate: '', totalAppointments: '', paymentStatus: 0
  });

  const handleEdit = (patient) => {
    setIsEditMode(true);
    setEditingPatient(patient);
    setNewPatient({
      id: patient.id,
      name: patient.fullName,
      email: patient.email,
      gender: patient.gender,
      age: patient.age,
      phoneNumber: patient.phoneNumber,
      createdDate: patient.createdDate,
      totalAppointments: patient.totalAppointments,
      paymentStatus: patient.paymentStatus
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
      paymentStatus: 0
    });
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5056/api/PatientProfile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` // if JWT token is stored
        },
        body: JSON.stringify({
          id: newPatient.id,
          name: newPatient.name,
          email: newPatient.email,
          phone: newPatient.phoneNumber,
          age: newPatient.age, 
          gender: newPatient.gender,
          totalAppointments: newPatient.totalAppointments,
          paymentStatus: newPatient.paymentStatus
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

  const handleDelete = async (email) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const res = await fetch(`http://localhost:5056/api/PatientProfile/delete/${email}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          alert("Patient deleted successfully");
          fetchPatients(); // reload table data
        } else {
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
      [name]: (name === "paymentStatus" || name === "age" || name === "totalAppointments") ? parseInt(value) : value
    });
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    setPatients([
      ...patients,
      { id: patients.length + 1, ...newPatient }
    ]);
    setShowForm(false);
    setNewPatient({ name: '', email: '', phoneNumber: '', gender: '', age: '', totalAppointments: '', paymentStatus: 0 });
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
              <th style={{ minWidth: '140px' }}>Gender</th>
              <th style={{ minWidth: '140px' }}>Age</th>
              <th style={{ minWidth: '130px' }}>Create Date</th>
              <th style={{ minWidth: '100px' }}>Total Appointments</th>
              <th style={{ minWidth: '100px' }}>Payment Status</th>
              <th style={{ minWidth: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.id}>
                <td>{index + 1}</td>
                <td>{patient.fullName}</td>
                <td>{patient.email}</td>
                <td>{patient.phoneNumber}</td>
                <td>{patient.gender}</td>
                <td>{patient.age}</td>
                <td>{patient.createdDate}</td>
                <td>{patient.totalAppointments}</td>
                {/* <td>
                  {patient.paymentStatus === 0 ? "Unpaid" :
                    patient.paymentStatus === 1 ? "PartiallyPaid" :
                      patient.paymentStatus === 2 ? "Paid" : "Unknown"}
                </td> */}
                <td>{patient.paymentStatus}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(patient)}><FaEdit /></button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(patient.email)} ><FaTrash /></button>
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
                  <div className="form-floating mb-3">
                    <input type="text" name="name" value={newPatient.name} onChange={handleInputChange} className="form-control" placeholder="Patient Name" required />
                    <label>Patient Name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" name="email" value={newPatient.email} onChange={handleInputChange} className="form-control" placeholder="Email" required />
                    <label>Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="tel" name="phone" value={newPatient.phoneNumber} onChange={handleInputChange} className="form-control" placeholder="Phone Number" required />
                    <label>Phone Number</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="text" name="gender" value={newPatient.gender} onChange={handleInputChange} className="form-control" placeholder="Phone Number" required />
                    <label>Gender</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="number" name="age" value={newPatient.age} onChange={handleInputChange} className="form-control" placeholder="Phone Number" required />
                    <label>Age</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="number" name="totalAppointments" value={newPatient.totalAppointments} onChange={handleInputChange} className="form-control" required />
                    <label>Total Appointments</label>
                  </div>
                  <div className="form-floating mb-3">
                    <select
                      name="paymentStatus"
                      value={newPatient.paymentStatus}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option>Select</option>
                      <option value={0}>Unpaid</option>
                      <option value={1}>PartiallyPaid</option>
                      <option value={2}>Paid</option>
                    </select>
                    <label>Payment Status</label>
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
