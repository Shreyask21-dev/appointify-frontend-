'use client';
import axios from 'axios';
import React, { forwardRef, useEffect, useState } from 'react';
import './Plans.css'

const API_URL = process.env.REACT_APP_API_URL;

const Plans = React.forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    tagline: '',
    mainDescription: '',
    mainHeading: '',
  });

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://appointify.coinagesoft.com/api/Section5`);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching section5 data:", error);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await fetch(`https://appointify.coinagesoft.com/api/ConsultationPlan/get-all`);

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
        {/* after checking this in swagger getting 404. need to check backend */}
        {/* <div className="container ">
          <div className="w-md-75 w-lg-70 text-center mx-auto mb-9" id="target-plans" ref={ref} >
            <h2>{formData.tagline}</h2>
            <p>{formData.mainDescription}</p>
           
          </div>
        </div> */}
      </div>

      {/* Plan Cards */}
      <div className="container py-5"> {/* Section spacing */}
        {/* <div className="text-center mb-5">
          <h2 className="fw-bold">Our Consultation Plans</h2>
          <p className="text-muted">Choose the plan that fits your needs</p>
        </div> */}

        <div className="container ">
          <div className="w-md-75 w-lg-70 text-center mx-auto mb-9" id="target-plans" ref={ref} >
            <h2>{formData.tagline}</h2>
            <p>{formData.mainDescription}</p>
            {/* <h3 className="mt-9 mb-0">{formData.mainHeading}</h3> */}
          </div>
        </div>

        <div className="row justify-content-center">
          {plans.map((plan) => (
            // <div className="col-md-6 col-lg-4 mb-4" key={plan.planId}>
            //   <div className="card h-100 bg-primary text-white shadow">
            //     <div className="card-body d-flex flex-column justify-content-between">
            //       <div className="text-center mb-4">
            //         <div className="mb-2">
            //           <span className="fs-1 fw-semibold">{plan.planDuration}</span>
            //           <span> minutes</span>
            //         </div>
            //         <h3 className="fs-5">{plan.planName}</h3>
            //         <p className="text-white-70">{plan.planDescription}</p>
            //       </div>

            //       <ul
            //         className="plan-features px-3"
            //         dangerouslySetInnerHTML={{ __html: plan.planFeatures }}
            //       />
            //     </div>

            //     <div className="card-footer bg-transparent text-center border-0">
            //       <div className="d-flex justify-content-center flex-wrap gap-2">
            //         <span className="btn btn-ghost-light text-white">
            //           Price: ₹{plan.planPrice}
            //         </span>
            //         <button
            //           type="button"
            //           className="btn btn-light text-black bookAppointment"
            //           onClick={() =>
            //             props.scrollToSection({
            //               planName: plan.planName,
            //               planPrice: plan.planPrice,
            //               planDuration: plan.planDuration,
            //             })
            //           }
            //         >
            //           Book Now
            //         </button>
            //       </div>
            //     </div>
            //   </div>
            // </div>


            <div className="col-md-6 col-lg-4 mb-4" key={plan.planId}>
              <div className="card h-100 bg-primary text-white shadow-sm border-0 d-flex flex-column">

                <div className="card-body d-flex flex-column">
                  {/* Plan Name */}
                  <h4 className="fw-bold mb-3 text-white">{plan.planName}</h4>

                  {/* Plan Duration */}
                  <div className="small text-white-50 mb-2">{plan.planDuration} minutes</div>

                  {/* Plan Description */}
                  <p className="text-white-75 small mb-3">{plan.planDescription}</p>

                  {/* Features List */}
                  <ul
                    className="plan-features px-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: plan.planFeatures }}
                  />

                  {/* Spacer to push footer down if needed */}
                  <div className="flex-grow-1"></div>
                </div>

                {/* Footer */}
                <div className="card-footer bg-transparent border-0 text-center pb-4">
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <span className="btn btn-outline-light text-white px-4">
                      ₹{plan.planPrice}
                    </span>
                    <button
                      type="button"
                      className="btn btn-light text-black px-4"
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
            </div>


          ))}
        </div>
      </div>

    </div>
  );
});

Plans.displayName = "Plans";
export default Plans;
