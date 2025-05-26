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
      console.log('Map clicked!', event.latlng);
      const { lat, lng } = event.latlng;
      const coordinates: Coordinates = {
        latitude: lat,
        longitude: lng
      };
      console.log('Calling onMapClick with coordinates:', coordinates);
      onMapClick(coordinates);
    }
  });

  console.log('Map events registered, map object:', map);
  return map;
};

export type { Coordinates }; 