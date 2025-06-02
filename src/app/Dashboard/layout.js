'use client';
// app/dashboard/layout.jsx
import Script from "next/script";
import Nav from '../Components/Main_Dashboard/Dashboard_Page_Components/Navbar'
import Side from '../Components/Main_Dashboard/Dashboard_Page_Components/Sidebar'
import Dashboard_Content from '../Components/Main_Dashboard/Dashboard_Page_Components/Dashboard_Content'
import Sidebar from "../Components/Main_Dashboard/Dashboard_Page_Components/Sidebar";
import Navbar from "../Components/Main_Dashboard/Dashboard_Page_Components/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from '../Dashboard/WithAuth/withAuth'


function Layout({ children }) {
    const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
    }
  }, []);
  
  return (
   
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            <Sidebar/>
            <div className="layout-page ">
                <Navbar/>
                {children}
            </div>
            <div className="layout-overlay layout-menu-toggle"></div>
          </div>
        </div>
    
  );
}
export default withAuth(Layout);
