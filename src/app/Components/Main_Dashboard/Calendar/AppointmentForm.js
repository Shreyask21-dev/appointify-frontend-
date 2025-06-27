'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import validator from 'validator';

export default function AppointmentForm({
  plans,
  startHour,
  startMinute,
  startPeriod,
  endHour,
  endMinute,
  endPeriod,
  selectedAppointment,
  addAppointment,
  setAddAppointment
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    details: '',
    appointmentDate: '',
    appointmentTime: '',
    plan: '',
    amount: '',
    duration: '',
  });

  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [slotStartTime, setSlotStartTime] = useState(null);
  const [slotEndTime, setSlotEndTime] = useState(null);
  const [workSession, setWorkSession] = useState([]);

  // Prefill form when editing
  useEffect(() => {
    if (!addAppointment && selectedAppointment) {
      setFormData({ ...selectedAppointment });
    } else if (addAppointment) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        details: '',
        appointmentDate: '',
        appointmentTime: '',
        plan: '',
        amount: '',
        duration: '',
      });
    }
  }, [selectedAppointment, addAppointment]);

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };


  function timeStringToMinutes(timeStr) {
    // Convert "10:00:00" 24h format to total minutes
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function isOverlapping(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('https://appointify.coinagesoft.com/api/WorkSession');
        if (response.data && response.data.length > 0 && formData.duration) {
          const session = response.data[0];

          const start = parseTime(session.workStartTime);
          const end = parseTime(session.workEndTime);

          // Convert to number just in case
          const durationInMinutes = Number(formData.duration);

          const slots = generateTimeSlots(start, end, durationInMinutes);
          setTimeSlots(slots);
        }
      } catch (err) {
        console.error("Failed to load session data", err);
        setError("Unable to load work session data.");
      }
    };

    fetchSession();
  }, [formData.duration]); // 👈 re-run when plan duration changes



  // Generate time slots based on plan duration.
  // Assumes slots between 10:00 AM and 10:00 PM.
  const generateTimeSlots = (startTime, endTime, durationInMinutes) => {
    const slots = [];
    const booked = bookedTimeSlots.map(slot => slot.time);

    const start = new Date(startTime);
    const end = new Date(endTime);

    while (start.getTime() + durationInMinutes * 60000 <= end.getTime()) {
      const slotEnd = new Date(start.getTime() + durationInMinutes * 60000);
      const slot = `${formatTime(start)} - ${formatTime(slotEnd)}`;

      if (!booked.includes(slot)) {
        slots.push({ label: slot, value: slot });
      }

      // Move to the next slot
      start.setTime(start.getTime() + durationInMinutes * 60000);
    }
    console.log("slots", slots)
    return slots;
  };






  // Helper function to format time in hh:mm AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 to 12 for 12 AM

    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };


  const handleTimeSelect = (timeSlot) => {
    setFormData({ ...formData, appointmentTime: timeSlot });
  };

  const handlePlanChange = (e) => {
    const selectedPlan = plans.find(p => p.planName === e.target.value);
    if (selectedPlan) {
      setFormData(prev => ({
        ...prev,
        plan: selectedPlan.planName,
        amount: selectedPlan.planPrice,
        duration: selectedPlan.planDuration,
        appointmentTime: '' // clear previous time
      }));
    }
  };

  const handleDateSelect = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate < today) {
      alert("Please select a future date.");
      return;
    }
    setFormData(prev => ({ ...prev, appointmentDate: selectedDate, appointmentTime: '' }));
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!validator.isEmail(formData.email)) errs.email = 'Invalid email';
    if (!formData.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) errs.phoneNumber = 'Must be 10 digits';
    if (!formData.plan) errs.plan = 'Plan is required';
    if (!formData.amount) errs.amount = 'Amount is required';
    if (!formData.duration) errs.duration = 'Duration is required';
    if (!formData.appointmentDate) errs.appointmentDate = 'Date is required';
    if (!formData.appointmentTime) errs.appointmentTime = 'Time is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch('https://appointify.coinagesoft.com/api/CustomerAppointment/CreateAppointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log("res", JSON.stringify(formData))
      if (!res.ok) {
        new bootstrap.Modal(document.getElementById('failureModal')).show();
        console.log("Appointment not booked", res)
        return;
      }

      const newAppointment = await res.json();
      setAppointments(prev => [...prev, newAppointment]);

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        details: '',
        appointmentDate: '',
        appointmentTime: '',
        plan: '',
        amount: '',
        duration: '',
      });

      new bootstrap.Modal(document.getElementById('successModal')).show();
    } catch (err) {
      console.error('Error:', err);
      new bootstrap.Modal(document.getElementById('failureModal')).show();
    }
  };

  useEffect(() => {
    if (formData.appointmentDate && formData.plan) {
      fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/GetBookedSlots?date=${formData.appointmentDate}`)
        .then(res => res.json())
        .then((data) => {
          setBookedTimeSlots(data)
          console.log("booked slots", data)
        }) // data should be an array of slot strings
        .catch(err => console.error("Error fetching booked slots:", err));
    }
  }, [formData.appointmentDate, formData.plan]);

  return (
    <>
      <form onSubmit={handleSubmit} className="container py-3" style={{ maxWidth: 600 }}>
        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          <div className="col-sm-6">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="plan" className="form-label">
            Plan
          </label>
          <select
            id="plan"
            name="plan"
            className={`form-select ${errors.plan ? 'is-invalid' : ''}`}
            value={formData.plan}
            onChange={handlePlanChange}
          >
            <option value="">Select a Plan</option>
            {plans.map((p, i) => (
              <option key={i} value={p.planName}>
                {p.planName}
              </option>
            ))}
          </select>
          {errors.plan && <div className="invalid-feedback">{errors.plan}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
            value={formData.amount}
            readOnly
            placeholder="Auto-calculated amount"
          />
          {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="appointmentDate" className="form-label">
            Choose a Date
          </label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            className={`form-control form-control-sm ${errors.appointmentDate ? 'is-invalid' : ''}`}
            value={formData.appointmentDate}
            onChange={handleDateSelect}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.appointmentDate && <div className="invalid-feedback">{errors.appointmentDate}</div>}
        </div>

        {addAppointment && formData.appointmentDate && (
          <div className="mb-3">
            <label className="form-label">Available Time Slots</label>
            {timeSlots.length === 0 ? (
              <p>No slots available</p>
            ) : (
              <div>
                {timeSlots.length === 0 ? (
                  <p>No slots available</p>
                ) : (
                  <div className="d-flex flex-wrap gap-3">
                    {timeSlots.map(({ value }, index) => {
                      // Parse current slot start/end time using your parseTime function
                      const [startStr, endStr] = value.split('-').map(s => s.trim());
                      const start = parseTime(startStr);
                      const end = parseTime(endStr);

                      // Check overlapping with any booked slot (parse booked start/end to Date too)
                      const isBooked = Array.isArray(bookedTimeSlots) && bookedTimeSlots.some(slot => {
                        const bookedStart = new Date();
                        const [bStartH, bStartM, bStartS] = slot.startTime.split(':').map(Number);
                        bookedStart.setHours(bStartH, bStartM, bStartS, 0);

                        const bookedEnd = new Date();
                        const [bEndH, bEndM, bEndS] = slot.endTime.split(':').map(Number);
                        bookedEnd.setHours(bEndH, bEndM, bEndS, 0);

                        return isOverlapping(start, end, bookedStart, bookedEnd) && slot.status === "Scheduled";
                      });

                      const isSelected = formData.appointmentTime === value;

                      return (
                        <div key={index}>
                          <button
                            type="button"
                            className={`btn btn-sm w-100 text-truncate px-1 py-1 h-100 
          ${isBooked ? 'bg-danger text-white' : isSelected ? 'bg-primary text-white' : 'btn-outline-primary'}`}
                            style={{
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: isBooked ? 'not-allowed' : 'pointer',
                              pointerEvents: isBooked ? 'none' : 'auto',
                              border: isSelected ? '1px solid #0d6efd' : undefined,
                            }}
                            disabled={isBooked}
                            onClick={() => !isBooked && handleTimeSelect(value)}
                          >
                            {value}
                          </button>
                        </div>
                      );
                    })}



                  </div>

                )}

              </div>
            )}
            {errors.appointmentTime && <div className="text-danger">{errors.appointmentTime}</div>}
          </div>
        )}


        {/* 👇 Display selected time */}
        {formData.appointmentTime && (
          <div className="my-2 btn btn-sm btn-primary">
            Selected Time: {formData.appointmentTime}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            Duration (minutes)
          </label>
          <input
            id="duration"
            name="duration"
            className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
            value={formData.duration}
            readOnly
            placeholder="Duration will be set automatically"
          />
          {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="details" className="form-label">
            Additional Details
          </label>
          <textarea
            id="details"
            name="details"
            className="form-control"
            rows={3}
            value={formData.details}
            onChange={handleInputChange}
            placeholder="Add any notes or details (optional)"
          />
        </div>

        {/* {addAppointment `<button type="submit" className="btn btn-success w-100 mb-3">
    Book Appointment 
  </button> `} */}
        {addAppointment && (
          <button type="submit" className="btn btn-success w-100 mb-3" >
            Add Appointment
          </button>
        )}

      </form>

      <div className="modal fade" id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h5 className="modal-title w-100" id="successModalLabel">Appointment Booked</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Your appointment has been successfully booked.
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
