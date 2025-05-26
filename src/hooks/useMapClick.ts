import { useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseMapClickProps {
  onMapClick: (coordinates: Coordinates) => void;
}

export const useMapClick = ({ onMapClick }: UseMapClickProps) => {
  const map = useMapEvents({
    click: (event: LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const coordinates: Coordinates = {
        latitude: lat,
        longitude: lng
      };
      onMapClick(coordinates);
    }
  });

  return map;
};

export type { Coordinates }; 