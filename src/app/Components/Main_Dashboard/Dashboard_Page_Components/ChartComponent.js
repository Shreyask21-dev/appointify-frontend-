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

const ChartComponent = () => {
  const revenueChartRef = useRef(null);
  const revenueBarChartRef = useRef(null);
  const growthChartRef = useRef(null);

  const revenueChartInstance = useRef(null);
  const revenueBarChartInstance = useRef(null);
  const growthChartInstance = useRef(null);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://appointify.coinagesoft.com/api/CustomerAppointment/GetAllAppointments`);
        const data = await response.json();
        setAppointments(data);
        console.log("Fetched Appointments:", data.map(a => a.plan));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!appointments.length) return;

    // Destroy old charts
    if (revenueChartInstance.current) revenueChartInstance.current.destroy();
    if (revenueBarChartInstance.current) revenueBarChartInstance.current.destroy();
    if (growthChartInstance.current) growthChartInstance.current.destroy();

    // ========== Pie Chart: Revenue by Plan ==========
    const revenueByPlan = appointments.reduce((acc, appt) => {
      const plan = (appt.plan || 'Unknown Plan').trim();
      acc[plan] = (acc[plan] || 0) + appt.amount;
      return acc;
    }, {});
    const pieLabels = Object.keys(revenueByPlan);
    const pieData = Object.values(revenueByPlan);

    revenueChartInstance.current = new Chart(revenueChartRef.current, {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [
          {
            label: 'Revenue by Plan (₹)',
            data: pieData,
            backgroundColor: pieLabels.map((_, i) => `hsl(${(i * 60) % 360}, 70%, 60%)`),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ₹${value}`;
              },
            },
          },
          legend: { display: true },
        },
      },
    });

    // ========== Bar Chart: Monthly Revenue ==========
    const monthlyRevenueMap = {};

    appointments.forEach(appt => {
      const date = new Date(appt.appointmentDate);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0 = Jan
      const key = `${year}-${month}`;
      if (!monthlyRevenueMap[key]) {
        monthlyRevenueMap[key] = { total: 0, date };
      }
      monthlyRevenueMap[key].total += appt.amount;
    });

    const sortedMonths = Object.entries(monthlyRevenueMap).sort(
      (a, b) => a[1].date - b[1].date
    );

    const barLabels = sortedMonths.map(([_, { date }]) =>
      date.toLocaleString('default', { month: 'short', year: 'numeric' })
    );
// ✅ FIX HERE:
const barData = sortedMonths.map(([_, { total }]) => total);

    revenueBarChartInstance.current = new Chart(revenueBarChartRef.current, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            label: 'Monthly Revenue (₹)',
            data: barData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
               label: function (context) {
      const value = context.raw; // ✅ Use raw, not parsed
      return `₹${value.toLocaleString('en-IN')}`;
              },
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue in ₹',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
      },
    });

    // ========== Line Chart: Weekly Appointments ==========
   const appointmentsByWeek = [0, 0, 0, 0, 0]; // for 5 possible weeks
const currentMonth = new Date().getMonth(); // dynamically get current month
const currentYear = new Date().getFullYear();

appointments.forEach(appt => {
  const date = new Date(appt.appointmentDate);
  if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
    const day = date.getDate();
    const weekIndex = Math.floor((day - 1) / 7); // divide days into weeks
    if (weekIndex >= 0 && weekIndex < 5) {
      appointmentsByWeek[weekIndex]++;
    }
  }
});

// Destroy previous instance if exists
if (growthChartInstance.current) {
  growthChartInstance.current.destroy();
}

growthChartInstance.current = new Chart(growthChartRef.current, {
  type: 'line',
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Appointments This Week',
        data: appointmentsByWeek,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Appointments',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Weeks',
        },
      },
    },
  },
});


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
          <h4>Revenue by Plan (Pie)</h4>
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
