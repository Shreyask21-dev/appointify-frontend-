'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Sidebar = ({ mobileSidebarVisible, setMobileSidebarVisible }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // for md+

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        mobileSidebarVisible &&
        !e.target.closest('#layout-menu') &&
        !e.target.closest('.layout-menu-toggle')
      ) {
        setMobileSidebarVisible(false);
      }

      console.log(
        'Sidebar class applied:',
        mobileSidebarVisible ? 'mobile-sidebar-show' : 'mobile-sidebar-hide'
      );
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [mobileSidebarVisible]);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div>
      <aside
        id="layout-menu"
        className={`layout-menu menu-vertical menu bg-menu-theme bg-fixed 
          ${sidebarCollapsed ? 'collapsed-sidebar' : ''} 
          ${mobileSidebarVisible ? 'mobile-sidebar-show' : 'mobile-sidebar-hide'}`}
      >
        <div className="app-brand demo">
          <a href="/Dashboard" className="app-brand-link">
            <span className="app-brand-logo demo">
              <img
                src="/assets/img/Logo.png"
                alt="PNJ Logo"
                className="sidebar-logo"
              />
            </span>
          </a>

          {/* Desktop toggle (md and up) */}
          <button
            className="layout-menu-toggle d-none d-md-block ms-auto"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z"
                fillOpacity="0.9"
              />
              <path
                d="M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z"
                fillOpacity="0.4"
              />
            </svg>
          </button>

       
        </div>

        {/* <div className="menu-inner-shadow"></div> */}

        <ul className="menu-inner py-1">
          <li className="menu-item">
            <Link href="/Dashboard" className="menu-link">
              <i className="menu-icon tf-icons ri-dashboard-line me-2"></i>
              <div>Dashboard</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/Dashboard/Change_Landing_Page" className="menu-link">
              <i className="menu-icon tf-icons ri-pages-line me-2"></i>
              <div>Change Landing Page</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/Dashboard/Calendar" className="menu-link">
              <i className="menu-icon tf-icons ri-calendar-line me-2"></i>
              <div>Calendar</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/Dashboard/Appointments" className="menu-link">
              <i className="menu-icon tf-icons ri-calendar-check-line me-2"></i>
              <div>Appointments</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/Dashboard/Users" className="menu-link">
              <i className="menu-icon tf-icons ri-group-line me-2"></i>
              <div>Users</div>
            </Link>
          </li>

          {/* Plans */}
          <li className="menu-item">
            <a
              className="menu-link menu-toggle cursor-pointer"
              onClick={() => toggleMenu('plans')}
            >
              <i className="menu-icon tf-icons ri-price-tag-3-line me-2"></i>
              <div>Plans</div>
            </a>
            <ul
              className={`menu-sub ${openMenu === 'plans' ? 'd-block' : 'd-none'}`}
            >
              <li className="menu-item">
                <Link href="/Dashboard/Add_Plan" className="menu-link">
                  <div>Add Plan</div>
                </Link>
              </li>
              <li className="menu-item">
                <Link href="/Dashboard/Plan_List" className="menu-link">
                  <div>Plan List</div>
                </Link>
              </li>
            </ul>
          </li>

          {/* Account Settings */}
          <li className="menu-item">
            <a
              className="menu-link menu-toggle cursor-pointer"
              onClick={() => toggleMenu('account')}
            >
              <i className="menu-icon tf-icons ri-settings-3-line me-2"></i>
              <div>Account Settings</div>
            </a>
            <ul
              className={`menu-sub ${openMenu === 'account' ? 'd-block' : 'd-none'}`}
            >
              <li className="menu-item">
                <Link href="/Dashboard/Profile" className="menu-link">
                  <div>My Profile</div>
                </Link>
              </li>
              <li className="menu-item">
                <Link href="/Dashboard/Security" className="menu-link">
                  <div>Security</div>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
