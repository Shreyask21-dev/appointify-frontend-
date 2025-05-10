'use client';
import React, { useState } from 'react';
import MiniCalendar from './MiniCalendar';

const Contact_Calender = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    details: '',
    date: '',
  });

  const availableDates = ['2025-05-10', '2025-05-14', '2025-05-18', '2025-05-22'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5056/api/AppointmentRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const appointment = await response.json();
        console.log('Appointment created:', appointment);
        alert('Appointment booked successfully.');
      } else {
        alert('Failed to book the appointment.');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('An error occurred while booking the appointment.');
    }
  };

  return (
    <div className="bg-light mt-8">
      <div className="container row content-space-2 content-space-lg-3 mx-auto" id="target-form">
        <div className="col-lg-6 col-12">
          <div className="mx-auto" style={{ maxWidth: '35rem' }}>
            <div className="card">
              <div className="card-body contact" style={{ maxHeight: '33.25rem' }}>
                <div className="text-center mb-3">
                  <h5 className="mb-1">Tell us about yourself</h5>
                  <p className="small mb-2">Feel free to say hello or ask a question.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gx-2">
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="firstName">First name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row gx-2">
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label" htmlFor="date">Date</label>
                    <select
                      className="form-control form-control-sm"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                    >
                      <option value="">Select date</option>
                      {availableDates.map((date, index) => (
                        <option key={index} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label" htmlFor="details">Details</label>
                    <textarea
                      className="form-control form-control-sm"
                      name="details"
                      id="details"
                      rows="3"
                      value={formData.details}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="d-grid mb-2">
                    <button type="submit" className="btn btn-primary btn-sm">
                      Book Appointment
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="form-text text-muted small">We'll respond in 1–2 business days.</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-12">
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
};

export default Contact_Calender;
