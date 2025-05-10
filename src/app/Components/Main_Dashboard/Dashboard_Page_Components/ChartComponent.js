'use client';
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    // ✅ Destroy old instances if they exist
    if (revenueChartInstance.current) revenueChartInstance.current.destroy();
    if (revenueBarChartInstance.current) revenueBarChartInstance.current.destroy();
    if (growthChartInstance.current) growthChartInstance.current.destroy();

    // ✅ Pie Chart
    revenueChartInstance.current = new Chart(revenueChartRef.current, {
      type: 'pie',
      data: {
        labels: ['January', 'February'],
        datasets: [
          {
            label: 'Revenue ($)',
            data: [10000, 12500],
            backgroundColor: ['#28a745', '#007bff'],
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

    // ✅ Bar Chart
    revenueBarChartInstance.current = new Chart(revenueBarChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Monthly Revenue ($)',
            data: [10000, 12000, 15000, 13000, 17000, 19000],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      },
    });

    // ✅ Line Chart
    growthChartInstance.current = new Chart(growthChartRef.current, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Appointment Growth Rate (%)',
            data: [5, 12, 8, 15],
            borderColor: '#FF6384',
            fill: false,
            tension: 0.3,
          },
        ],
      },
    });

    // ✅ Cleanup on unmount
    return () => {
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      if (revenueBarChartInstance.current) revenueBarChartInstance.current.destroy();
      if (growthChartInstance.current) growthChartInstance.current.destroy();
    };
  }, []);

  return (
    <div className="charts-wrapper mt-5 ms-5">
      <div className='d-flex ms-5'> 

      <div className="chart-container" style={{width:"400px", height:"300px"}}>
        <h4>Revenue (Pie)</h4>
        <canvas ref={revenueChartRef}></canvas>
      </div>
      <div className="chart-container  "  style={{width:"400px"}}>
        <h4 className='mb-5' style={{marginBottom:"90px"}}> Monthly Revenue (Bar)</h4>
        <canvas ref={revenueBarChartRef} ></canvas>
      </div>
      </div>
      <div className="chart-container mx-auto" style={{width:"500px",margin:"90px"}}>
        <h3>Appointment Growth (Line)</h3>
        <canvas ref={growthChartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;
