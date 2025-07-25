'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ✅ Only JS



const Navbar = () => {
  const [consultantData, setConsultantData] = useState(null);
  const [isClient, setIsClient] = useState(false); // for hydration issues
  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const response = await fetch(`https://appointify.coinagesoft.com/api/ConsultantProfile/getConsultantProfile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Failed to fetch consultant data");
        const result = await response.json();
        setConsultantData(result[0]);
      } catch (error) {
        console.error("Error fetching consultant data:", error);
      }
    };
    fetchData();
  }, []);

  // ⛔ Prevent premature render during SSR or before data load
  if (!isClient || !consultantData) return null;

  return (
    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-xl-0 d-xl-none">
        <a className="nav-item nav-link px-0 me-xl-6 ms-0" href="#">
          <i className="ri-menu-fill ri-22px"></i>
        </a>
      </div>

      <div className="navbar-nav-right d-flex justify-content-end align-items-center" id="navbar-collapse">
        <ul className="navbar-nav flex-row align-items-end ms-auto">
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false">
              <div className="avatar avatar-online">
                <img
                  src={
                    consultantData.profileImage
                      ? `https://appointify.coinagesoft.com/${consultantData.profileImage}`
                      : '/assets/img/160x160/img6.jpg'
                  }
                  alt="User"
                  className="rounded-circle"
                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-2">
                      <div className="avatar avatar-online">
                        <img
                          src={
                            consultantData.profileImage
                              ? `https://appointify.coinagesoft.com/${consultantData.profileImage}`
                              : '/assets/img/160x160/img6.jpg'
                          }
                          alt="User"
                          className="rounded-circle"
                          style={{ width: 40, height: 40, objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-medium d-block small">{consultantData.fullName || 'User'}</span>
                      <small className="text-muted">Admin</small>
                    </div>
                  </div>
                </a>
              </li>
              <li><div className="dropdown-divider"></div></li>
              <li><Link className="dropdown-item" href="/Dashboard/Profile"><i className="ri-user-3-line ri-22px me-3"></i>My Profile</Link></li>
              <li><Link className="dropdown-item" href="/Dashboard/Security"><i className="ri-settings-4-line ri-22px me-3"></i>Security</Link></li>
              <li><a className="dropdown-item" href="pages-faq.html"><i className="ri-question-line ri-22px me-3"></i>FAQ</a></li>
              <li>
                <div className="d-grid px-4 pt-2 pb-1">
                  <button className="btn btn-sm btn-danger d-flex" onClick={handleLogOut}>
                    <small className="align-middle">Logout</small>
                    <i className="ri-logout-box-r-line ms-2 ri-16px"></i>
                  </button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
