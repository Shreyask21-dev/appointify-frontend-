"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MiniCalendar.css";
import axios from "axios";

const MiniCalendar = ({ selected, onDateChange, onSlotSelect, duration, bookedTimeSlots, selectedSlot }) => {
  const [appointments, setAppointments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const parseTime = (timeStr) => {
    const [time, meridian] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const generateTimeSlots = (start, end, durationMin) => {
    const result = [];
    const curr = new Date(start);

    while (curr.getTime() + durationMin * 60000 <= end.getTime()) {
      const endSlot = new Date(curr.getTime() + durationMin * 60000);
      result.push(`${formatTime(curr)} - ${formatTime(endSlot)}`);
      curr.setTime(curr.getTime() + durationMin * 60000);
    }

    return result;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments");
        setAppointments(res.data || []);
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const generateSlotsOnSelection = async () => {
      if (!selected || !duration) return;

      try {
        const res = await axios.get("https://appointify.coinagesoft.com/api/WorkSession");
        const session = res.data[0];
        const start = parseTime(session.workStartTime);
        const end = parseTime(session.workEndTime);
        const slots = generateTimeSlots(start, end, Number(duration));
        setTimeSlots(slots);
      } catch (err) {
        console.error("Failed to fetch session or generate slots", err);
      }
    };

    generateSlotsOnSelection();
  }, [selected, duration]);

  return (
    <div className="mx-auto" style={{ maxWidth: "35rem" }}>
      <div className="card bg-white p-4 mt-5 mt-lg-0" style={{ maxHeight: "40rem" }}>
        <div className="calendar-container custom-calendar">
          <DatePicker
            inline
            selected={selected ? new Date(selected) : null}
            onChange={(dateObj) => {
              if (!duration) {
                alert("Please select a plan to see available time slots.");
                return;
              }
              onDateChange && onDateChange(dateObj.toISOString().split("T")[0]);
            }}
            dayClassName={(date) => {
              const hasAppt = appointments.some((a) =>
                isSameDay(date, new Date(a.appointmentDate))
              );
              return hasAppt ? "date-has-dot" : "";
            }}
          />

          {timeSlots.length > 0 && (
            <>
              <h6 className="fw-bold text-primary mb-2 mt-3">Available Slots:</h6>
              <div className="row gx-1">
                {timeSlots.map((slot, index) => {
                  const isBooked = bookedTimeSlots?.includes(slot);
                  return (
                    <div className="col-4 mb-2" key={index}>
                      <button
                        className={`btn btn-sm w-100 text-truncate px-1 py-1 h-100 ${isBooked ? "bg-danger text-white"
                            : selectedSlot === slot ? "bg-primary text-white"
                              : "btn-outline-primary"
                          }`}

                        // className={`btn btn-sm w-100 text-truncate px-1 py-1 h-100 ${isBooked ? "bg-danger text-white" : "btn-outline-primary"}`}
                        style={{
                          fontSize: "0.75rem",
                          cursor: isBooked ? "not-allowed" : "pointer",
                          pointerEvents: isBooked ? "none" : "auto",
                        }}
                        disabled={isBooked}
                        onClick={() => onSlotSelect(slot)}
                      >
                        {slot}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
