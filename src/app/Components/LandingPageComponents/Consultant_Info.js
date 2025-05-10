'use client';
import React, { useEffect, useState } from "react";

const Consultant_Info = () => {
  // Dummy data, replace later with backend data
  // const consultantData = {
  //   name: "Dr. Riya Mehta",
  //   qualification: "Ph.D. in Clinical Psychology | 10+ Years Experience",
  //   position: "Senior Consultant at MindCare Wellness Center | Certified Cognitive Behavioral Therapist",
  //   description:
  //     "With over a decade of experience in mental health, Dr. Riya Mehta specializes in stress management, anxiety disorders, depression therapy, and mindfulness-based techniques. She is committed to helping individuals overcome personal challenges through a compassionate and evidence-based approach, ensuring emotional resilience and overall well-being.",
  //   image: "/dist/assets/img/400x500/img28.jpg", // Ensure this is stored in the public folder
  //   socialLinks: {
  //     facebook: "#",
  //     youtube: "#",
  //     twitter: "#",
  //     instagram: "#",
  //   },
  // };

  const [consultantData,setConsultantData]=useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5056/api/ConsultantProfile/getConsultantProfile");
        if (!response.ok) throw new Error("Failed to fetch consultant data");
        const result = await response.json();
        console.log("result",result[0]);
        setConsultantData(result[0]);
      } catch (error) {
        console.error("Error fetching consultant data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container content-space-2 content-space-lg-3">
      <div className="row align-items-md-center">
        <div className="col-md-5 d-none d-md-block">
          <img
            className="img-fluid rounded-2"
            src={
              consultantData.section2_Image
                ? `http://localhost:5056${consultantData.section2_Image}`
                : "/assets/img/160x160/img8.jpg"
            }
            alt={consultantData.section2_Image}
          />
        </div>
        {/* End Col */}

        <div className="col-md-7">
          {/* Consultant Info */}
          <figure className="pe-md-7">
            <blockquote className="blockquote blockquote-lg   font-medium pb-2 fs-4 fw-medium" >
             {consultantData.section2_Tagline}
            </blockquote>

            <figcaption className="blockquote-footer">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h3 className="text-primary">{consultantData.fullName}</h3>
                  <p className="blockquote-footer-source mb-0">
                    {consultantData.experience}
                  </p>
                  <p className="blockquote-footer-source mb-6">
                    {consultantData.role}
                  </p>
                  <p className="blockpara text-gray-800 justify-evenly fs-6 lh-base ">
                    {consultantData.description}
                  </p>
                </div>
              </div>
              <ul className="navbar-nav">
                {/* Social Media Buttons */}
                <li className="nav-item">
                  <ul className="list-inline mb-0 mt-5 ">
                      <li className="list-inline-item me-3" key="facebookId">
                        <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded" href={consultantData.facebookId}>
                          <i className={`bi-facebook`}></i>
                        </a>
                      </li>
                       <li className="list-inline-item me-3" key="instagramId">
                       <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded" href={consultantData.instagramId}>
                         <i className={`bi-instagram`}></i>
                       </a>
                     </li>
                      <li className="list-inline-item me-3" key="twitterId">
                      <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded" href={consultantData.twitterId}>
                        <i className={`bi-twitter`}></i>
                      </a>
                    </li>
                     <li className="list-inline-item me-3" key="youtubeId">
                     <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded" href={consultantData.youtubeId}>
                       <i className={`bi-youtube`}></i>
                     </a>
                   </li>
                  </ul>
                </li>
              </ul>
            </figcaption>
          </figure>
          {/* End Consultant Info */}
        </div>
        {/* End Col */}
      </div>
      {/* End Row */}
    </div>
  );
};

export default Consultant_Info;
