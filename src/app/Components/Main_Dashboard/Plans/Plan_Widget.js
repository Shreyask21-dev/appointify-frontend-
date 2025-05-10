'use client';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const dummyStats = [
  {
    label: 'Total Plans',
    value: 3,
    iconClass: 'fas fa-folder',
    color: 'primary',
    description: 'All available plans',
  },
  {
    label: 'Active Plans',
    value: 3,
    iconClass: 'fas fa-check-circle',
    color: 'success',
    description: 'Currently active',
  },
  {
    label: 'Inactive Plans',
    value: 0,
    iconClass: 'fas fa-pause-circle',
    color: 'warning',
    description: 'Not in use',
  },
];

const Plan_Widget = () => {
  return (
    <div className="row g-4 mb-4">
      {dummyStats.map((stat, index) => (
        <div className="col-sm-6 col-xl-4" key={index}>
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="me-2">
                  <p className="text-heading mb-1">{stat.label}</p>
                  <h4 className="mb-1">{stat.value.toLocaleString()}</h4>
                  <small className="text-muted">{stat.description}</small>
                </div>
                <div className="avatar">
                  <div className={`avatar-initial bg-label-${stat.color} rounded-3`}>
                    <i className={`${stat.iconClass} fs-4`}></i>
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

export default Plan_Widget;
