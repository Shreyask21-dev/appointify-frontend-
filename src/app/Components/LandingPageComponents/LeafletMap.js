'use client';
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const LeafletMap = () => {
  useEffect(() => {
    const mapContainer = L.DomUtil.get("map");

    // Check if a Leaflet map instance already exists
    if (mapContainer != null) {
      mapContainer._leaflet_id = null; // Reset Leaflet ID
    }

    // Initialize the map
    const map = L.map("map", {
      center: [37.4040344, -122.0289704],
      zoom: 13,
      scrollWheelZoom: false,
    });

    // Set map tiles from OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Define the custom marker icon
    const markerIcon = L.icon({
      iconUrl: "/assets/svg/components/map-pin.svg", // Ensure the image is inside 'public'
      iconSize: [50, 45],
    });

    // Add a marker with a popup
    const marker = L.marker([37.4040344, -122.0289704], { icon: markerIcon }).addTo(map);
    marker.bindPopup("153 Williamson Plaza, Maggieberg").openPopup();

    // Cleanup function to remove the map instance on unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="container-fluid mb-3">
      <div className="overflow-hidden">
        <div id="map" className="leaflet" style={{ height: "500px" }}></div>
      </div>
    </div>
  );
};

export default LeafletMap;
