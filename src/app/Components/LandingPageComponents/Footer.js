'use client';
import Link from 'next/link';
import React from 'react';


const Footer = () => {
  return (
    <footer className="bg-black">
      <div className="container pb-1 pt-5 ">

        {/* Copyright */}
        <div className="w-md-85 text-lg-center mx-lg-auto">
          <p className="text-white">
            &copy; 2025 Coinage Inc. All rights reserved.
          </p>


          <p>
            <Link href="/Terms" className="text-light small">Terms and Conditions</Link> |{" "}
            <Link href="/Cancellation" className="text-light small">Cancellation & Refund Policy</Link> |{" "}
            <Link href="/Shipping" className="text-light small">Shipping & Delivery Policy</Link>
          </p>

        </div>
        {/* End Copyright */}
      </div>
    </footer>
  );
};

export default Footer;
