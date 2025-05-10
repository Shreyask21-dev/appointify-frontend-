'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faCheckDouble,
  faBan,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

const AppointmentWidgets = () => {
  const widgetData = [
    {
      count: 56,
      change: '+10%',
      label: 'Upcoming Appointments',
      subLabel: 'Scheduled visits',
      icon: faCalendarAlt,
      color: 'primary',
       height:'50px'
    },
    {
      count: 12,
      change: '+5%',
      label: 'Completed Appointments',
      subLabel: 'Finished successfully',
      icon: faCheckDouble,
      color: 'success',
    },
    {
      count: 124,
      change: '-8%',
      label: 'Cancelled Appointments',
      subLabel: 'Cancelled by users',
      icon: faBan,
      color: 'danger',
    },
    {
      count: 32,
      change: '-3%',
      label: 'Failed Transactions',
      subLabel: 'Payment issues',
      icon: faExclamationTriangle,
      color: 'warning',
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {widgetData.map((widget, index) => (
        <div className="col-sm-6 col-xl-3" key={index}>
          <div className="card">
            <div className="card-body " style={{height:'150px'}}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="me-2">
                  <p className="text-heading mb-1">{widget.label}</p>
                  <div className="d-flex align-items-center mb-2">
                    <h4 className="mb-0 me-2">{widget.count.toLocaleString()}</h4>
                    <p className={`mb-0 text-${widget.color}`}>
                      ({widget.change})
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
