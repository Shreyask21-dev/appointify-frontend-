"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MiniCalendar.css";
import axios from "axios";

const MiniCalendar = ({ selected, onChange }) => {

  const [highlightedDates, setHighlightedDates] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleMonthChange = (date) => {
    setCurrentMonth(date);

    const monthAppointments = appointments.filter((item) => {
      const apptDate = new Date(item.appointmentDate);
      return (
        apptDate.getMonth() === date.getMonth() &&
        apptDate.getFullYear() === date.getFullYear()
      );
    });

    setSelectedDateAppointments(monthAppointments);
  };


  // Helper: compare only year-month-day
  const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const res = await axios.get(
  //         "https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments"
  //       );
  //       const data = res.data || [];

  //       const dates = data.map((item) => new Date(item.appointmentDate));
  //       setAppointments(data);
  //       setHighlightedDates(dates);
  //     } catch (err) {
  //       console.error("Failed to fetch appointment dates:", err);
  //     }
  //   };

  //   fetchAppointments();
  // }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments"
        );
        const data = res.data || [];

        const dates = data.map((item) => new Date(item.appointmentDate));
        setAppointments(data);
        setHighlightedDates(dates);

        // Filter appointments for the current month and set them
        const now = new Date();
        const currentMonthAppointments = data.filter((item) => {
          const apptDate = new Date(item.appointmentDate);
          return (
            apptDate.getMonth() === now.getMonth() &&
            apptDate.getFullYear() === now.getFullYear()
          );
        });
        setSelectedDateAppointments(currentMonthAppointments);

      } catch (err) {
        console.error("Failed to fetch appointment dates:", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleDateChange = (date) => {
    onChange && onChange(date);

    // Filter appointments for selected date
    const filtered = appointments.filter((a) =>
      isSameDay(new Date(a.appointmentDate), date)
    );
    setSelectedDateAppointments(filtered);
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "35rem" }}>
      <div className="card bg-white p-4 mt-5 mt-lg-0" style={{ maxHeight: "40rem" }}>
        <div className="">
          {/* Calendar Section */}
          <div className="calendar-container custom-calendar">
            {/* <DatePicker
              inline
              selected={selected}
              onChange={handleDateChange}
              dayClassName={(date) => {
                const hasDot = highlightedDates.some((highlight) =>
                  isSameDay(date, highlight)
                );
                return hasDot ? "date-has-dot" : "";
              }}
            /> */}
            <DatePicker
              inline
              selected={selected}
              onChange={handleDateChange}
              onMonthChange={handleMonthChange}
              dayClassName={(date) => {
                const hasDot = highlightedDates.some((highlight) =>
                  isSameDay(date, highlight)
                );
                return hasDot ? "date-has-dot" : "";
              }}
            />

            {/* Appointment Slots */}
            {selectedDateAppointments.length > 0 ? (
              <div className="mt-4">
                <h6 className="fw-bold text-primary mb-3">Booked Appointments:</h6>
                <ul className="list-group">
                  {selectedDateAppointments.map((slot) => (
                    <li key={slot.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{slot.appointmentTime}</span>
                      <span className="badge bg-success">{slot.plan}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : selected ? (
              <p className="mt-4 text-muted text-center">No slots available on this date.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
