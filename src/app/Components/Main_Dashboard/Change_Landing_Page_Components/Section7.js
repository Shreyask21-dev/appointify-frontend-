'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Section7 = () => {
  const [iframeUrl, setIframeUrl] = useState('');
  const [savedUrl, setSavedUrl] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Fetch iframe URL
  const fetchIframeUrl = async () => {
    try {
      const res = await axios.get(`https://appointify.coinagesoft.com/api/Location`);
      const fetchedUrl = res.data.data?.iFrameURL;
      console.log('fetched url -', fetchedUrl);

      if (fetchedUrl) {
        setSavedUrl(fetchedUrl);
        setIframeUrl(fetchedUrl);
      } else {
        setSavedUrl('');
        setIframeUrl('');
      }
    } catch (err) {
      console.error('Error fetching iframe URL:', err);
      setStatusMessage({ type: 'error', text: 'Failed to fetch map URL.' });
    }
  };

  useEffect(() => {
    fetchIframeUrl();
  }, []);

  // Save iframe URL
  const handleSave = async () => {
    const trimmedUrl = iframeUrl.trim();
    if (!trimmedUrl) return;

    console.log('Saving raw string payload:', trimmedUrl);

    try {
      await axios.put(
        `https://appointify.coinagesoft.com/api/Location/iframe`,
        JSON.stringify(trimmedUrl), 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setStatusMessage({ type: 'success', text: 'Map URL updated successfully!' });
      setIsEditMode(false);
      fetchIframeUrl();
    } catch (err) {
      console.error('Save failed:', err.response?.data || err.message || err);
      if (err.response?.data?.errors) {
        console.table(err.response.data.errors);
      }
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.title || 'Failed to save map URL.',
      });
    }
  };

  // Delete iframe URL
  const handleDelete = async () => {
    try {
      await axios.delete(`https://appointify.coinagesoft.com/api/Location`);
      setIframeUrl('');
      setSavedUrl('');
      setStatusMessage({ type: 'success', text: 'Map URL deleted.' });
    } catch (err) {
      console.error('Delete failed:', err);
      setStatusMessage({ type: 'error', text: 'Failed to delete map URL.' });
    }
  };

  return (
    <div className="card p-4 mt-5 shadow rounded">
      {/* Status Message */}
      {statusMessage.text && (
        <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {statusMessage.text}
        </div>
      )}

      <h5 className="mb-3 text-muted">Paste Google Maps Iframe URL</h5>
      <p className="small text-muted">
        👉 Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a> → Search location → 
        Click &quot;Share&quot; → Select &quot;Embed a map&quot; → Copy the <strong>iframe src URL</strong> and paste below.
      </p>

      {/* Edit Mode */}
      {(isEditMode || !savedUrl) && (
        <>
          <textarea
            className="form-control mb-3"
            rows={3}
            placeholder="Paste only iframe src URL like https://www.google.com/maps/embed?..."
            value={iframeUrl}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (raw.includes('<iframe')) {
                const match = raw.match(/src\s*=\s*["']([^"']+)["']/);
                setIframeUrl(match ? match[1] : '');
              } else {
                setIframeUrl(raw);
              }
            }}
          />

          {/* Live Preview */}
          {iframeUrl && (
            <div className="mt-3">
              <h6 className="text-muted">Preview:</h6>
              <iframe
                title="Google Map Preview"
                src={iframeUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="my-4 rounded"
              />
            </div>
          )}

          <div className="d-flex gap-2 mt-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
              disabled={iframeUrl === savedUrl}
            >
              {savedUrl ? 'Update Map URL' : 'Save Map URL'}
            </button>
            {savedUrl && (
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setIframeUrl(savedUrl);
                  setIsEditMode(false);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}

      {/* Display Saved Map */}
      {savedUrl && !isEditMode && (
        <>
          <h6 className="text-muted">Saved Map Preview:</h6>
          <iframe
            title="Google Map View"
            src={savedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="my-4 rounded"
          />

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => setIsEditMode(true)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Section7;
