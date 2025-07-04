'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CountUp from 'react-countup';

const API_URL = process.env.REACT_APP_API_URL;
const Stats = () => {
  const [stats, setStats] = useState([]);

  const iconMap = {
    people: 'bi-people-fill',
    success: 'bi-graph-up',
    danger: 'bi-graph-down',
    satisfaction: 'bi-emoji-smile-fill',
    growth: 'bi-bar-chart-line-fill',
    calendar: 'bi-calendar-check-fill',
    default: 'bi-bar-chart'
  };

  useEffect(() => {
    axios.get(`https://appointify.coinagesoft.com/api/Stat`)
      .then(response => {
        setStats(response.data); // store the full array
      })
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        integrity="sha512-...your-integrity..."
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />

      <div className="rounded-2 mx-3 mx-lg-10">
        <div className="container bg-white content-space-2 mt-5 pt-5">

          <div className="row justify-content-center mb-5">
            <div className="col-md-8 text-center">
              <h2 className="fw-bold">Our Achievements</h2>
              <p className="text-muted">These numbers speak for the trust and impact we’ve created.</p>
            </div>
          </div>

          <div className="row justify-content-center">
            {stats.map((stat, index) => {

              const iconClass = stat.icon || 'fa-chart-bar'; // default Font Awesome icon

              const trendClass = stat.trend === 'down' ? 'text-danger' : 'text-primary';

              return (
                <div className="col-sm-6 col-md-4 mb-4" key={stat.id || index}>
                  <div className="card h-100 shadow-sm border-0 text-center">
                    <div className="card-body">

                      <div className="mb-3">
                        <i className={`fa ${iconClass} ${trendClass}`} style={{ fontSize: '2rem' }}></i>
                      </div>

                      <h2 className={`display-6 fw-bold ${trendClass}`}>
                        <CountUp end={parseInt(stat.value.replace(/[^\d]/g, ''), 10)} duration={2} suffix="%" />
                      </h2>
                      <p className="mb-0">
                        <strong>{stat.description}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
