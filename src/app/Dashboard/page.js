"use client";
import React, { useEffect } from 'react'
import Dashboard_Content from '../Components/Main_Dashboard/Dashboard_Page_Components/Dashboard_Content'
import { useRouter } from 'next/navigation';
import withAuth from '../Dashboard/WithAuth/withAuth'

const DashboardPage = () => {
    const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
    }
  }, []);
  
  return (
       
       <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            
       <Dashboard_Content/>
        </div>           
    </div>
  )
}

export default withAuth(DashboardPage);