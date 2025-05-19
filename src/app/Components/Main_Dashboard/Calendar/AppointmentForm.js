'use client';
import React, { useEffect, useState } from 'react';
import validator from 'validator';

export default function AppointmentForm({
  plans,
  slotStartTime,
  slotEndTime,
  setSlotStartTime,
  setSlotEndTime,
  startHour,
  startMinute,
  startPeriod,
  endHour,
  endMinute,
  endPeriod
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
        alert('Failed to book the appointment.');
        return;
      }

      const appointment = await response.json();

      // Razorpay payment options
      const razorpayOptions = {
        key: 'rzp_test_G5ZTKDD6ejrInm',
        amount: appointment.amount, // Amount in paise
        currency: 'INR',
        name: 'Consultation Appointment',
        description: 'Book your appointment',
        order_id: appointment.orderId,
        handler: function (response) {
          verifyPayment(appointment.appointmentId, response);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new window.Razorpay(razorpayOptions);
      rzp1.open();
    } catch (error) {
      alert('An error occurred while booking the appointment.');
      console.error(error);
    }
  };

  // Verify payment status and update UI accordingly
  const verifyPayment = async (appointmentId, paymentResponse) => {
    try {
      const response = await fetch('http://localhost:5056/api/CustomerAppointment/VerifyPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          AppointmentId: appointmentId,
          PaymentId: paymentResponse.razorpay_payment_id,
          OrderId: paymentResponse.razorpay_order_id,
          Signature: paymentResponse.razorpay_signature,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.Message || 'Payment verified successfully.');

        // Reset form and payment status success
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
       setPaymentStatus('Payment successful! Thank you.');
        setErrors({});
      } else {
        alert('Payment verification failed.');
        setPaymentStatus('failure');
      }
    } catch (error) {
      alert('An error occurred while verifying the payment.');
      setPaymentStatus(`Payment failed: ${error.message}`);
      console.error(error);
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
  let start = new Date();
  start.setHours(10, 0, 0, 0);
  const end = new Date();
  end.setHours(22, 0, 0, 0);

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

 const timeSlots = (formData.appointmentDate && formData.duration)
    ? generateTimeSlots(Number(formData.duration))
    : [];
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

  {formData.appointmentDate && timeSlots.length > 0 && (
    <div className="mb-3">
      <label className="form-label">Choose a Time</label>
      <div className="d-flex flex-wrap gap-2">
        {timeSlots.map(({ slotString }, idx) => (
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

  <button type="submit" className="btn btn-success w-100 mb-3">
    Pay Now {formData.amount ? `₹${formData.amount}` : ''}
  </button>

  {paymentStatus && <div className="alert alert-info">{paymentStatus}</div>}
</form>

    </>
  );
}
