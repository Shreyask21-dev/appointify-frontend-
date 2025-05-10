import React, { useEffect } from 'react'
import Dashboard_Content from '../Components/Main_Dashboard/Dashboard_Page_Components/Dashboard_Content'

const page = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
    }
  }, []);
  
  return (
    <div>
      <Dashboard_Content/>
    </div>
  )
}

export default page
