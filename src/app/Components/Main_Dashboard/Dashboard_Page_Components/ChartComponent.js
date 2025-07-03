'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  BarController,
  LineController,
} from 'chart.js';

Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  BarController,
  LineController
);
const API_URL = process.env.REACT_APP_API_URL;
const ChartComponent = () => {
  const revenueChartRef = useRef(null);
  const revenueBarChartRef = useRef(null);
  const growthChartRef = useRef(null);

  const revenueChartInstance = useRef(null);
  const revenueBarChartInstance = useRef(null);
  const growthChartInstance = useRef(null);

  // State to hold fetched data
  const [appointments, setAppointments] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments`); // your backend endpoint
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchData();
  }, []);

  // Update charts whenever appointments data changes
  useEffect(() => {
    if (!appointments.length) return;

    // Destroy old instances
    if (revenueChartInstance.current) revenueChartInstance.current.destroy();
    if (revenueBarChartInstance.current) revenueBarChartInstance.current.destroy();
    if (growthChartInstance.current) growthChartInstance.current.destroy();

    // ========== Prepare data for Pie Chart (Revenue by Month) ==========
    // Aggregate revenue by month (e.g. May, June)
    const revenueByMonth = appointments.reduce((acc, appt) => {
      const month = new Date(appt.appointmentDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + appt.amount;
      return acc;
    }, {});

    const pieLabels = Object.keys(revenueByMonth);
    const pieData = Object.values(revenueByMonth);

    // ========== Prepare data for Bar Chart (Monthly Revenue) ==========
    // Sort months in calendar order for bar chart
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const barLabels = monthOrder.filter(m => pieLabels.includes(m));
    const barData = barLabels.map(m => revenueByMonth[m]);

    // ========== Prepare data for Line Chart (Weekly Growth in Appointments) ==========
    // Count appointments per week in the current month (assuming May 2025)
    // Weeks: Week 1: 1-7, Week 2: 8-14, Week 3: 15-21, Week 4: 22-28, Week 5: 29-31
    const appointmentsByWeek = [0, 0, 0, 0, 0];
    appointments.forEach(appt => {
      const date = new Date(appt.appointmentDate);
      if (date.getMonth() === 4) { // May is 4 (0-based)
        const day = date.getDate();
        if (day <= 7) appointmentsByWeek[0]++;
        else if (day <= 14) appointmentsByWeek[1]++;
        else if (day <= 21) appointmentsByWeek[2]++;
        else if (day <= 28) appointmentsByWeek[3]++;
        else appointmentsByWeek[4]++;
      }
    });
    const lineLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

    // ========== Create Pie Chart ==========
    revenueChartInstance.current = new Chart(revenueChartRef.current, {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [
          {
            label: 'Revenue ($)',
            data: pieData,
            backgroundColor: pieLabels.map((_, i) => `hsl(${(i * 60) % 360}, 70%, 60%)`),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });

    // ========== Create Bar Chart ==========
    revenueBarChartInstance.current = new Chart(revenueBarChartRef.current, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            label: 'Monthly Revenue ($)',
            data: barData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      },
    });

    // ========== Create Line Chart ==========
    growthChartInstance.current = new Chart(growthChartRef.current, {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: [
          {
            label: 'Appointment Count',
            data: appointmentsByWeek,
            borderColor: '#FF6384',
            fill: false,
            tension: 0.3,
          },
        ],
      },
    });

    // Cleanup on unmount
    return () => {
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      if (revenueBarChartInstance.current) revenueBarChartInstance.current.destroy();
      if (growthChartInstance.current) growthChartInstance.current.destroy();
    };
  }, [appointments]);

  return (
    <div className="charts-wrapper mt-5 ms-5">
      <div className="d-flex ms-5">
        <div className="chart-container" style={{ width: "400px", height: "300px" }}>
          <h4>Revenue (Pie)</h4>
          <canvas ref={revenueChartRef}></canvas>
        </div>
        <div className="chart-container" style={{ width: "400px" }}>
          <h4 className="mb-5" style={{ marginBottom: "90px" }}>Monthly Revenue (Bar)</h4>
          <canvas ref={revenueBarChartRef}></canvas>
        </div>
      </div>
      <div className="chart-container mx-auto" style={{ width: "500px", margin: "90px" }}>
        <h3>Appointment Growth (Line)</h3>
        <canvas ref={growthChartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;
