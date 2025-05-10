'use client'
import Sidebar from '../Dashboard_Page_Components/Sidebar'
import Navbar from '../Dashboard_Page_Components/Navbar'
import Dashboard_Content from '../Dashboard_Page_Components/Dashboard_Content'
const Dashboard = () => {
  return (
      <div className="layout-wrapper layout-content-navbar">
              <div className="layout-container">
                <Sidebar />
                <div className="layout-page">
                  <Navbar />
                  
                  <Dashboard_Content/>
                     {/* <Dashboard_Content/> */}
                </div>
                <div className="layout-overlay layout-menu-toggle"></div>
              </div>
            </div>
  )
};


export default withAuth(Dashboard);
