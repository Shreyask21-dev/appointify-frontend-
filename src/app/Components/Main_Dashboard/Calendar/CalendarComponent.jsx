'use client';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import DatePicker from 'react-datepicker';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import { startOfMonth, endOfMonth } from 'date-fns';
// import AddEventModal from './Components/AddEventModal';
// import UpdateEventModal from './Components/UpdateEventModal';
// import { Modal } from 'react-bootstrap';
import { useMemo } from 'react';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// dayjs.extend(isBetween);
import "react-datepicker/dist/react-datepicker.css";
import './Calendar.css'


export default function CalendarComponent() {
  const handleSubmit = (e) => {
    e.preventDefault();
    return false;
  };
  
  return (
    <div>

      <div className="container-xxl flex-grow-1 container-p-y" style={{backgroundColor:"white"}}>
        <div className="card app-calendar-wrapper">
          <div className="row g-0">
            <div className="col app-calendar-sidebar border-end" id="app-calendar-sidebar">
              <div className="p-5 my-sm-0 mb-4 border-bottom">
                <button
                  className="btn btn-primary btn-toggle-sidebar w-100"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#addEventSidebar"
                  aria-controls="addEventSidebar">
                  <i className="ri-add-line ri-16px me-1_5"></i>
                  <span className="align-middle">Add Event</span>
                </button>
              </div>
              <div className="px-4">

                <DatePicker
                  inline
                // selected={selectedDate}
                // onChange={date => {
                //   setSelectedDate(date);
                //   const calendarApi = calendarRef.current.getApi();
                //   calendarApi.gotoDate(date);
                // }}
                // onMonthChange={handleMonthChange}
                />

                <hr className="mb-5 mx-n4 mt-3" />
                <div className="mb-4 ms-1">
                  <h5>Event Filters</h5>
                </div>

                <div className="form-check form-check-secondary mb-5 ms-3">
                  <input
                    className="form-check-input select-all"
                    type="checkbox"
                    id="selectAll"
                    data-value="all"
                    defaultChecked={true} />
                  <label className="form-check-label" htmlFor="selectAll">View All</label>
                </div>

                <div className="app-calendar-events-filter text-heading">
                  <div className="form-check form-check-danger mb-5 ms-3">
                    <input
                      className="form-check-input input-filter"
                      type="checkbox"
                      id="select-personal"
                      data-value="personal"
                      defaultChecked={true} />
                    <label className="form-check-label" htmlFor="select-personal">Personal</label>
                  </div>
                  <div className="form-check mb-5 ms-3">
                    <input
                      className="form-check-input input-filter"
                      type="checkbox"
                      id="select-business"
                      data-value="business"
                      defaultChecked={true} />
                    <label className="form-check-label" htmlFor="select-business">Business</label>
                  </div>
                  <div className="form-check form-check-warning mb-5 ms-3">
                    <input
                      className="form-check-input input-filter"
                      type="checkbox"
                      id="select-family"
                      data-value="family"
                      defaultChecked={true} />
                    <label className="form-check-label" htmlFor="select-family">Family</label>
                  </div>
                  <div className="form-check form-check-success mb-5 ms-3">
                    <input
                      className="form-check-input input-filter"
                      type="checkbox"
                      id="select-holiday"
                      data-value="holiday"
                      defaultChecked={true} />
                    <label className="form-check-label" htmlFor="select-holiday">Holiday</label>
                  </div>
                  <div className="form-check form-check-info ms-3">
                    <input
                      className="form-check-input input-filter"
                      type="checkbox"
                      id="select-etc"
                      data-value="etc"
                      defaultChecked={true} />
                    <label className="form-check-label" htmlFor="select-etc">ETC</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col app-calendar-content">
              <div className="card shadow-none border-0">
                <div className="card-body pb-0 ps-0">
                  <FullCalendar
                    // ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // ✅ interactionPlugin is needed for dateClick
                    initialView="dayGridMonth"
                    // initialDate={selectedDate}
                    // events={calendarEvents}
                    headerToolbar={{
                      left: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    // dateClick={(info) => {
                    //   console.log('Date clicked:', info.dateStr); // Optional debug
                    //   setPreFilledDate(info.dateStr);
                    //   setShowAddEventModal(true);
                    // }}
                    // eventClick={(info) => {
                    //   const eventData = info.event.extendedProps;
                    //   setSelectedEvent({ ...eventData, id: info.event.id });
                    //   setShowUpdateModal(true);
                    // }}

                  />
                </div>
              </div>
              <div className="app-overlay"></div>
              <div
                className="offcanvas offcanvas-end event-sidebar"
                tabIndex="-1"
                id="addEventSidebar"
                aria-labelledby="addEventSidebarLabel">
                <div className="offcanvas-header border-bottom">
                  <h5 className="offcanvas-title" id="addEventSidebarLabel">Add Event</h5>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                  <form className="event-form pt-0" id="eventForm" onSubmit={handleSubmit}>
                    <div className="form-floating form-floating-outline mb-5">
                      <input
                        type="text"
                        className="form-control"
                        id="eventTitle"
                        name="eventTitle"
                        placeholder="Event Title" />
                      <label htmlFor="eventTitle">Title</label>
                    </div>
                    <div className="form-floating form-floating-outline mb-5">
                      <select className="select2 select-event-label form-select" id="eventLabel" defaultValue={"Business"} name="eventLabel">
                        <option data-label="primary" value="Business" >Business</option>
                        <option data-label="danger" value="Personal">Personal</option>
                        <option data-label="warning" value="Family">Family</option>
                        <option data-label="success" value="Holiday">Holiday</option>
                        <option data-label="info" value="ETC">ETC</option>
                      </select>
                      <label htmlFor="eventLabel">Label</label>
                    </div>
                    <div className="form-floating form-floating-outline mb-5">
                      <input
                        type="text"
                        className="form-control"
                        id="eventStartDate"
                        name="eventStartDate"
                        placeholder="Start Date" />
                      <label htmlFor="eventStartDate">Start Date</label>
                    </div>
                    <div className="form-floating form-floating-outline mb-5">
                      <input
                        type="text"
                        className="form-control"
                        id="eventEndDate"
                        name="eventEndDate"
                        placeholder="End Date" />
                      <label htmlFor="eventEndDate">End Date</label>
                    </div>
                    <div className="mb-5">
                      <div className="form-check form-switch">
                        <input type="checkbox" className="form-check-input allDay-switch" id="allDaySwitch" />
                        <label className="form-check-label" htmlFor="allDaySwitch">All Day</label>
                      </div>
                    </div>
                    <div className="form-floating form-floating-outline mb-5">
                      <input
                        type="url"
                        className="form-control"
                        id="eventURL"
                        name="eventURL"
                        placeholder="https://www.google.com" />
                      <label htmlFor="eventURL">Event URL</label>
                    </div>
                    <div className="form-floating form-floating-outline mb-5 select2-primary">
                      <select
                        className="select2 select-event-guests form-select"
                        id="eventGuests"
                        name="eventGuests"
                        multiple>
                        <option data-avatar="1.png" value="Jane Foster">Jane Foster</option>
                        <option data-avatar="3.png" value="Donna Frank">Donna Frank</option>
                        <option data-avatar="5.png" value="Gabrielle Robertson">Gabrielle Robertson</option>
                        <option data-avatar="7.png" value="Lori Spears">Lori Spears</option>
                        <option data-avatar="9.png" value="Sandy Vega">Sandy Vega</option>
                        <option data-avatar="11.png" value="Cheryl May">Cheryl May</option>
                      </select>
                      <label htmlFor="eventGuests">Add Guests</label>
                    </div>
                    <div className="form-floating form-floating-outline mb-5">
                      <input
                        type="text"
                        className="form-control"
                        id="eventLocation"
                        name="eventLocation"
                        placeholder="Enter Location" />
                      <label htmlFor="eventLocation">Location</label>
                    </div>
                    <div className="form-floating form-floating-outline mb-5">
                      <textarea className="form-control" name="eventDescription" id="eventDescription"></textarea>
                      <label htmlFor="eventDescription">Description</label>
                    </div>
                    <div className="mb-5 d-flex justify-content-sm-between justify-content-start my-6 gap-2">
                      <div className="d-flex">
                        <button type="submit" className="btn btn-primary btn-add-event me-4">Add</button>
                        <button
                          type="reset"
                          className="btn btn-outline-secondary btn-cancel me-sm-0 me-1"
                          data-bs-dismiss="offcanvas">
                          Cancel
                        </button>
                      </div>
                      <button className="btn btn-outline-danger btn-delete-event d-none">Delete</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
