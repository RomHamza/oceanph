/**
 * pH Simulation Service
 * Generates realistic pH values for ocean locations based on geographical factors
 */

import { PH_CONSTANTS } from '../config/phConstants';
import { isOcean } from './oceanDetectionService';

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate latitude factor for pH variation
 * Polar waters tend to be more acidic due to CO2 solubility
 */
const calculateLatitudeFactor = (latitude: number): number => {
  const absLatitude = Math.abs(latitude);
  
  // Polar regions (more acidic)
  if (absLatitude >= PH_CONSTANTS.POLAR_LATITUDE_THRESHOLD) {
    return PH_CONSTANTS.POLAR_PH_OFFSET;
  }
  
  // Tropical regions (slightly more alkaline)
  if (absLatitude <= PH_CONSTANTS.TROPICAL_LATITUDE_THRESHOLD) {
    return PH_CONSTANTS.TROPICAL_PH_OFFSET;
  }
  
  // Temperate regions - gradual transition
  const temperate_factor = (absLatitude - PH_CONSTANTS.TROPICAL_LATITUDE_THRESHOLD) / 
                          (PH_CONSTANTS.POLAR_LATITUDE_THRESHOLD - PH_CONSTANTS.TROPICAL_LATITUDE_THRESHOLD);
  
  return PH_CONSTANTS.TROPICAL_PH_OFFSET * (1 - temperate_factor) + 
         PH_CONSTANTS.POLAR_PH_OFFSET * temperate_factor;
};

/**
 * Add realistic noise to simulate natural pH fluctuations
 */
const addRealisticNoise = (baseValue: number): number => {
  // Generate random noise between -1 and 1
  const noise = (Math.random() - 0.5) * 2;
  return baseValue + (noise * PH_CONSTANTS.RANDOM_NOISE_FACTOR);
};

/**
 * Clamp pH value to realistic ocean range
 */
const clampPhValue = (value: number): number => {
  return Math.max(PH_CONSTANTS.MIN_PH, Math.min(PH_CONSTANTS.MAX_PH, value));
};

/**
 * Simulate ocean currents effect on pH
 * This is a simplified model based on major ocean currents
 */
const calculateCurrentEffect = (latitude: number, longitude: number): number => {
  // Gulf Stream effect (North Atlantic)
  if (latitude >= 25 && latitude <= 45 && longitude >= -80 && longitude <= -30) {
    return 0.02; // Slightly more alkaline
  }
  
  // Kuroshio Current (North Pacific)
  if (latitude >= 20 && latitude <= 40 && longitude >= 120 && longitude <= 160) {
    return 0.02; // Slightly more alkaline
  }
  
  // Antarctic Circumpolar Current
  if (latitude <= -40) {
    return -0.03; // More acidic due to CO2-rich deep water upwelling
  }
  
  // Equatorial upwelling
  if (Math.abs(latitude) <= 5) {
    return -0.01; // Slightly more acidic due to upwelling
  }
  
  return 0; // No significant current effect
};

/**
 * Main pH simulation function
 * Generates a realistic pH value for given ocean coordinates
 */
export const simulatePh = (latitude: number, longitude: number): number => {
  // Safety check: Ensure this is called only for ocean locations
  if (!isOcean(latitude, longitude)) {
    console.warn('Tentative de simulation pH sur zone terrestre:', { latitude, longitude });
    throw new Error('pH simulation should only be called for ocean locations');
  }

  // Start with average ocean pH
  let ph = PH_CONSTANTS.AVERAGE_PH;
  
  // Apply latitude-based variation
  ph += calculateLatitudeFactor(latitude);
  
  // Apply ocean current effects
  ph += calculateCurrentEffect(latitude, longitude);
  
  // Add realistic noise
  ph = addRealisticNoise(ph);
  
  // Clamp to realistic range
  ph = clampPhValue(ph);
  
  // Round to 2 decimal places for realistic precision
  return Math.round(ph * 100) / 100;
};

/**
 * Async version of simulatePh for consistency with potential future API calls
 */
export const simulatePhAsync = async (coordinates: Coordinates): Promise<number> => {
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return simulatePh(coordinates.latitude, coordinates.longitude);
};

/**
 * Get pH category for display purposes
 */
export const getPhCategory = (ph: number): string => {
  if (ph < 7.8) return 'Acidic';
  if (ph < 7.95) return 'Slightly Acidic';
  if (ph < 8.05) return 'Normal';
  if (ph < 8.1) return 'Slightly Alkaline';
  return 'Alkaline';
};

/**
 * Utility functions for pH analysis
 */
export const phUtils = {
  calculateLatitudeFactor,
  addRealisticNoise,
  clampPhValue,
  calculateCurrentEffect,
};

export type { Coordinates }; 