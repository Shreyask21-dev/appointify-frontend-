'use client';
import React, { useState, useEffect } from 'react';

const UsersWidgets = () => {
  const [stats, setStats] = useState({
    totalPatients: { count: 5432, change: '+12%' },
    activeAppointments: { count: 1245, change: '+8%' },
    completedAppointments: { count: 4678, change: '+5%' },
    pendingAppointments: { count: 237, change: '-3%' },
  });

  // Use useEffect when you’re ready to fetch from backend
  // useEffect(() => {
  //   fetch('/api/dashboard-stats')
  //     .then(res => res.json())
  //     .then(data => setStats(data));
  // }, []);

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
                  <h4 className="mb-1 me-2">{stats.totalPatients.count.toLocaleString()}</h4>
                  <p className="text-success mb-1">({stats.totalPatients.change})</p>
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
                  <h4 className="mb-1 me-1">{stats.activeAppointments.count.toLocaleString()}</h4>
                  <p className="text-success mb-1">({stats.activeAppointments.change})</p>
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
                  <h4 className="mb-1 me-1">{stats.completedAppointments.count.toLocaleString()}</h4>
                  <p className="text-primary mb-1">({stats.completedAppointments.change})</p>
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
                  <h4 className="mb-1 me-1">{stats.pendingAppointments.count.toLocaleString()}</h4>
                  <p className="text-danger mb-1">({stats.pendingAppointments.change})</p>
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
