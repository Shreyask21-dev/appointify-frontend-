"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MiniCalendar.css";

const MiniCalendar = ({ selected, onChange }) => {
  // Optionally track local state if no selected is passed
  // But better to let parent control selected date
  // So we just use props.selected and onChange

  return (
    <div className="mx-auto" style={{ maxWidth: "35rem" }}>
      <div className="card bg-white p-4 mt-5 mt-lg-0" style={{ maxHeight: "40rem" }}>
        <div className="">
          {/* Calendar Section */}
          <div className="calendar-container custom-calendar">
            <DatePicker
              inline
              selected={selected}
              onChange={(date) => {
                // Pass the selected date to the parent
                onChange && onChange(date);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
