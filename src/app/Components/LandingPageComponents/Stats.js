'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5056/api/Stat')
      .then(response => {
        setStats(response.data); // store the full array
      })
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className="rounded-2 mx-3 mx-lg-10">
      <div className="container bg-white content-space-2">
        <div className="row justify-content-center">
          {stats.map((stat, index) => (
            <div className="col-sm-6 col-md-4 mb-7 mb-md-0" key={stat.id || index}>
              <div className="text-center">
                <h2 className="display-4">
                  <i
                    className={`bi-arrow-${stat.icon === 'down' ? 'down' : 'up'}-short text-${stat.icon === 'down' ? 'danger' : 'success'}`}
                    aria-hidden="true"
                  ></i>
                  <span className={`text-${stat.icon === 'down' ? 'danger' : 'success'}`}>{stat.value}</span>
                </h2>
                <p className="mb-0">
                  <strong>{stat.description}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
