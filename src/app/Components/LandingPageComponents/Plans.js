'use client';
import axios from 'axios';
import React, { forwardRef, useEffect, useState } from 'react';
import './Plans.css'



const Plans = forwardRef((props, ref) =>  {
  const [formData, setFormData] = useState({
    tagline: '',
    mainDescription: '',
    mainHeading: '',
  });

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5056/api/section5');
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching section5 data:", error);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:5056/api/ConsultationPlan/get-all');

        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setPlans(data);
        } else {
          console.error('Expected an array for plans, but got:', data);
          setPlans([]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        setPlans([]);
      }
    };

    fetchData();
    fetchPlans();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <div
        className="position-relative bg-img-start"
        style={{ backgroundImage: 'url(dist/assets/svg/components/card-11.svg)' }}
      >
        <div className="container content-space-t-3 content-space-t-lg-5 content-space-b-2 content-space-b-lg-1">
          <div className="w-md-75 w-lg-70 text-center mx-auto mb-9" id="target-plans" ref={ref} >
            <h2>{formData.tagline}</h2>
            <p>{formData.mainDescription}</p>
            <h3 className="mt-9 mb-0">{formData.mainHeading}</h3>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="container mt-n5 mt-lg-n5" >
        <div className="row justify-content-center">
        {plans.map((plan) => (
  <div className="col-md col-lg-4 col-md-6 col-12 mb-3 mb-md-0" key={plan.planId}>
    <div className="card h-100 zi-1 bg-primary text-white">
      <div className="card-header text-center">
        <div className="mb-2 text-white">
          <span className="fs-1 fw-semibold">{plan.planDuration}</span>
          <span> minutes</span>
        </div>
        <h3 className="card-title fs-5 text-white">{plan.planName}</h3>
        <p className="card-text mt-3 text-white-70">{plan.planDescription}</p>
      </div>

      <div className="card-body d-flex justify-content-center py-0">
        <ul className="plan-features px-3 w-100" dangerouslySetInnerHTML={{ __html: plan.planFeatures }} />
      </div>

      <div className="card-footer text-center">
        <button type="button" className="btn btn-ghost-light text-white">
          Price: ₹{plan.planPrice}
        </button>
        <button
          type="button"
          className="btn ms-3 btn-ghost-primary bg-light text-black bookAppointment"
           onClick={() =>
    props.scrollToSection({
      planName: plan.planName,
      planPrice: plan.planPrice,
      planDuration: plan.planDuration,
    })
  }
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
))}

        </div>
      </div>
    </div>
  );
});

export default Plans;
