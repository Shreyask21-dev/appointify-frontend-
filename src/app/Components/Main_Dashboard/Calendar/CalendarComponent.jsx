'use client';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import DatePicker from 'react-datepicker';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "react-datepicker/dist/react-datepicker.css";
import './Calendar.css'
import AppointmentForm from './AppointmentForm'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CalendarComponent() {
  const [plans, setPlans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);

  const getColorClass = (index) => {
    const colors = [
      'form-check-primary',
      'form-check-success',
      'form-check-warning',
      'form-check-danger',
      'form-check-info'
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5056/api/CustomerAppointment/GetAllAppointments', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        const sortedAppointments = [...response.data].sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        setAppointments(sortedAppointments);

        // setAppointments(response.data);
        console.log("Appointments", response.data)

      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5056/api/ConsultationPlan/get-all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }

        const data = await response.json();
        console.log(data)
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

    fetchPlans(); // Call the fetch function

  }, []);
  useEffect(() => {
    setSelectedPlans(plans.map(p => p.planName?.toLowerCase()));
  }, [plans]);


  const filteredAppointments = appointments
    .filter(a => selectedPlans.includes(a.plan?.toLowerCase()))
    .map((a) => ({
      title: `${a.firstName} ${a.lastName}`,
      start: new Date(a.appointmentDate).toISOString(),
      className: getColorClass(plans.findIndex(p => p.planName?.toLowerCase() === a.plan?.toLowerCase())),
      extendedProps: {
        planName: a.plan?.toLowerCase() || 'unknown'
      }
    }))



  useEffect(() => {
    console.log("Filtered Appointments", filteredAppointments)

  }, [appointments])
  const handleSubmit = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div>

      <div className="container-xxl flex-grow-1 container-p-y" style={{ backgroundColor: "white" }}>
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
                  <span className="align-middle">Add Appointment</span>
                </button>
              </div>
              <div className="px-4">

                <DatePicker
                  inline

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
                    checked={selectedPlans.length === plans.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlans(plans.map(p => p.planName?.toLowerCase()));
                      } else {
                        setSelectedPlans([]);
                      }
                    }}
                  />

                  <label className="form-check-label" htmlFor="selectAll">View All</label>
                </div>

                <div className="app-calendar-events-filter text-heading">
                  {plans.map((plan, index) => (
                    <div className={`form-check ${getColorClass(index)} mb-3 ms-3`} key={index}>
                      <input
                        className="form-check-input input-filter"
                        type="checkbox"
                        id={`select-${plan.planName?.toLowerCase() || 'unknown'}`}
                        data-value={plan.planName?.toLowerCase() || 'unknown'}
                        checked={selectedPlans.includes(plan.planName?.toLowerCase())}


                        onChange={(e) => {
                          const planValue = plan.planName?.toLowerCase();
                          if (e.target.checked) {
                            setSelectedPlans(prev => [...prev, planValue]);
                          } else {
                            setSelectedPlans(prev => prev.filter(p => p !== planValue));
                          }
                          console.log("Changed Plan:", planValue);
                          console.log("Selected Plans:", selectedPlans);
                        }}

                      />

                      <label
                        className="form-check-label"
                        htmlFor={`select-${plan.planName?.toLowerCase() || 'unknown'}`}
                      >
                        {plan.planName || 'Unnamed Plan'}
                      </label>
                    </div>
                  ))}

                </div>


              </div>
            </div>

            <div className="col app-calendar-content">
              <div className="card shadow-none border-0">
                <div className="card-body pb-0 ps-0">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate={appointments.length > 0 ? new Date(appointments[0].appointmentDate) : new Date()}
                    events={filteredAppointments}
                    headerToolbar={{
                      left: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    eventContent={(info) => {
                      return {
                        html: `<div class="custom-event ${info.event.classNames.join(' ')}">
               ${info.event.title}
             </div>`
                      };
                    }}
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
                  <h5 className="offcanvas-title" id="addEventSidebarLabel">Add Appointment</h5>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                  <AppointmentForm plans={plans} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
