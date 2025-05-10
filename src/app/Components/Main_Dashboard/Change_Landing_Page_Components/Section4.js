import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConsultantSection4 = () => {
  const [stats, setStats] = useState([]);

  // 🔽 Fetch stats on component mount
  useEffect(() => {
    axios.get('http://localhost:5056/api/Stat')
      .then(response => {
        const apiStats = response.data.map(stat => ({
          ...stat,
          editedValue: '',
          editedDescription: '',
        }));
        setStats(apiStats);
      })
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  const handleStatChange = (index, newValue) => {
    const updatedStats = [...stats];
    updatedStats[index].editedValue = newValue;
    setStats(updatedStats);
  };

  const handleDescChange = (index, newDesc) => {
    const updatedStats = [...stats];
    updatedStats[index].editedDescription = newDesc;
    setStats(updatedStats);
  };

  const handleDirectionChange = (index, newDirection) => {
    const updatedStats = [...stats];
    updatedStats[index].icon = newDirection;
    setStats(updatedStats);
  };

  const handleSave = (index) => {
    const updatedStats = [...stats];
    const stat = updatedStats[index];

    if (stat.editedValue) {
      stat.value = stat.editedValue + '%';
      stat.editedValue = '';
    }
    if (stat.editedDescription) {
      stat.description = stat.editedDescription;
      stat.editedDescription = '';
    }

    setStats(updatedStats);

    const dataToSend = {
      id: stat.id,
      value: stat.value,
      description: stat.description,
      icon: stat.icon,
    };

    // 🔼 Send updated stat to backend
    axios.put(`http://localhost:5056/api/Stat/${stat.id}`, dataToSend)
      .then(() => {
        console.log('Stat updated:', dataToSend);
      })
      .catch(error => {
        console.error('Error updating stat:', error);
      });
  };

  return (
    <div>
      <h5 className="text-start mb-3 text-muted mt-5">Section 4 - Manage Stats</h5>
      <div className="card p-4 shadow-sm mt-4">
        <div className="row">
          {stats.map((stat, index) => (
            <div key={stat.id} className="col-md-4 mb-5">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <h2 className="fw-bold d-flex align-items-center justify-content-center" style={{ gap: '8px' }}>
                      <i
                        className={`bi ${
                          stat.icon === 'up' ? 'bi-arrow-up-short text-success' : 'bi-arrow-down-short text-danger'
                        }`}
                        style={{ fontSize: '1.5rem' }}
                      ></i>
                      <span className={stat.icon === 'up' ? 'text-success' : 'text-danger'}>{stat.value}</span>
                    </h2>
                    <p className="text-muted">{stat.description}</p>
                  </div>

                  <div className="form-group mb-3 text-start">
                    <label className="form-label">Update Value</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 50"
                      value={stat.editedValue}
                      onChange={(e) => handleStatChange(index, e.target.value)}
                    />
                    <button className="btn btn-outline-success mt-2 w-100" onClick={() => handleSave(index)}>
                      Save Value
                    </button>
                  </div>

                  <div className="form-group mb-3 text-start">
                    <label className="form-label">Trend Direction</label>
                    <select
                      className="form-select"
                      value={stat.icon}
                      onChange={(e) => handleDirectionChange(index, e.target.value)}
                    >
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                    </select>
                  </div>

                  <div className="form-group text-start">
                    <label className="form-label">Update Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Write new description"
                      value={stat.editedDescription}
                      onChange={(e) => handleDescChange(index, e.target.value)}
                    ></textarea>
                    <button className="btn btn-primary mt-2 w-100" onClick={() => handleSave(index)}>
                      Save Description
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultantSection4;
