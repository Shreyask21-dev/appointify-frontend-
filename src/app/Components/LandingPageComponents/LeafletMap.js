import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeafletMap = () => {
  const [iframeHtml, setIframeHtml] = useState('');

  useEffect(() => {
    const fetchIframeUrl = async () => {
      try {
    const res = await axios.get(`https://appointify.coinagesoft.com/api/Location`);
if (res.data?.iFrameURL) {
  const match = res.data.iFrameURL.match(/src="([^"]+)"/);
  if (match && match[1]) {
    setIframeHtml(match[1]);
  } else {
    console.warn("No valid iframe src found in:", res.data.iFrameURL);
  }
}
      } catch (err) {
        console.error('Error loading map:', err);
      }
    };

    fetchIframeUrl();
  }, []);

  if (!iframeHtml) return null;

  return (
    <section className="container my-5 py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Find Us on the Map</h2>
        <p className="text-muted">We’re located at the heart of the city</p>
      </div>

      {/* <div className="ratio ratio-16x9 rounded shadow overflow-hidden" >
        <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
      </div> */}
      {iframeHtml && (
        <div className="ratio ratio-16x9 rounded shadow overflow-hidden">
          <iframe
            src={iframeHtml}
            title="Google Map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
        </div>
      )}
    </section>
  );
};

export default LeafletMap;
