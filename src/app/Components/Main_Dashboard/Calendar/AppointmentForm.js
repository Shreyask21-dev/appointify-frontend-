'use client';
import React, { useEffect, useState } from 'react';
import validator from 'validator';

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

// const plans = [
//   { name: 'Basic Plan', price: 500, duration: '30 mins' },
//   { name: 'Premium Plan', price: 1000, duration: '1 hour' },
// ];

export default function AppointmentForm({ plans }) {
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
    useEffect(() => {

        console.log("plans", plans)
    }, [])

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

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            appointmentDate: date,
            appointmentTime: '',
        });
        setTimeOptions(availableTimeSlots[date] || []);
    };

    const handleTimeChange = (time) => {
        setFormData({
            ...formData,
            appointmentTime: time,
        });
    };

    const handlePlanChange = (e) => {
        const selectedPlan = plans.find((plan) => plan.planName === e.target.value);
        if (selectedPlan) {
            setFormData({
                ...formData,
                plan: selectedPlan.planName,
                amount: selectedPlan.planPrice,
                duration: selectedPlan.planDuration,
            });
        } else {
            setFormData({
                ...formData,
                plan: '',
                amount: '',
                duration: '',
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setErrors({}); // Clear previous errors

        try {
            const response = await fetch('http://localhost:5056/api/CustomerAppointment/CreateAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Appointment request sent:', formData);

            if (response.ok) {
                const appointment = await response.json();
                console.log('Appointment created:', appointment);

                // Configure Razorpay payment
                const razorpayOptions = {
                    key: 'rzp_test_G5ZTKDD6ejrInm',
                    amount: appointment.amount, // Amount in paise
                    currency: 'INR',
                    name: 'Consultation Appointment',
                    description: 'Book your appointment',
                    order_id: appointment.orderId, // From backend
                    handler: function (response) {
                        console.log('Payment success:', response);
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
            } else {
                console.error('Failed to create appointment:', response.status);
                alert('Failed to book the appointment.');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('An error occurred while booking the appointment.');
        }
    };

    const verifyPayment = async (appointmentId, paymentResponse) => {
        try {
            const response = await fetch('http://localhost:5056/api/CustomerAppointment/VerifyPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    AppointmentId: appointmentId,
                    PaymentId: paymentResponse.razorpay_payment_id,
                    OrderId: paymentResponse.razorpay_order_id,
                    Signature: paymentResponse.razorpay_signature,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Payment Verification Result:', result);
                alert(result.Message || 'Payment verified successfully.');

                // Clear the form on successful verification
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

                setErrors({});
            } else {
                const errorText = await response.text();
                console.error('Verification failed:', errorText);
                alert('Payment verification failed.');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('An error occurred while verifying the payment.');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label>First Name</label>
                    <input
                        className="form-control"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                </div>

                <div className="mb-2">
                    <label>Last Name</label>
                    <input
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                    {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                </div>

                <div className="mb-2">
                    <label>Email</label>
                    <input
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>

                <div className="mb-2">
                    <label>Phone Number</label>
                    <input
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                    />
                    {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                </div>

                <div className="mb-2">
                    <label>Plan</label>
                    <select
                        className="form-select"
                        value={formData.planName}
                        onChange={handlePlanChange}
                        name="plan"
                    >
                        <option value="">Select a Plan</option>
                        {plans.map((p, i) => (
                            <option key={i} value={p.planName}>
                                {p.planName}
                            </option>
                        ))}
                    </select>
                    {errors.plan && <small className="text-danger">{errors.plan}</small>}
                </div>

                <div className="mb-2">
                    <label>Amount</label>
                    <input className="form-control" name="amount" value={formData.amount} readOnly />
                    {errors.amount && <small className="text-danger">{errors.amount}</small>}
                </div>

                <div className="mb-2">
                    <label>Duration</label>
                    <input className="form-control" name="duration" value={formData.duration} readOnly />
                    {errors.duration && <small className="text-danger">{errors.duration}</small>}
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="appointmentDate">Choose a Date</label>
                    <select
                        className="form-control form-control-sm"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                    >
                        <option value="">Select a date</option>
                        {Object.keys(availableTimeSlots).map((date) => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>
                    {errors.appointmentDate && <div className="text-danger small mt-1">{errors.appointmentDate}</div>}
                </div>
                {formData.appointmentDate && (
                    <div className="mb-2">
                        <label className="form-label" htmlFor="appointmentTime">Choose a Time Slot</label>
                        <div className="list-group">
                            {timeOptions.map((slot, index) => {
                                const slotLabel = `${slot.start} - ${slot.end}`;
                                const isSelected = formData.appointmentTime === slotLabel;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`list-group-item list-group-item-action ${isSelected ? 'active' : ''}`}
                                        onClick={() => handleTimeChange(slotLabel)}
                                    >
                                        {slotLabel}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.appointmentTime && <div className="text-danger small mt-1">{errors.appointmentTime}</div>}
                    </div>
                )}


                <div className="mb-2">
                    <label>Additional Details (Optional)</label>
                    <textarea
                        className="form-control"
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-2">Book Appointment</button>
            </form>

            {paymentStatus === 'success' && (
                <div className="alert alert-success mt-3">
                    ✅ Payment verified and appointment booked successfully!
                </div>
            )}
            {paymentStatus === 'failure' && (
                <div className="alert alert-danger mt-3">
                    ❌ Payment verification failed. Please try again.
                </div>
            )}
        </>
    );
}
