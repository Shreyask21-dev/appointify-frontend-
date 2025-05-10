import React, { useState } from 'react';

const Section7 = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const mapSrc =
    lat && lng
      ? `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      : '';

  const handleAddOrUpdate = () => {
    if (!lat || !lng) return;

    const newLocation = { lat, lng };

    if (selectedIndex !== null) {
      // Update existing location
      const updatedLocations = [...locations];
      updatedLocations[selectedIndex] = newLocation;
      setLocations(updatedLocations);
      setSelectedIndex(null);
    } else {
      // Add new location
      setLocations([...locations, newLocation]);
    }

    setLat('');
    setLng('');
  };

  const handleEdit = (index) => {
    setLat(locations[index].lat);
    setLng(locations[index].lng);
    setSelectedIndex(index);
  };

  const handleDelete = (index) => {
    const updated = locations.filter((_, i) => i !== index);
    setLocations(updated);
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setLat('');
      setLng('');
    }
  };

  return (
    <div className="card p-4 mt-5">
      <h5 className="mb-3 text-muted">Select Location Manually</h5>

      <p className="small text-muted">
        👉 Open{' '}
        <a
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Maps
        </a>{' '}
        → Right-click on a location → Copy coordinates → Paste below
      </p>

      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            placeholder="Latitude"
            className="form-control"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Longitude"
            className="form-control"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-primary mb-4" onClick={handleAddOrUpdate}>
        {selectedIndex !== null ? '✏️ Update Location' : '➕ Add Location'}
      </button>

      {mapSrc && (
        <div style={{ width: '100%', height: '400px' }} className="mb-4">
          <iframe
            title="User Selected Map"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}

      {locations.length > 0 && (
        <>
          <h6 className="text-muted">Saved Locations:</h6>
          <ul className="list-group">
            {locations.map((loc, index) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={index}
              >
                <span>
                  📍 Lat: {loc.lat}, Lng: {loc.lng}
                </span>
                <span>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(index)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    🗑️ Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Section7;
