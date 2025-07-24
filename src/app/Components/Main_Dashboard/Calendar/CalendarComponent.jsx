// CalendarComponent.jsx
'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import DatePicker from 'react-datepicker';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import AppointmentForm from './AppointmentForm';
import ShiftManager from './ShiftManager';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function CalendarComponent() {
  const offcanvasRef = useRef(null);
  const [plans, setPlans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [slotStartTime, setSlotStartTime] = useState(new Date());
  const [slotEndTime, setSlotEndTime] = useState(new Date());
  const [startHour, setStartHour] = useState("10");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [addAppointment, setAddAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [bufferInMinutes, setBufferInMinutes] = useState(0);
  const [endHour, setEndHour] = useState("11");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("AM");

  const getColorClass = (index) => {
    const colors = ['form-check-primary', 'form-check-success', 'form-check-warning', 'form-check-danger', 'form-check-info'];
    return colors[index % colors.length];
  };

  const fetchAppointments = () => {
    const token = localStorage.getItem('token');
    axios.get('https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        const sortedAppointments = [...response.data].sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        setAppointments(sortedAppointments);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  };

  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;
    const handleOffcanvasHidden = () => {
      setAddAppointment(false);
      setSelectedAppointment(null);
      fetchAppointments(); // refresh after closing form
    };

    if (offcanvasElement) {
      offcanvasElement.addEventListener('hidden.bs.offcanvas', handleOffcanvasHidden);
    }

    return () => {
      if (offcanvasElement) {
        offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleOffcanvasHidden);
      }
    };
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://appointify.coinagesoft.com/api/ConsultationPlan/get-all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch plans');

        const data = await response.json();
        if (Array.isArray(data)) setPlans(data);
        else setPlans([]);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setPlans([]);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    setSelectedPlans(plans.map(p => p.planName?.toLowerCase()));
  }, [plans]);

  useEffect(() => {
  console.log("📌 Updated selectedPlanId:", selectedPlanId);
}, [selectedPlanId]);

useEffect(() => {
  const token = localStorage.getItem('token');
  console.log("planId={selectedPlanId}",selectedPlanId)
  if (!selectedPlanId) return;

  // Fetch all consultant shifts
  axios.get(` https://appointify.coinagesoft.com/api/ConsultantShift`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((res) => {
    console.log("🟢 ConsultantShift Response:", res);
    setShifts(res.data);
  })
  .catch((err) => {
    console.error("❌ Error fetching shifts:", err);
    setShifts([]);
  });

  // Fetch buffer time using only planId (shiftId removed from params)
  axios.get(` https://appointify.coinagesoft.com/api/PlanBufferRule`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { planId: selectedPlanId }  // ✅ shiftId removed
  })
  .then((res) => {
    console.log("🟢 PlanBufferRule Response:", res.data);
    setBufferInMinutes(res.data.bufferInMinutes);
  })
  .catch((err) => {
    console.error("❌ Error fetching buffer:", err);
    setBufferInMinutes(0);
  });

}, [selectedPlanId]);  // ✅ Removed selectedShiftId from dependency

useEffect(() => {
  if (!shifts.length || !selectedShiftId) return;
  const shift = shifts.find(s => s.id === selectedShiftId);

  if (!shift) return;

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const start = new Date(`${dateStr}T${shift.startTime}`);
  let end = new Date(`${dateStr}T${shift.endTime}`);

  // 🛠 Fix: if end time is less than start time, it means it goes past midnight
  if (end <= start) {
    end.setDate(end.getDate() + 1); // move end to next day
  }

  console.log("🟢 Shift Start:", start);
  console.log("🟢 Shift End:", end);

  setSlotStartTime(start);
  setSlotEndTime(end);
}, [shifts, selectedShiftId]);
const scheduledAppointments = appointments
  .filter(
    (a) =>
      a.appointmentStatus === 0 || a.appointmentStatus === 3 &&
      selectedPlans.includes(a.plan?.toLowerCase())
  )
  .map((a) => {
    const [startStr, endStr] = a.appointmentTime.split(' - ');
    const start = new Date(`${a.appointmentDate} ${startStr}`);
    const end = new Date(`${a.appointmentDate} ${endStr}`);

    return {
      title: `${a.firstName} ${a.lastName}`,
      start,
      end,
      className: getColorClass(
        plans.findIndex(
          (p) => p.planName?.toLowerCase() === a.plan?.toLowerCase()
        )
      ),
      extendedProps: {
        planName: a.plan?.toLowerCase() || 'unknown',
        status: a.appointmentStatus,
        appointmentTime: a.appointmentTime,
        id: a.id,
      },
    };
  });


  const handleEventClick = (info) => {
    const clickedTitle = info.event.title;
    const clickedDate = info.event.start;
    const clickedTime = info.event.extendedProps.appointmentTime;

    const matchingAppointment = appointments.find(
      (a) =>
        `${a.firstName} ${a.lastName}` === clickedTitle &&
        a.appointmentDate === clickedDate.toISOString().slice(0, 10) &&
        a.appointmentTime === clickedTime
    );

    if (matchingAppointment) {
      setSelectedAppointment(matchingAppointment);
      const offcanvasEl = document.getElementById('addEventSidebar');
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.show();
    }
  };

  const buildDateTime = (hour, minute, period) => {
    let hr = parseInt(hour);
    if (period === 'PM' && hr !== 12) hr += 12;
    if (period === 'AM' && hr === 12) hr = 0;
    const now = new Date();
    const datePart = now.toISOString().split('T')[0];
    const timePart = `${hr.toString().padStart(2, '0')}:${minute}:00`;
    return `${datePart}T${timePart}`;
  };

  const minTime = buildDateTime(startHour, startMinute, startPeriod);
  const maxTime = buildDateTime(endHour, endMinute, endPeriod);

  return (
    <div className="container-xxl flex-grow-1 container-p-y" style={{ backgroundColor: "white" }}>
   
      <div className="container-xxl flex-grow-1 container-p-y" style={{ backgroundColor: "white" }}>

        <div className="card app-calendar-wrapper">
          <div className="row g-0">
            <div className="col app-calendar-sidebar border-end" id="app-calendar-sidebar">
              <div className="p-5 my-sm-0 mb-4 border-bottom">
                <button
                  onClick={() => setAddAppointment(true)}
                  className="btn btn-primary btn-toggle-sidebar w-100"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#addEventSidebar"
                  aria-controls="addEventSidebar">
                  <i className="ri-add-line ri-16px me-1_5"></i>
                  <span className="align-middle"> Add Appointment</span>
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
                    events={scheduledAppointments}
                    slotMinTime={minTime}
                    slotMaxTime={maxTime}
                    eventClick={(info) => handleEventClick(info)}
                    dateClick={(info) => {
                      setAddAppointment(false);
                      console.log("Date clicked, addAppointment:", addAppointment);
                    }}
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    buttonText={{
                      today: 'Today',
                      dayGridMonth: 'Month',
                      timeGridWeek: 'Week',
                      timeGridDay: 'Day'
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
              <div className="app-overlay"  ></div>
              <div
                ref={offcanvasRef}
                className="offcanvas offcanvas-end event-sidebar"
                tabIndex="-1"
                id="addEventSidebar"
                aria-labelledby="addEventSidebarLabel">
                <div className="offcanvas-header border-bottom">
                  <h5 className="offcanvas-title" id="addEventSidebarLabel"> {selectedAppointment ? 'View Appointment' : 'Add Appointment'}</h5>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    onClick={() => {
                      setAddAppointment(false);
                      setSelectedAppointment(null);
                    }}
                  ></button>
                </div>
                <div className="offcanvas-body">
                 <AppointmentForm
        plans={plans}
        slotStartTime={slotStartTime}
        slotEndTime={slotEndTime}
        setSlotStartTime={setSlotStartTime}
        setSlotEndTime={setSlotEndTime}
        startHour={startHour}
        startMinute={startMinute}
        startPeriod={startPeriod}
        endHour={endHour}
        endMinute={endMinute}
        endPeriod={endPeriod}
        addAppointment={addAppointment}
        selectedAppointment={selectedAppointment}
        setAddAppointment={setAddAppointment}
        shiftStart={slotStartTime}
        shiftEnd={slotEndTime}
        bufferInMinutes={bufferInMinutes}
        refreshAppointments={fetchAppointments} 
         setSelectedShiftId={setSelectedShiftId}
         setBufferInMinutes={setBufferInMinutes}
           selectedPlanId={selectedPlanId} // ✅ new
           setSelectedPlanId={setSelectedPlanId} /// ✅ added refresh
      />

                </div>
              </div>
            </div>
          </div>
        </div>

     

     
         <div className="row mb-1 mx-2 mt-5 justify-between ">
          <ShiftManager planId={selectedPlanId} />
        </div>
      </div>
    </div>
  );
}