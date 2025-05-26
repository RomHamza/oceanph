/**
 * pH Constants for Ocean Simulation
 * Based on real oceanographic data and research
 */

export const PH_CONSTANTS = {
  // Realistic pH range for ocean water
  MIN_PH: 7.7,
  MAX_PH: 8.1,
  
  // Average ocean pH (slightly alkaline)
  AVERAGE_PH: 8.0,
  
  // Variation factors
  LATITUDE_VARIATION_FACTOR: 0.15, // How much latitude affects pH
  RANDOM_NOISE_FACTOR: 0.05, // Random variation to simulate natural fluctuations
  
  // Regional modifiers
  POLAR_PH_OFFSET: -0.1, // Polar waters tend to be slightly more acidic
  TROPICAL_PH_OFFSET: 0.05, // Tropical waters tend to be slightly more alkaline
  
  // Latitude thresholds
  POLAR_LATITUDE_THRESHOLD: 60, // Above this latitude is considered polar
  TROPICAL_LATITUDE_THRESHOLD: 23.5, // Below this latitude is considered tropical
  
  // Depth simulation (for future enhancement)
  SURFACE_PH_MODIFIER: 0.02,
  DEEP_WATER_PH_MODIFIER: -0.03,
} as const;

/**
 * pH color coding for visualization
 * Based on the color scale mentioned in slide 36
 */
export const PH_COLOR_SCALE = {
  // More acidic (lower pH) - warmer colors
  7.7: '#FF4444', // Red
  7.8: '#FF8844', // Orange-red
  7.9: '#FFAA44', // Orange
  8.0: '#44AA44', // Green (neutral/average)
  8.1: '#4488FF', // Blue (more alkaline)
} as const;

/**
 * Get color for a given pH value
 */
export const getPhColor = (ph: number): string => {
  if (ph <= 7.7) return PH_COLOR_SCALE[7.7];
  if (ph <= 7.8) return PH_COLOR_SCALE[7.8];
  if (ph <= 7.9) return PH_COLOR_SCALE[7.9];
  if (ph <= 8.0) return PH_COLOR_SCALE[8.0];
  return PH_COLOR_SCALE[8.1];
}; 