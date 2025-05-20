'use client';
import React, { useEffect, useState } from 'react';
import validator from 'validator';

export default function AppointmentForm({
  plans,
  slotMaxTime,
  slotEndTime,
  setSlotStartTime,
  setSlotEndTime,
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
  const [timeOptions, setTimeOptions] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('');
 const [appointments, setAppointments] = useState([]);
 const [timeSlots, setTimeSlots] = useState([]);



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

  // When date changes, update date in formData and reset time selection
 useEffect(() => {
  // Validate empty form fields on mount or when the form becomes visible/opened
  const initialErrors = validate();
  setErrors({});
}, [formData]);
useEffect(() => {
  if (!addAppointment && selectedAppointment) {
    // Editing an existing appointment
    setFormData({
      firstName: selectedAppointment.firstName || '',
      lastName: selectedAppointment.lastName || '',
      email: selectedAppointment.email || '',
      phoneNumber: selectedAppointment.phoneNumber || '',
      details: selectedAppointment.details || '',
      appointmentDate: selectedAppointment.appointmentDate || '',
      appointmentTime: selectedAppointment.appointmentTime || '',
      plan: selectedAppointment.plan || '',
      amount: selectedAppointment.amount || '',
      duration: selectedAppointment.duration || '',
    });
  } else if (addAppointment) {
    // Creating a new appointment, reset the form
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


  // When time slot clicked
  const handleTimeChange = (time) => {
    setFormData((prev) => ({
      ...prev,
      appointmentTime: time,
    }));
  };

  // When user selects a plan, update plan details
  const handlePlanChange = (e) => {
    const selectedPlan = plans.find((plan) => plan.planName === e.target.value);
    if (selectedPlan) {
      setFormData((prev) => ({
        ...prev,
        plan: selectedPlan.planName,
        amount: selectedPlan.planPrice,
        duration: selectedPlan.planDuration,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        plan: '',
        amount: '',
        duration: '',
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 const handleTimeSelect = (timeSlot) => {
    setFormData({ ...formData, appointmentTime: timeSlot });
  };
  // Form submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setErrors({});

  try {
    const response = await fetch('http://localhost:5056/api/CustomerAppointment/CreateAppointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Optional: Show error modal here
      const errorModal = new bootstrap.Modal(document.getElementById('failureModal'));
      errorModal.show();
      return;
    }

    const newAppointment = await response.json();

    setAppointments((prev) => [...prev, newAppointment]);

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      details: '',
      appointmentDate: '',  // yyyy-mm-dd format from input
      appointmentTime: '',
      plan: '',
      amount: '',
      duration: '',
    });

    setAddAppointment(false);

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

  } catch (error) {
    console.error('Error creating appointment:', error);
    const errorModal = new bootstrap.Modal(document.getElementById('failureModal'));
    errorModal.show();
  }
};

 

  // then format it when needed for display.
  const handleDateSelect = (e) => {
    const selectedDate = e.target.value; // this is in yyyy-mm-dd format
    // Optional: block past dates
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate < today) {
      alert("Please select a future date.");
      return;
    }
    // Save the raw date string (or format it later for display)
    setFormData({ ...formData, appointmentDate: selectedDate, appointmentTime: '' });
    // Optionally, fetch booked slots for this date & plan from your backend
    // For demo, we'll clear bookedTimeSlots here
    setBookedTimeSlots([]);
  };

  // Format a date in dd-mm-yyyy for display purposes
  const formatDateDisplay = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Generate time slots based on plan duration.
const generateTimeSlots = (durationInMinutes) => {
  const slots = [];

  if (!slotMaxTime || !slotEndTime) return slots; // Ensure values exist

  let start = new Date(slotMaxTime); // Start of working hours
  const end = new Date(slotEndTime); // End of working hours

  while (start < end) {
    let slotStart = new Date(start);
    let slotEnd = new Date(slotStart.getTime() + durationInMinutes * 60000);
    if (slotEnd > end) break;

    const slotString = `${formatTime(slotStart)} - ${formatTime(slotEnd)}`;

    if (!bookedTimeSlots.includes(slotString)) {
      slots.push({
        start: formatTime(slotStart),
        end: formatTime(slotEnd),
        slotString,
      });
    }

    start = slotEnd;
  }

  return slots;
};



  // Helper function to format time in hh:mm AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

    

    useEffect(() => {

  const hour = parseInt(startHour);
  const minute = parseInt(startMinute);
  let actualHour = startPeriod === "PM" && hour !== 12 ? hour + 12 : hour;
  actualHour = startPeriod === "AM" && hour === 12 ? 0 : actualHour;

  const date = new Date();
  date.setHours(actualHour);
  date.setMinutes(minute);
  date.setSeconds(0);
  setSlotStartTime(date);
}, [startHour, startMinute, startPeriod]);

useEffect(() => {

  console.log("selectedappointment",selectedAppointment)
  const hour = parseInt(endHour);
  const minute = parseInt(endMinute);
  let actualHour = endPeriod === "PM" && hour !== 12 ? hour + 12 : hour;
  actualHour = endPeriod === "AM" && hour === 12 ? 0 : actualHour;

  const date = new Date();
  date.setHours(actualHour);
  date.setMinutes(minute);
  date.setSeconds(0);
  setSlotEndTime(date);
}, [endHour, endMinute, endPeriod]);

const getBookedTimeSlots = (date) => {
  const selectedDateStr = new Date(date).toDateString();

  return appointments
    .filter(app => new Date(app.appointmentDate).toDateString() === selectedDateStr)
    .map(app => {
      const start = new Date(app.appointmentDate);
      const end = new Date(app.endTime); // if you have an endTime, otherwise calculate from duration
      return { start, end };
    });
};

useEffect(() => {
  if (formData.appointmentDate && formData.duration) {
    const slots = generateTimeSlots(Number(formData.duration));
    setTimeSlots(slots);
  } else {
    setTimeSlots([]);
  }
}, [formData.appointmentDate, formData.duration, bookedTimeSlots]);

useEffect(() => {
  if (formData.appointmentDate && formData.plan) {
    fetch(`http://localhost:5056/api/CustomerAppointment/GetBookedSlots?date=${formData.appointmentDate}&plan=${formData.plan}`)
      .then(res => res.json())
      .then(data => setBookedTimeSlots(data)) // data should be an array of slot strings
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
        value= {formData.firstName}
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

 { addAppointment && formData.appointmentDate && timeSlots.length > 0 && (
  <div className="mb-3">
    <label className="form-label">Choose a Time</label>
    <div className="d-flex flex-wrap gap-2">
      { timeSlots.map(({ slotString }, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => handleTimeChange(slotString)}
          className={`btn btn-sm ${
            formData.appointmentTime === slotString ? 'btn-primary' : 'btn-outline-primary'
          }`}
        >
          {slotString}
        </button>
      ))}
    </div>
    {errors.appointmentTime && (
      <div className="text-danger small mt-1">{errors.appointmentTime}</div>
    )}
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
  <button type="submit" className="btn btn-success w-100 mb-3" onClick={() => setAddAppointment(false)}>
    Add Appointment
  </button>
)}

  {paymentStatus && <div className="alert alert-info">{paymentStatus}</div>}
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
