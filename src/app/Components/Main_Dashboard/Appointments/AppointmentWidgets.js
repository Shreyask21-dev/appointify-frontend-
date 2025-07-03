'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faCheckDouble,
  faBan,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
const API_URL = process.env.REACT_APP_API_URL;
const AppointmentWidgets = () => {
  const [widgetData, setWidgetData] = useState([
    // Initialize counts as zero, labels and icons stay the same
    {
      count: 0,
      change: '',
      label: 'Upcoming Appointments',
      subLabel: 'Scheduled visits',
      icon: faCalendarAlt,
      color: 'primary',
    },
    {
      count: 0,
      change: '',
      label: 'Completed Appointments',
      subLabel: 'Finished successfully',
      icon: faCheckDouble,
      color: 'success',
    },
    {
      count: 0,
      change: '',
      label: 'Cancelled Appointments',
      subLabel: 'Cancelled by users',
      icon: faBan,
      color: 'danger',
    },
    {
      count: 0,
      change: '',
      label: 'Failed Transactions',
      subLabel: 'Payment issues',
      icon: faExclamationTriangle,
      color: 'warning',
    },
  ]);

  useEffect(() => {
    fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments`) // Your API endpoint
      .then((res) => res.json())
      .then((appointments) => {
        const today = new Date();

        // Filter logic (adjust these according to your data and business rules):
        const upcomingCount = appointments.filter((appt) => {
          const apptDate = new Date(appt.appointmentDate);
          // upcoming means appointment date >= today AND status scheduled (e.g. appointmentStatus === 1 means completed, maybe 0 means scheduled?)
          // Adjust according to your status codes
          return apptDate >= today && appt.appointmentStatus === 0; 
        }).length;

        const completedCount = appointments.filter(
          (appt) => appt.appointmentStatus === 1
        ).length;

        const cancelledCount = appointments.filter(
          (appt) => appt.appointmentStatus === 2
        ).length;

        const failedCount = appointments.filter(
          (appt) => appt.paymentStatus === 2
        ).length;

        setWidgetData([
          {
            count: upcomingCount,
            change: '', // You can calculate percentage change if you want
            label: 'Upcoming Appointments',
            subLabel: 'Scheduled visits',
            icon: faCalendarAlt,
            color: 'primary',
          },
          {
            count: completedCount,
            change: '',
            label: 'Completed Appointments',
            subLabel: 'Finished successfully',
            icon: faCheckDouble,
            color: 'success',
          },
          {
            count: cancelledCount,
            change: '',
            label: 'Cancelled Appointments',
            subLabel: 'Cancelled by users',
            icon: faBan,
            color: 'danger',
          },
          {
            count: failedCount,
            change: '',
            label: 'Failed Transactions',
            subLabel: 'Payment issues',
            icon: faExclamationTriangle,
            color: 'warning',
          },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  return (
    <div className="row g-4 mb-4">
      {widgetData.map((widget, index) => (
        <div className="col-sm-6 col-xl-3" key={index}>
          <div className="card">
            <div className="card-body" style={{ height: '150px' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="me-2">
                  <p className="text-heading mb-1">{widget.label}</p>
                  <div className="d-flex align-items-center mb-2">
                    <h4 className="mb-0 me-2">{widget.count.toLocaleString()}</h4>
                    <p className={`mb-0 text-${widget.color}`}>
                      {widget.change ? `(${widget.change})` : ''}
                    </p>
                  </div>
                  <small className="text-muted">{widget.subLabel}</small>
                </div>
                <div className="avatar">
                  <div className={`avatar-initial bg-label-${widget.color} rounded-3`}>
                    <FontAwesomeIcon icon={widget.icon} size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentWidgets;
