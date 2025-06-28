'use client';
import React, { useEffect, useState } from 'react';
import ChartComponent from './ChartComponent';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const Dashboard_Content = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    scheduledAppointment: 0,
    completedSessions: 0,
    canceled_rescheduledAppointments: 0,
    totalRevenue: 0,
    avgDuration: '0 min'
  });

  const [appointmentData, setAppointmentData] = useState([]);

 useEffect(() => {
  axios
    .get(`${API_URL}/api/CustomerAppointment/GetAllAppointments`)
    .then((response) => {
      const data = response.data;

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const groupedByMonth = {};

      data.forEach(item => {
        const date = new Date(item.createdDate);
        const month = date.getMonth();
        const key = monthNames[month];

        if (!groupedByMonth[key]) {
          groupedByMonth[key] = {
            totalAppointments: 0,
            pending: 0,
            completed: [],
            canceled: 0,
            rescheduled: 0
          };
        }

        groupedByMonth[key].totalAppointments += 1;

        if (item.appointmentStatus === 4) {
          groupedByMonth[key].pending += 1;
        } else if (item.appointmentStatus === 1) {
          groupedByMonth[key].completed.push(item);
        } else if (item.appointmentStatus === 2) {
          groupedByMonth[key].canceled += 1;
        } else if (item.appointmentStatus === 3) {
          groupedByMonth[key].rescheduled += 1;
        }
      });

      const monthlyData = [];

      for (const month in groupedByMonth) {
        const group = groupedByMonth[month];
        const completedCount = group.completed.length;

        const revenue = group.completed.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalDuration = group.completed.reduce((sum, item) => sum + (item.duration || 0), 0);
        const avgDuration = completedCount > 0 ? `${Math.round(totalDuration / completedCount)} min` : '0 min';

        monthlyData.push({
          month,
          revenue: `₹${revenue}`,
          totalAppointments: group.totalAppointments,
          pending: group.pending,
          completed: completedCount,
          canceled: group.canceled + group.rescheduled,
          avgTime: avgDuration
        });
      }

      // Get total stats (latest month or full if needed)
      const allCompleted = data.filter(item => item.appointmentStatus === 1);
      const totalDuration = allCompleted.reduce((sum, item) => sum + (item.duration || 0), 0);
      const avgDuration = allCompleted.length > 0 ? `${Math.round(totalDuration / allCompleted.length)} min` : '0 min';
      const totalRevenue = allCompleted.reduce((sum, item) => sum + (item.amount || 0), 0);

      setStats({
        totalAppointments: data.length,
        scheduledAppointment: data.filter(item => item.appointmentStatus === 0).length,
        completedSessions: allCompleted.length,
        canceled_rescheduledAppointments:
          data.filter(item => item.appointmentStatus === 2 || item.appointmentStatus === 3).length,
        totalRevenue,
        avgDuration
      });

      setAppointmentData(monthlyData);
    })
    .catch((error) => {
      console.error('Failed to fetch dashboard data:', error);
    });
}, []);


  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-6">
          {/* Total Appointments */}
          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-primary h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="text-muted">Total Appointments</h6>
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar me-3">
                    <span className="avatar-initial rounded-circle bg-label-primary p-3">
                      <i className="ri-calendar-check-line ri-24px text-white"></i>
                    </span>
                  </div>
                  <h3 className="mb-0 fw-bold text-primary">{stats.totalAppointments}</h3>
                </div>
                <p className="text-muted">Upcoming consultations</p>
              </div>
            </div>
          </div>

          {/* Scheduled Appointments */}
          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-warning h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="text-muted">Scheduled Appointment</h6>
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar me-3">
                    <span className="avatar-initial rounded-circle bg-label-warning p-3">
                      <i className="ri-time-line ri-24px text-white"></i>
                    </span>
                  </div>
                  <h3 className="mb-0 fw-bold text-warning">{stats.scheduledAppointment}</h3>
                </div>
                <p className="text-muted">New appointment requests</p>
              </div>
            </div>
          </div>

          {/* Completed Sessions */}
          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-danger h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="text-muted">Completed Sessions</h6>
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar me-3">
                    <span className="avatar-initial rounded-circle bg-label-danger p-3">
                      <i className="ri-check-double-line ri-24px text-white"></i>
                    </span>
                  </div>
                  <h3 className="mb-0 fw-bold text-danger">{stats.completedSessions}</h3>
                </div>
                <p className="text-muted">Successful consultations</p>
              </div>
            </div>
          </div>

          {/* Canceled / Rescheduled */}
          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-info h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="text-muted">Canceled/Rescheduled</h6>
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar me-3">
                    <span className="avatar-initial rounded-circle bg-label-info p-3">
                      <i className="ri-refresh-line ri-24px text-white"></i>
                    </span>
                  </div>
                  <h3 className="mb-0 fw-bold text-info">{stats.canceled_rescheduledAppointments}</h3>
                </div>
                <p className="text-muted">Appointments changed</p>
              </div>
            </div>
          </div>

          {/* Chart & Table */}
          <div className="col-xxl-6 order-5 order-xxl-0">
            <div className="charts-wrapper mb-4">
              <ChartComponent />
            </div>

            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div className="card-title mb-0">
                  <h5 className="m-0 me-2">Revenue & Appointments Overview</h5>
                  <p className="text-muted small m-0">* All consultations are prepaid online</p>
                </div>
              </div>
              <div className="card-body pb-2">
                <div className="table-responsive mt-4">
                  <table className="table card-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Revenue</th>
                        <th>Total Appointments</th>
                        <th>Pending</th>
                        <th>Completed</th>
                        <th>Canceled</th>
                        <th>Avg. Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentData.map((data, index) => (
                        <tr key={index}>
                          <td>{data.month}</td>
                          <td>{data.revenue}</td>
                          <td>{data.totalAppointments}</td>
                          <td>{data.pending}</td>
                          <td>{data.completed}</td>
                          <td>{data.canceled}</td>
                          <td>{data.avgTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_Content;
