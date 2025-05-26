import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MAP_CONFIG } from '../../config/mapConfig';
import './MapDisplay.css';

interface MapDisplayProps {
  children?: React.ReactNode;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ children }) => {
  return (
    <div className="map-container">
      <MapContainer
        center={MAP_CONFIG.initialCenter}
        zoom={MAP_CONFIG.initialZoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        maxBounds={MAP_CONFIG.maxBounds}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={MAP_CONFIG.tileLayer.url}
          attribution={MAP_CONFIG.tileLayer.attribution}
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default MapDisplay; 