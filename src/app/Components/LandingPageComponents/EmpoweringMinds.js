'use client';
import React, { useEffect, useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL;
const EmpoweringMinds = () => {
  const [consultantInfo, setConsultantInfo] = useState({
    section3_Tagline: '',
    section3_Description: [],
    section3_Image: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ConsultantProfile/getConsultantProfile`);
        if (!response.ok) throw new Error("Failed to fetch consultant data");

        const result = await response.json();
        const data = result[0];

        // Split the long description string into array of paragraphs
        const rawDescription = data.section3_Description || '';
        const formattedDescription = rawDescription
          .split("',") // You can change this if needed to '\n' or a custom delimiter
          .map(s => s.replace(/^'/, '').trim())
          .filter(line => line.length > 0);

        // Update state with formatted data
        setConsultantInfo({
          section3_Tagline: data.section3_Tagline || '',
          section3_Description: formattedDescription,
          section3_Image: data.section3_Image || ''
        });
      } catch (error) {
        console.error("Error fetching consultant data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container content-space-2 content-space-lg-3 bg-white">
      <div className="row justify-content-lg-between">
        <div className="col-lg-6 mb-5 mb-lg-0">
          <h4 className=''>{consultantInfo.section3_Tagline}</h4>
          <img 
            src={
              consultantInfo.section3_Image
                ? `${API_URL}${consultantInfo.section3_Image}`
                : "/assets/img/psychological-help-jpg.jpg"
            }
            alt="Empowering Minds"
            style={{ width: "400px" }}
          />
        </div>

        <div className="col-lg-6 mt-5 pt-5">
          {Array.isArray(consultantInfo.section3_Description) &&
            consultantInfo.section3_Description.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmpoweringMinds;
