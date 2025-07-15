"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MiniCalendar.css";
import axios from "axios";

const MiniCalendar = ({ selected, onDateChange, onSlotSelect, duration, bookedTimeSlots = [], selectedSlot, planId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
const [bookedSlots, setBookedSlots] = useState([]);

  const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const format24Hr = (date) => {
    return date.toTimeString().slice(0, 5);
  };

 const generateTimeSlots = (startTime, endTime, duration, buffer) => {
  if (!startTime || !endTime || isNaN(duration)) return [];

  const slots = [];
  const cur = new Date(startTime);

  while (true) {
    const slotEnd = new Date(cur.getTime() + duration * 60000);
    if (slotEnd > endTime) break;

    slots.push({
      label: `${formatTime(cur)} - ${formatTime(slotEnd)}`,
      value: `${formatTime(cur)} - ${formatTime(slotEnd)}`,
      start: format24Hr(cur),
      end: format24Hr(slotEnd),
    });

    // Move to next slot (consider buffer)
    cur.setTime(slotEnd.getTime() + buffer * 60000);
  }

  return slots;
};


useEffect(() => {
  const fetchShiftAndGenerateSlots = async () => {
    const token = localStorage.getItem('token');
    if (!selected || !duration || !planId) return;

    try {
      console.log("Fetching plan with ID:", planId);

      // Step 1: Get PlanBufferRule (returns shiftId and buffer time)
      const bufferRes = await axios.get(` https://appointify.coinagesoft.com/api/PlanBufferRule`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { planId }
      });

      const bufferData = bufferRes.data;
      console.log("🟢 PlanBufferRule Response:", bufferData);

      const shiftId = bufferData.shiftId;
      const buffer = bufferData.bufferInMinutes || 0;

      if (!shiftId) {
        console.warn("⛔ No shiftId found in buffer rule.");
        setTimeSlots([]);
        return;
      }

      // Step 2: Fetch all shifts and find the matching one
      const shiftRes = await axios.get(` https://appointify.coinagesoft.com/api/ConsultantShift`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allShifts = shiftRes.data;
      console.log("🟢 Shift details:", allShifts);

      const shift = allShifts.find(s => s.id === shiftId);

      if (!shift?.startTime || !shift?.endTime) {
        console.warn("⛔ Missing shift start or end time.");
        setTimeSlots([]);
        return;
      }

      const shiftStart = new Date(`${selected}T${shift.startTime}`);
      const shiftEnd = new Date(`${selected}T${shift.endTime}`);

      console.log("Shift Start:", shiftStart);
      console.log("Shift End:", shiftEnd);
      console.log("Duration:", duration);

      const slots = generateTimeSlots(shiftStart, shiftEnd, Number(duration), buffer);
      console.log("Generated Slots:", slots);

      setTimeSlots(slots);

      const bookedRes = await axios.get(`https://appointify.coinagesoft.com/api/CustomerAppointment/GetBookedSlots`, {
  headers: { Authorization: `Bearer ${token}` },
  params: { date: selected }
});

const bookedData = bookedRes.data || [];
console.log("🟠 Booked slots for date:", selected, bookedData);

// Assuming bookedData = array of time strings in "HH:mm" format
const bookedValues = slots
  .filter(slot => bookedData.includes(slot.start))
  .map(slot => slot.value);

setBookedSlots(bookedValues);

    } catch (err) {
      console.error("❌ Error fetching shift:", err);
      setTimeSlots([]);
    }
  };

  

  fetchShiftAndGenerateSlots();
}, [selected, duration, planId]);

  return (
    <div className="mx-auto" style={{ maxWidth: "35rem" }}>
      <div className="card bg-white p-4 mt-5 mt-lg-0" style={{ maxHeight: "40rem" }}>
        <div className="calendar-container custom-calendar">
          <DatePicker
            inline
            selected={selected ? new Date(selected) : null}
            onChange={(dateObj) => {
              if (!duration || !planId) {
                alert("Please select a plan first.");
                return;
              }
              onDateChange && onDateChange(dateObj.toISOString().split("T")[0]);
            }}
          />

          {timeSlots.length > 0 && (
            <>
              <h6 className="fw-bold text-primary mb-2 mt-3">Available Slots:</h6>
              <div className="row gx-1">
                {timeSlots.map((slot, index) => {
                  const isBooked = bookedSlots.includes(slot.value);

                  const isSelected = selectedSlot === slot.value;

                  return (
                    <div className="col-4 mb-2" key={index}>
                      <button
                        className={`btn btn-sm w-100 text-truncate px-1 py-1 h-100 ${isBooked
                            ? "bg-danger text-white"
                            : isSelected
                              ? "bg-primary text-white"
                              : "btn-outline-primary"
                          }`}
                        style={{
                          fontSize: "0.75rem",
                          cursor: isBooked ? "not-allowed" : "pointer",
                          pointerEvents: isBooked ? "none" : "auto",
                        }}
                        disabled={isBooked}
                        onClick={() => onSlotSelect(slot.value)}
                      >
                        {slot.label}
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
