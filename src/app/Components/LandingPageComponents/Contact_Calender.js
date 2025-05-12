'use client';
import React, { useState } from 'react';
import 'react-time-picker/dist/TimePicker.css';
import MiniCalendar from './MiniCalendar';

// Dynamically import TimePicker component with SSR disabled
import dynamic from 'next/dynamic';

const TimePicker = dynamic(() => import('react-time-picker'), { ssr: false });

const Contact_Calender = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    details: '',
    date: '',
    time: '',
  });

  const availableDates = ['2025-05-10', '2025-05-14', '2025-05-18', '2025-05-22'];
  
  // Example time slots
  const availableTimeSlots = {
    '2025-05-10': [
      { start: '09:00 AM', end: '10:00 AM' },
      { start: '10:00 AM', end: '11:00 AM' },
      { start: '11:00 AM', end: '12:00 PM' },
    ],
    '2025-05-14': [
      { start: '02:00 PM', end: '03:00 PM' },
      { start: '03:00 PM', end: '04:00 PM' },
    ],
    '2025-05-18': [
      { start: '12:00 PM', end: '01:00 PM' },
      { start: '01:00 PM', end: '02:00 PM' },
    ],
    '2025-05-22': [
      { start: '04:00 PM', end: '05:00 PM' },
      { start: '05:00 PM', end: '06:00 PM' },
    ],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (date) => {
    setFormData({ ...formData, date });
  };

  const handleTimeSelect = (timeSlot) => {
    setFormData({ ...formData, time: timeSlot });
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
              <div className="card-body contact" style={{ maxHeight: '39.25rem' }}>
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
                    <label className="form-label" htmlFor="date">Choose a Date</label>
                    <select
                      className="form-control form-control-sm"
                      name="date"
                      value={formData.date}
                      onChange={(e) => handleDateSelect(e.target.value)}
                    >
                      <option value="">Select a date</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.date && (
                    <div className="mb-2">
                      <label className="form-label" htmlFor="time">Choose a Time Slot</label>
                      <div className="list-group">
                        {availableTimeSlots[formData.date]?.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            className="list-group-item list-group-item-action"
                            onClick={() => handleTimeSelect(`${slot.start} - ${slot.end}`)}
                          >
                            {slot.start} - {slot.end}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
