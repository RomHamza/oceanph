/**
 * Coordinates Formatting Utilities
 * Functions for formatting and displaying geographical coordinates
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Format a coordinate value with direction indicator
 */
export const formatCoordinate = (value: number, type: 'lat' | 'lng'): string => {
  const direction = type === 'lat' 
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  return `${Math.abs(value).toFixed(4)}° ${direction}`;
};

/**
 * Format coordinates as a readable string
 */
export const formatCoordinates = (coordinates: Coordinates): string => {
  const lat = formatCoordinate(coordinates.latitude, 'lat');
  const lng = formatCoordinate(coordinates.longitude, 'lng');
  return `${lat}, ${lng}`;
};

/**
 * Round coordinates to specified decimal places
 */
export const roundCoordinates = (coordinates: Coordinates, decimals: number = 4): Coordinates => {
  const factor = Math.pow(10, decimals);
  return {
    latitude: Math.round(coordinates.latitude * factor) / factor,
    longitude: Math.round(coordinates.longitude * factor) / factor,
  };
};

/**
 * Validate if coordinates are within valid ranges
 */
export const validateCoordinates = (coordinates: Coordinates): boolean => {
  const { latitude, longitude } = coordinates;
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};

/**
 * Convert decimal degrees to degrees, minutes, seconds format
 */
export const toDMS = (decimal: number, type: 'lat' | 'lng'): string => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2);
  
  const direction = type === 'lat' 
    ? (decimal >= 0 ? 'N' : 'S')
    : (decimal >= 0 ? 'E' : 'W');
    
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};

/**
 * Format coordinates in DMS format
 */
export const formatCoordinatesDMS = (coordinates: Coordinates): string => {
  const lat = toDMS(coordinates.latitude, 'lat');
  const lng = toDMS(coordinates.longitude, 'lng');
  return `${lat}, ${lng}`;
}; 