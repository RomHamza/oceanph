export const MAP_CONFIG = {
  // Initial view configuration
  initialCenter: [0, 0] as [number, number],
  initialZoom: 2,
  minZoom: 1,
  maxZoom: 18,
  
  // Map bounds (world view)
  maxBounds: [
    [-90, -180],
    [90, 180]
  ] as [[number, number], [number, number]],
  
  // Tile layer configuration
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
} as const; 