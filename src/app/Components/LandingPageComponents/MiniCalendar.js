"use client";
import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './MiniCalendar.css'

const MiniCalendar = () => {
  return (
    <div className="mx-auto" style={{ maxWidth: '35rem' }}>
    <div className="card bg-white p-4 mt-5 mt-lg-0" style={{maxHeight:'38.25rem'}}>
      <div className=" "> 
        {/* Calendar Section */}
        <div className="calendar-container custom-calendar">
         <DatePicker inline 
         />
       </div>
      </div>
    </div>
    </div>
  );
};

export default MiniCalendar;
