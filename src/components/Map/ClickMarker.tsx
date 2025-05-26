import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Coordinates } from '../../hooks/useMapClick';

interface ClickMarkerProps {
  coordinates: Coordinates | null;
  isOcean?: boolean | null;
  phValue?: number | null;
}

// Custom marker icons
const oceanIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const landIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ClickMarker: React.FC<ClickMarkerProps> = ({ coordinates, isOcean, phValue }) => {
  if (!coordinates) return null;

  const getIcon = () => {
    if (isOcean === null) return defaultIcon;
    return isOcean ? oceanIcon : landIcon;
  };

  const getPopupContent = () => {
    const lat = coordinates.latitude.toFixed(4);
    const lng = coordinates.longitude.toFixed(4);
    
    if (isOcean === null) {
      return `Coordinates: ${lat}, ${lng}<br/>Analyzing...`;
    }
    
    if (!isOcean) {
      return `Coordinates: ${lat}, ${lng}<br/>Location: Land`;
    }
    
    return `Coordinates: ${lat}, ${lng}<br/>Location: Ocean<br/>pH: ${phValue?.toFixed(2) || 'Calculating...'}`;
  };

  return (
    <Marker 
      position={[coordinates.latitude, coordinates.longitude]} 
      icon={getIcon()}
    >
      <Popup>
        <div dangerouslySetInnerHTML={{ __html: getPopupContent() }} />
      </Popup>
    </Marker>
  );
};

export default ClickMarker; 