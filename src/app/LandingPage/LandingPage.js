'use client';
import React, { useEffect , useRef,useState } from 'react'
import '../../../dist/assets/css/theme.min.css'
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '../../../dist/assets/css/theme.min.css'
import Header from '../Components/LandingPageComponents/Header'
import Hero from '../Components/LandingPageComponents/Hero'
import Head from 'next/head';
import Consultant_Info from '../Components/LandingPageComponents/Consultant_Info';
import EmpoweringMinds from '../Components/LandingPageComponents/EmpoweringMinds';
import Plans from '../Components/LandingPageComponents/Plans';
import Stats from '../Components/LandingPageComponents/Stats';
import Contact_Calender from '../Components/LandingPageComponents/Contact_Calender';
// import LeafletMap from '../Components/LandingPageComponents/LeafletMap';
import Footer from '../Components/LandingPageComponents/Footer';
import LeafletMap from '../Components/LandingPageComponents/LeafletMap';
import FAQSection from '../Components/LandingPageComponents/FAQSection';

const LandingPage = () => {
   const targetRef = useRef(null);
  const [selectedPlan, setSelectedPlan] = useState({
  planName: '',
  planPrice: '',
  planDuration: '',
});
    const scrollToSection = (planData) => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSelectedPlan(planData)
  };


  return (
    <>
    <Head>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.7/semantic.min.css"/>
   <link rel="stylesheet" href="../../../dist/assets/vendor/bootstrap/dist/css/bootstrap.min.css"/>
   <link rel="stylesheet" href="https://fonts.googleapis.com"/>
   <link rel="stylesheet" href="https://fonts.gstatic.com"/>
   </Head>
     <div>

      {/* Content */}
           <Header/>
            <Hero/>
            <Consultant_Info/>
            <EmpoweringMinds/>
            <Stats/>
            <Plans scrollToSection={scrollToSection}/>
            <Contact_Calender ref={targetRef}  prefillData={selectedPlan}/>
            <FAQSection/>
            <LeafletMap/>
            <Footer/>
      
      
      

      {/* Scripts */}
    
    <script src="/dist/assets/js/theme.min.js" defer></script>
    <script src="/dist/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js" defer></script>
    <script src="./node_modules/swiper/swiper-bundle.min.js" defer></script>

    <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
  
   
     <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>      
    </div>
    </>
  )
}

export default LandingPage
