'use client';

import React, { useEffect, useState } from 'react';
import ChartComponent from './ChartComponent';
import axios from 'axios';

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
    axios.get('https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments')
      .then(({ data }) => {
        if (!data || data.length === 0) return;

        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Build month-wise data
        const sorted = [...data].sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        const startDate = new Date(sorted[0].createdDate);
        const endDate = new Date();

        const monthYearMap = new Map();
        const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        while (
          cursor.getFullYear() < endDate.getFullYear() ||
          (cursor.getFullYear() === endDate.getFullYear() && cursor.getMonth() <= endDate.getMonth())
        ) {
          const key = `${monthNames[cursor.getMonth()]}-${cursor.getFullYear()}`;
          monthYearMap.set(key, {
            totalAppointments: 0,
            pending: 0,
            completed: [],
            canceled: 0,
            rescheduled: 0
          });
          cursor.setMonth(cursor.getMonth() + 1);
        }

        // Aggregate data by month
        data.forEach(item => {
          const date = new Date(item.createdDate);
          const key = `${monthNames[date.getMonth()]}-${date.getFullYear()}`;

          const group = monthYearMap.get(key);
          if (!group) return;

          group.totalAppointments += 1;

          switch (item.appointmentStatus) {
            case 4:
              group.pending += 1;
              break;
            case 1:
              group.completed.push(item);
              break;
            case 2:
              group.canceled += 1;
              break;
            case 3:
              group.rescheduled += 1;
              break;
          }
        });

        const monthlyData = [];
        monthYearMap.forEach((group, key) => {
          const completedCount = group.completed.length;
          const revenue = group.completed.reduce((sum, item) => sum + (item.amount || 0), 0);
          const totalDuration = group.completed.reduce((sum, item) => sum + (item.duration || 0), 0);
          const avgDuration = completedCount > 0 ? `${Math.round(totalDuration / completedCount)} min` : '0 min';

          monthlyData.push({
            month: key,
            revenue: `₹${revenue}`,
            totalAppointments: group.totalAppointments,
            pending: group.pending,
            completed: completedCount,
            canceled: group.canceled + group.rescheduled,
            avgTime: avgDuration
          });
        });

        const allCompleted = data.filter(item => item.appointmentStatus === 1);
        const totalRevenue = allCompleted.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalDuration = allCompleted.reduce((sum, item) => sum + (item.duration || 0), 0);
        const avgDuration = allCompleted.length > 0 ? `${Math.round(totalDuration / allCompleted.length)} min` : '0 min';

        setStats({
          totalAppointments: data.length,
          scheduledAppointment: data.filter(item => item.appointmentStatus === 0).length,
          completedSessions: allCompleted.length,
          canceled_rescheduledAppointments: data.filter(item => [2, 3].includes(item.appointmentStatus)).length,
          totalRevenue,
          avgDuration
        });

        setAppointmentData(monthlyData);
      })
      .catch(error => {
        console.error('Failed to fetch dashboard data:', error);
      });
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-xxl container-p-y">
        <div className="row g-4 mb-4">
          {[
            { title: 'Total Appointments', icon: 'ri-calendar-check-line', color: 'primary', value: stats.totalAppointments },
            { title: 'Scheduled Appointment', icon: 'ri-time-line', color: 'warning', value: stats.scheduledAppointment },
            { title: 'Completed Sessions', icon: 'ri-check-double-line', color: 'danger', value: stats.completedSessions },
            { title: 'Canceled/Rescheduled', icon: 'ri-refresh-line', color: 'info', value: stats.canceled_rescheduledAppointments }
          ].map((item, idx) => (
            <div key={idx} className="col-sm-6 col-lg-3">
              <div className={`card card-border-shadow-${item.color} h-100`}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <h6 className="text-muted">{item.title}</h6>
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar me-3">
                      <span className={`avatar-initial rounded-circle bg-label-${item.color} p-3`}>
                        <i className={`${item.icon} ri-24px text-white`}></i>
                      </span>
                    </div>
                    <h3 className={`mb-0 fw-bold text-${item.color}`}>{item.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart and Table Section - Consistent Width */}
       <div className="row g-4">
  {/* Chart Section */}
  <div className="">
    <div className=" ">
      <ChartComponent />
    </div>
  </div>

  {/* Table Section */}
  <div className="col-12">
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="card-title mb-0">
          <h5 className="m-0 me-2">Revenue & Appointments Overview</h5>
          <p className="text-muted small m-0">* All consultations are prepaid online</p>
        </div>
      </div>
      <div className="card-body pb-2">
        <div className="table-responsive">
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

        {/* Padding if fewer rows */}
        {appointmentData.length < 5 && (
          <div style={{ height: `${(5 - appointmentData.length) * 40}px` }} />
        )}
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
  );
};

export default Dashboard_Content;
