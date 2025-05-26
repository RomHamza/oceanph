import React from 'react';
import { useMapClick, type Coordinates } from '../../hooks/useMapClick';

interface MapClickHandlerProps {
  onMapClick: (coordinates: Coordinates) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapClick({ onMapClick });
  
  // This component doesn't render anything visible
  return null;
};

export default MapClickHandler; 