import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeafletMap = () => {
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    const fetchIframeUrl = async () => {
      try {
        const res = await axios.get('http://localhost:5056/api/Location');
          console.log("res.data.iframeUrl",res.data.iFrameURL,res)
        if (res.data?.iFrameURL) {
          setIframeUrl(res.data.iFrameURL);
      
        }
      } catch (err) {
        console.error('Error loading map:', err);
      }
          console.log("iframeUrl",iframeUrl)
    };

    fetchIframeUrl();
  }, []);

  if (!iframeUrl) return null;

  return (
    <div className="map-container ">
      <iframe
        src={iframeUrl}
        width="100%"
        height="500"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default LeafletMap;
