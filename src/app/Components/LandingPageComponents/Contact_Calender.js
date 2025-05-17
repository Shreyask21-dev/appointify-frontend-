'use client';
import React, { forwardRef, useEffect, useState } from 'react';
import 'react-time-picker/dist/TimePicker.css';
import MiniCalendar from './MiniCalendar';

// Dynamically import TimePicker component with SSR disabled
import dynamic from 'next/dynamic';

const TimePicker = dynamic(() => import('react-time-picker'), { ssr: false });

const Contact_Calender = forwardRef((props, ref) => {
  const [formErrors, setFormErrors] = useState({});
  const [loadingPayment, setLoadingPayment] = useState(false);


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    details: '',
    appointmentDate: '',
    appointmentTime: '',
    plan: '', // 👉 New field
    amount: '',     // 👈 New
    duration: '',
  });
  const validateForm = () => {
    const errors = {};

    // First Name
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last Name
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone Number
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }


    // Appointment Date
    if (!formData.appointmentDate) {
      errors.appointmentDate = 'Please select a date';
    }

    // Appointment Time
    if (!formData.appointmentTime) {
      errors.appointmentTime = 'Please select a time slot';
    }

    // Plan
    if (!formData.plan.trim()) {
      errors.plan = 'Plan is required';
    }

    // Amount
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(formData.amount)) {
      errors.amount = 'Amount must be a number';
    } else if (Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    // Duration
    if (!formData.duration.trim()) {
      errors.duration = 'Duration is required';
    }

    return errors;
  };

  useEffect(() => {
    if (props.prefillData) {
      setFormData((prev) => ({
        ...prev,
        plan: props.prefillData.planName || '',
        amount: props.prefillData.planPrice || '',
        duration: props.prefillData.planDuration || '',
      }));
    }
  }, [props.prefillData]);
const showModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  }
};

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

  const handleDateSelect = (appointmentDate) => {
    setFormData({ ...formData, appointmentDate });
  };

  const handleTimeSelect = (timeSlot) => {
    setFormData({ ...formData, appointmentTime: timeSlot });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({}); // Clear previous errors
    try {
      // Send the form data to the backend to create an appointment
      const response = await fetch('http://localhost:5056/api/CustomerAppointment/CreateAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)

        // Send the data as JSON
      });
      console.log('Appointment created:', JSON.stringify(formData));

      if (response.ok) {
        const appointment = await response.json();
        console.log('Appointment created:', JSON.stringify(formData));

        // Proceed with Razorpay payment
        const razorpayOptions = {
          key: 'rzp_test_G5ZTKDD6ejrInm',
          amount: appointment.amount, // Convert to paise
          currency: 'INR',
          name: 'Consultation Appointment',
          description: 'Book your appointment',
          order_id: appointment.orderId,
          handler: function (response) {
            console.log('Payment success:', response);
            // Call the backend API to verify payment
            verifyPayment(appointment.appointmentId, response);
          },
          prefill: {
            name: formData.firstName + ' ' + formData.lastName,
            email: formData.email,
            contact: formData.phoneNumber,
          },
        };
        const rzp1 = new window.Razorpay(razorpayOptions);
        setLoadingPayment(true);
        rzp1.on('payment.failed', function () {
          setLoadingPayment(false); 
          showModal('failureModal');// Hide if payment fails
        });
        rzp1.open(); // Open Razorpay payment window

        setTimeout(() => {
          setLoadingPayment(false);
        }, 3000);
      } else {
        console.log("response", response, "formData", formData)
        alert('Failed to book the appointment.');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('An error occurred while booking the appointment.');
    }
  };

  // Function to verify payment on the backend
  const verifyPayment = async (appointmentId, paymentResponse) => {
    try {
      const response = await fetch('http://localhost:5056/api/CustomerAppointment/VerifyPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AppointmentId: appointmentId, // PascalCase
          PaymentId: paymentResponse.razorpay_payment_id,
          OrderId: paymentResponse.razorpay_order_id ,
          Signature: paymentResponse.razorpay_signature,// ensure orderId passed
        }),
      });

      console.log("VerifyPayment", response)
      if (response.ok) {
        const result = await response.json();
        console.log('Payment Verification Result:', result);
       showModal('successModal');

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

        setFormErrors({});
      } else {
        const errorText = await response.text();
        console.error('Verification failed:', errorText);
        showModal('failureModal');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);

      
      alert('An error occurred while verifying the payment.');
    }
    setTimeout(() => {
  const modalElement = document.getElementById('successModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
}, 3000);
  };


  return (
    <>
    {loadingPayment && (
  <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 9999 }}>
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Processing payment...</span>
    </div>
  </div>
)}

    <div className="bg-light mt-8 ">
      <div className="container row content-space-2 content-space-lg-3 mx-auto" id="target-form">
        <div className="col-lg-6 col-12 mb-sm-8">
          <div className="mx-auto" style={{ maxWidth: '35rem' }}>
            <div className="card" ref={ref}>
              <div className="card-body contact" style={{ maxHeight: '45.25rem', minHeight: '35.25rem' }}>
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
                          className={`form-control form-control-sm ${formErrors.firstName ? 'border border-danger' : ''}`}
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && <div className="text-danger small">{formErrors.firstName}</div>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${formErrors.lastName ? 'border border-danger' : ''}`}
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && <div className="text-danger small">{formErrors.lastName}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row gx-2">
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                          type="email"
                          className={`form-control form-control-sm ${formErrors.email ? 'border border-danger' : ''}`}
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && <div className="text-danger small">{formErrors.email}</div>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="phoneNumber">Phone</label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${formErrors.phoneNumber ? 'border border-danger' : ''}`}
                          name="phoneNumber"
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                        {formErrors.phoneNumber && <div className="text-danger small">{formErrors.phoneNumber}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row gx-2">
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="appointmentDate">Choose a Date</label>
                        <select
                          className="form-control form-control-sm"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={(e) => handleDateSelect(e.target.value)}
                        >
                          <option value="">Select a date</option>
                          {availableDates.map((appointmentDate) => (
                            <option key={appointmentDate} value={appointmentDate}>
                              {appointmentDate}
                            </option>
                          ))}
                        </select>
                        {formErrors.appointmentDate && (
                          <div className="text-danger small mt-1">{formErrors.appointmentDate}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="plan">Plan Name</label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${formErrors.plan ? 'border border-danger' : ''}`}
                          name="plan"
                          id="plan"
                          value={formData.plan || ''}
                          readOnly
                          placeholder="Auto-filled"
                        />
                        {formErrors.plan && <div className="text-danger small">{formErrors.plan}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row gx-2">
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="amount">Plan Price</label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${formErrors.amount ? 'border border-danger' : ''}`}
                          name="amount"
                          id="amount"
                          value={formData.amount}
                          readOnly
                          placeholder="Auto-filled"
                        />
                        {formErrors.price && <div className="text-danger small">{formErrors.price}</div>}
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label className="form-label" htmlFor="duration">Plan Duration</label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${formErrors.duration ? 'border border-danger' : ''}`}
                          name="duration"
                          id="duration"
                          value={formData.duration}
                          readOnly
                          placeholder="Auto-filled"
                        />
                        {formErrors.duration && <div className="text-danger small">{formErrors.duration}</div>}
                      </div>
                    </div>
                  </div>

                  {formData.appointmentDate && (
                    <div className="mb-2">
                      <label className="form-label" htmlFor="appointmentTime">Choose a Time Slot</label>
                      <div className="list-group">
                        {availableTimeSlots[formData.appointmentDate]?.map((slot, index) => (
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
                      {formErrors.appointmentTime && (
                        <div className="text-danger small mt-1">{formErrors.appointmentTime}</div>
                      )}
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
                      placeholder="Additional notes or questions..."
                    ></textarea>
                  </div>

                  <div className="d-grid mb-2">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={loadingPayment}>
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

        <div className="col-lg-6 col-12 mt-md-5">
          <MiniCalendar />
        </div>
      </div>
    </div>
    {/* Success Modal */}
<div className="modal fade" id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header bg-success text-white">
        <h5 className="modal-title" id="successModalLabel">Payment Successful</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Your appointment has been booked and payment was successful!
      </div>
    </div>
  </div>
</div>

{/* Failure Modal */}
<div className="modal fade" id="failureModal" tabIndex="-1" aria-labelledby="failureModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header bg-danger text-white">
        <h5 className="modal-title" id="failureModalLabel">Payment Failed</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Oops! Something went wrong during the payment. Please try again.
      </div>
    </div>
  </div>
</div>

    </>
  );
});

export default Contact_Calender;
