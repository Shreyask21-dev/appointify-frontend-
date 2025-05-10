'use Client';
import React from 'react'
import ChartComponent from './ChartComponent';


   const Dashboard_Content = () => {
  return (
    <div> 
      <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row g-6">
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
                          <h3 className="mb-0 fw-bold text-primary">42</h3>
                        </div>
                        <p className="text-muted">Upcoming consultations</p>
                        <p className="mb-0 text-success">
                          <span className="fw-medium">+18.2%</span>
                          <small className="text-muted">
                            compared to last month
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6 col-lg-3">
                    <div className="card card-border-shadow-warning h-100">
                      <div className="card-body d-flex flex-column justify-content-between">
                        <h6 className="text-muted">Pending Requests</h6>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar me-3">
                            <span className="avatar-initial rounded-circle bg-label-warning p-3">
                              <i className="ri-time-line ri-24px text-white"></i>
                            </span>
                          </div>
                          <h3 className="mb-0 fw-bold text-warning">8</h3>
                        </div>
                        <p className="text-muted">New appointment requests</p>
                        <p className="mb-0 text-danger"></p>
                      </div>
                    </div>
                  </div>
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
                          <h3 className="mb-0 fw-bold text-danger">27</h3>
                        </div>
                        <p className="text-muted">Successful consultations</p>
                        <p className="mb-0 text-success">
                          <span className="fw-medium">+4.3%</span>
                          <small className="text-muted">
                            compared to last month
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <div className="card card-border-shadow-info h-100 ">
                      <div className="card-body d-flex flex-column justify-content-between">
                        <h6 className="text-muted">Canceled/Rescheduled</h6>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar me-3">
                            <span className="avatar-initial rounded-circle bg-label-info p-3">
                              <i className="ri-refresh-line ri-24px text-white"></i>
                            </span>
                          </div>
                          <h3 className="mb-0 fw-bold text-info">13</h3>
                        </div>
                        <p className="text-muted">Appointments changed</p>
                        <p className="mb-0 text-danger">
                          <span className="fw-medium">-2.5%</span>
                          <small className="text-muted">
                            compared to last month
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-6 order-5 order-xxl-0">
                  <div className="charts-wrapper">
                     <ChartComponent />
                   </div>
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <div className="card-title mb-0">
                          <h5 className="m-0 me-2">
                            Revenue & Appointments Overview
                          </h5>
                          <p className="text-muted small m-0">
                            * All consultations are prepaid online
                          </p>
                        </div>
                        <div className="dropdown">
                          <button
                            className="btn btn-text-secondary rounded-pill text-muted border-0 p-1"
                            type="button"
                            id="optionsMenu"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="ri-more-2-line ri-20px"></i>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="optionsMenu"
                          >
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Refresh
                            </a>
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Share
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body pb-2">
                        <canvas id="appointmentChart" height="50"></canvas>
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
                              <tr>
                                <td>January</td>
                                <td>$10,000</td>
                                <td>28</td>
                                <td>5</td>
                                <td>20</td>
                                <td>3</td>
                                <td>30 min</td>
                              </tr>
                              <tr>
                                <td>February</td>
                                <td>$12,500</td>
                                <td>26</td>
                                <td>3</td>
                                <td>22</td>
                                <td>1</td>
                                <td>28 min</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              

            </div>
    </div>
  )
}

export default Dashboard_Content
