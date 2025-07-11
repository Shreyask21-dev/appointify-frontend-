'use client';
import React, { forwardRef, useEffect, useState } from 'react';
import 'react-time-picker/dist/TimePicker.css';
import MiniCalendar from './MiniCalendar';
import dynamic from 'next/dynamic';
import axios from 'axios';

const TimePicker = dynamic(() => import('react-time-picker'), { ssr: false });

const Contact_Calender = React.forwardRef((props, ref) => {
  const [formErrors, setFormErrors] = useState({});
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);

  const [availablePlans, setAvailablePlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("https://appointify.coinagesoft.com/api/ConsultationPlan/get-all");
        const data = await res.json();
        // setAvailablePlans(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setAvailablePlans(data);

          // Auto-select the first plan
          const firstPlan = data[0];
          setFormData(prev => ({
            ...prev,
            plan: firstPlan.planName,
            amount: firstPlan.planPrice,
            duration: firstPlan.planDuration,
            appointmentTime: ''
          }));
        }

      } catch (err) {
        console.error("Error fetching plans", err);
      }
    };

    fetchPlans();
  }, []);


  const API_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    details: '',
    appointmentDate: '',  // will be in yyyy-mm-dd format from input type date
    appointmentTime: '',
    plan: '', // pre-filled plan name
    amount: '',     // pre-filled plan price
    duration: '',   // pre-filled plan duration as a string representing minutes (eg: "30", "60", "90")
  });

  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!formData.appointmentDate) errors.appointmentDate = 'Please select a date';
    if (!formData.appointmentTime) errors.appointmentTime = 'Please select a time slot';
    if (!formData.plan.trim()) errors.plan = 'Plan is required';
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(formData.amount)) {
      errors.amount = 'Amount must be a number';
    } else if (Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    if (!formData.duration.trim()) errors.duration = 'Duration is required';
    return errors;
  };

  // Prefill plan, amount, and duration if provided via props
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

  // Use a native date input so user can select any date
  // We'll keep the date in "yyyy-mm-dd" format from the input,
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

    setBookedTimeSlots([]);
  };

  // Format a date in dd-mm-yyyy for display purposes
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Overlap check for Date objects
  const isOverlapping = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`https://appointify.coinagesoft.com/api/WorkSession`);
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

  const generateTimeSlots = (startTime, endTime, durationInMinutes) => {
    const slots = [];

    const start = new Date(startTime);
    const end = new Date(endTime);

    while (start.getTime() + durationInMinutes * 60000 <= end.getTime()) {
      const slotEnd = new Date(start.getTime() + durationInMinutes * 60000);
      const slot = `${formatTime(start)} - ${formatTime(slotEnd)}`;

      slots.push({ label: slot, value: slot });
      start.setTime(start.getTime() + durationInMinutes * 60000);
    }

    return slots;
  };

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      // Submit appointment to backend
      const response = await fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/CreateAppointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      console.log('Appointment created:', JSON.stringify(formData));
      if (response.ok) {
        const appointment = await response.json();
        console.log('Appointment created now:', JSON.stringify(formData));
        // Razorpay integration remains unchanged
        const razorpayOptions = {
          key: 'rzp_test_G5ZTKDD6ejrInm',
          amount: appointment.amount, // Ensure amount is in paise if required
          currency: 'INR',
          name: 'Consultation Appointment',
          description: 'Book your appointment',
          order_id: appointment.orderId,
          handler: function (response) {
            console.log('Payment success:', response);
            setPaymentCompleted(true);
            verifyPayment(response);
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
          setPaymentCompleted(true);
          showModal('failureModal');
        });
        rzp1.on('modal.closed', function () {
          console.log('Razorpay modal closed');
          setLoadingPayment(false);
          if (!paymentCompleted) {
            setTimeout(() => { showModal('successModal'); }, 300);
          }
        });
        rzp1.open();
        setTimeout(() => { setLoadingPayment(false); }, 5000);
        setTimeout(() => { setPaymentCompleted(false); }, 5000);
      } else {
        console.log("response", response, "formData", formData);
        alert('Failed to book the appointment.');
        showModal('failureModal');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('An error occurred while booking the appointment.');
      showModal('failureModal');
    }
  };
  function openReceiptPdf(base64Pdf) {
    const byteCharacters = atob(base64Pdf);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank'); // open in new tab
  }
  function downloadPdf(base64Pdf) {
    const byteCharacters = atob(base64Pdf);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Appointment-Receipt.pdf`;
    link.click();
  }


  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/VerifyPayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  razorpay_order_id: paymentResponse.razorpay_order_id,
  razorpay_payment_id: paymentResponse.razorpay_payment_id,
  razorpay_signature: paymentResponse.razorpay_signature
})
        
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payment Verification Result:', data);
        if (data.success && data.receipt) {
          openReceiptPdf(data.receipt);
        } else {
          alert(data.message || 'Payment verified but no receipt.');
        }

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

  useEffect(() => {
    if (formData.appointmentDate && formData.plan) {
      axios.get("https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments")
        .then((res) => {
          const appointments = res.data || [];

        
          const bookedSlots = appointments
            .filter(a => a.appointmentDate === formData.appointmentDate)
            .map(a => a.appointmentTime); 

          setBookedTimeSlots(bookedSlots);
        })
        .catch(err => console.error("Error fetching appointments:", err));
    }
  }, [formData.appointmentDate, formData.plan]);


  return (
    <>
      {loadingPayment && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 9999 }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Processing payment...</span>
          </div>
        </div>
      )}
      <div className="bg-light mt-8">
        <div className="container row content-space-2 content-space-lg-3 mx-auto" id="target-form">
          <div className="col-lg-7 col-12 ">
            {/* <div className="mx-auto" style={{ maxWidth: '35rem' }}> */}
            <div >
              <div className="card" ref={ref}>
                <div className="card-body contact" style={{ maxHeight: '60.25rem', minHeight: '35.25rem' }}>
                  <div className="text-center mb-3">
                    <h5 className="mb-1">Book Your Appointment</h5>
                    <p className="small mb-4">Please provide your details and let us know how we can assist you.</p>
                    <hr className='bg-dark' />
                  </div>
                  <form onSubmit={handleSubmit}>
                    {/* First and Last Name */}
                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label className="form-label" htmlFor="firstName">First name</label>
                          <input type="text" className={`form-control form-control-sm ${formErrors.firstName ? 'border border-danger' : ''}`}
                            name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" />
                          {formErrors.firstName && <div className="text-danger small">{formErrors.firstName}</div>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label className="form-label" htmlFor="lastName">Last name</label>
                          <input type="text" className={`form-control form-control-sm ${formErrors.lastName ? 'border border-danger' : ''}`}
                            name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" />
                          {formErrors.lastName && <div className="text-danger small">{formErrors.lastName}</div>}
                        </div>
                      </div>
                    </div>
                    {/* Email and Phone */}
                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label className="form-label" htmlFor="email">Email</label>
                          <input type="email" className={`form-control form-control-sm ${formErrors.email ? 'border border-danger' : ''}`}
                            name="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" />
                          {formErrors.email && <div className="text-danger small">{formErrors.email}</div>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label className="form-label" htmlFor="phoneNumber">Phone</label>
                          <input type="text" className={`form-control form-control-sm ${formErrors.phoneNumber ? 'border border-danger' : ''}`}
                            name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter your phone number" />
                          {formErrors.phoneNumber && <div className="text-danger small">{formErrors.phoneNumber}</div>}
                        </div>
                      </div>
                    </div>


                    {/* Date & Time Slot */}
                    <div className="row gx-2">
                      <div className='col-sm-6'>
                        <div className="mb-2">
                          <label className="form-label" htmlFor="planDropdown">Choose a Plan</label>
                          <select
                            id="planDropdown"
                            className="form-select form-select-sm"
                            value={formData.plan}
                            onChange={(e) => {
                              const selectedPlan = availablePlans.find(p => p.planName === e.target.value);
                              if (selectedPlan) {
                                setFormData(prev => ({
                                  ...prev,
                                  plan: selectedPlan.planName,
                                  amount: selectedPlan.planPrice,
                                  duration: selectedPlan.planDuration,
                                  appointmentTime: "", // reset previously selected slot
                                }));
                              }
                            }}
                          >
                            <option value="">-- Select a Plan --</option>
                            {availablePlans.map(plan => (
                              <option key={plan.planId} value={plan.planName}>
                                {plan.planName} - ₹{plan.planPrice}
                              </option>
                            ))}
                          </select>
                          {formErrors.plan && <div className="text-danger small">{formErrors.plan}</div>}
                        </div>
                      </div>
                      <div className="col-sm-6 ">
                        <div className="mb-2">
                          <label className="form-label" htmlFor="appointmentDate">Choose a Date</label>
                          <input type="date" className={`form-control form-control-sm ${formErrors.appointmentDate ? 'border border-danger' : ''}`}
                            name="appointmentDate" id="appointmentDate" value={formData.appointmentDate} onChange={handleDateSelect} />
                          {formErrors.appointmentDate && <div className="text-danger small">{formErrors.appointmentDate}</div>}
                        </div>
                        {formData.appointmentDate && (
                          <div className="mb-2">
                            <p className="small">
                              Selected Date: {formatDateDisplay(formData.appointmentDate)}
                            </p>
                          </div>
                        )}


                      </div>

                    </div>
                    {/* Price & Duration */}
                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label className="form-label" htmlFor="amount">Plan Price</label>
                          <input type="text" className={`form-control form-control-sm ${formErrors.amount ? 'border border-danger' : ''}`}
                            name="amount" id="amount" value={formData.amount} readOnly placeholder="Auto-filled" />
                          {formErrors.price && <div className="text-danger small">{formErrors.price}</div>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label className="form-label" htmlFor="duration">Plan Duration (Minutes)</label>
                          <input type="text" className={`form-control form-control-sm ${formErrors.duration ? 'border border-danger' : ''}`}
                            name="duration" id="duration" value={formData.duration} readOnly placeholder="Auto-filled" />
                          {formErrors.duration && <div className="text-danger small">{formErrors.duration}</div>}
                        </div>
                      </div>
                    </div>
                    {/* Additional Details */}
                    <div className="mb-2">
                      <label className="form-label" htmlFor="details">Details</label>
                      <textarea className="form-control form-control-sm" name="details" id="details" rows="3"
                        value={formData.details} onChange={handleChange} placeholder="Additional notes or questions..."></textarea>
                    </div>
                    <div className="d-grid mb-2">
                      <button type="submit" className="btn btn-primary btn-sm" disabled={loadingPayment}>
                        Book Appointment
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="form-text text-muted small">We&apos;ll respond in 1–2 business days.</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-12 my-auto">
            {/* <MiniCalendar /> */}

            <MiniCalendar
              selected={formData.appointmentDate}
              duration={formData.duration}
              bookedTimeSlots={bookedTimeSlots}
              onDateChange={(date) => {
                setFormData(prev => ({
                  ...prev,
                  appointmentDate: date,
                  appointmentTime: ''
                }));
              }}
              onSlotSelect={(slot) => {
                setFormData(prev => ({
                  ...prev,
                  appointmentTime: slot
                }));
              }}
              selectedSlot={formData.appointmentTime}
            />

          </div>
        </div>
      </div>
      {/* Modals for Success, Failure, and Cancel */}
      <div className="modal fade" id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-body text-center p-5 bg-success bg-opacity-10">
              <div className="text-success mb-3">
                <i className="fas fa-check-circle fa-3x"></i>
              </div>
              <h4 className="mb-2">Appointment Confirmed!</h4>
              <p className="mb-3">Your payment was successful. We&apos;ll get in touch soon.</p>
              <button type="button" className="btn btn-outline-success" data-bs-dismiss="modal">Okay</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="failureModal" tabIndex="-1" aria-labelledby="failureModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-body text-center p-5 bg-danger bg-opacity-10">
              <div className="text-danger mb-3">
                <i className="fas fa-times-circle fa-3x"></i>
              </div>
              <h4 className="mb-2">Payment Failed</h4>
              <p className="mb-3">Something went wrong. Please try again later.</p>
              <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="cancelModal" tabIndex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h5 className="modal-title w-100" id="cancelModalLabel">Payment Cancelled</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              You cancelled the payment process. If this was a mistake, you can try again.
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Contact_Calender.displayName = "Contact_Calender";

export default Contact_Calender;
