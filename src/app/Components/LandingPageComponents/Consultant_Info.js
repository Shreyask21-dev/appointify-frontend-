'use client';
import React, { useEffect, useState } from "react";

const Consultant_Info = () => {

  const API_URL = process.env.REACT_APP_API_URL;
  const [consultantData, setConsultantData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://appointify.coinagesoft.com/api/ConsultantProfile/getConsultantProfile`);
        if (!response.ok) throw new Error("Failed to fetch consultant data");
        const result = await response.json();
        console.log("result", result[0]);
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
                ? `https://appointify.coinagesoft.com${consultantData.section2_Image}`
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
                    {consultantData.role} <br />
                    {consultantData.certificates === "null" ? "" : consultantData.certificates}
                  </p>

                  <p className="blockpara text-gray-800 justify-evenly fs-6 lh-base ">
                    {consultantData.description}
                  </p>

                </div>
              </div>
              <ul className="navbar-nav">
                {/* Social Media Buttons */}
                <li className="nav-item">
                  <ul className="list-inline mb-0 ">
                    <li className="list-inline-item me-3" key="facebookId">
                      <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded fs-5" target="_blank" href={consultantData.facebookId}>
                        <i className={`bi-facebook`}></i>
                      </a>
                    </li>
                    <li className="list-inline-item me-3" key="instagramId">
                      <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded fs-5" target="_blank" href={consultantData.instagramId}>
                        <i className={`bi-instagram`}></i>
                      </a>
                    </li>
                    <li className="list-inline-item me-3" key="twitterId">
                      <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded fs-5" target="_blank" href={consultantData.twitterId}>
                        <i className={`bi-twitter`}></i>
                      </a>
                    </li>
                    <li className="list-inline-item me-3" key="youtubeId">
                      <a className="btn btn-soft-dark btn-xs btn-icon bg-light rounded fs-5" target="_blank" href={consultantData.youtubeId}>
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
