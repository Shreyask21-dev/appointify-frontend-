'use client';
import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;
const UsersWidgets = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments`)
      .then((res) => res.json())
      .then((data) => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const patientEmails = new Set();
        let active = 0;
        let completed = 0;
        let pending = 0;

        data.forEach((appointment) => {
          const appointmentDate = appointment.appointmentDate;
          const status = appointment.appointmentStatus;

          // Count unique patients
          if (appointment.email) {
            patientEmails.add(appointment.email);
          }

          // Assume:
          // 1 = Active, 2 = Completed, 0 = Pending (adjust these if your API uses different codes)
          if (status === 0) {
            active++;
          } else if (status === 1) {
            completed++;
          } else if (status === 4) {
            pending++;
          }
        });

        setStats({
          totalPatients: patientEmails.size,
          activeAppointments: active,
          completedAppointments: completed,
          pendingAppointments: pending,
        });
      })
      .catch((error) => console.error('Error fetching dashboard stats:', error));
  }, []);

  return (
    <div className="row g-6 mb-6">
      {/* Total Patients */}
      <div className="col-sm-6 col-xl-3">
        <div className="card">
          <div className="card-body mb-5">
            <div className="d-flex justify-content-between">
              <div className="me-1">
                <p className="text-heading mb-1">Total Patients</p>
                <div className="d-flex align-items-center mb-2">
                  <h4 className="mb-1 me-2">{stats.totalPatients}</h4>
                </div>
                <small className="mt-5">All registered patients</small>
              </div>
              <div className="avatar">
                <div className="avatar-initial bg-label-primary rounded-3">
                  <i className="ri-hospital-line ri-26px"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Appointments */}
      <div className="col-sm-6 col-xl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="me-1">
                <p className="text-heading mb-1">Active Appointments</p>
                <div className="d-flex align-items-center mb-2">
                  <h4 className="mb-1 me-1">{stats.activeAppointments}</h4>
                </div>
                <small className="mb-0">Currently scheduled</small>
              </div>
              <div className="avatar">
                <div className="avatar-initial bg-label-success rounded-3">
                  <i className="ri-calendar-check-line ri-26px"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Appointments */}
      <div className="col-sm-6 col-xl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="me-1">
                <p className="text-heading mb-1">Completed Appointments</p>
                <div className="d-flex align-items-center mb-2">
                  <h4 className="mb-1 me-1">{stats.completedAppointments}</h4>
                </div>
                <small className="mb-0">Past appointments</small>
              </div>
              <div className="avatar">
                <div className="avatar-initial bg-label-info rounded-3">
                  <i className="ri-checkbox-circle-line ri-26px"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Appointments */}
      <div className="col-sm-6 col-xl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="me-1">
                <p className="text-heading mb-1">Pending Appointments</p>
                <div className="d-flex align-items-center mb-2">
                  <h4 className="mb-1 me-1">{stats.pendingAppointments}</h4>
                </div>
                <small className="mb-0">Awaiting confirmation</small>
              </div>
              <div className="avatar">
                <div className="avatar-initial bg-label-warning rounded-3">
                  <i className="ri-time-line ri-26px"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersWidgets;
