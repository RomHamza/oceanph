/**
 * Service for determining if given coordinates are over ocean or land
 * This is a simplified implementation for simulation purposes
 */

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Debug function to test ocean detection with known coordinates
 */
export const debugOceanDetection = () => {
  console.log('=== DEBUG OCEAN DETECTION ===');
  
  // Test known ocean locations
  console.log('Ocean tests:');
  console.log('Atlantic Ocean (0, 0):', isOcean(0, 0)); // Should be true
  console.log('Pacific Ocean (0, -150):', isOcean(0, -150)); // Should be true
  console.log('Indian Ocean (-20, 80):', isOcean(-20, 80)); // Should be true
  
  // Test known land locations
  console.log('\nLand tests:');
  console.log('Paris, France (48.8566, 2.3522):', isOcean(48.8566, 2.3522)); // Should be false
  console.log('New York, USA (40.7128, -74.0060):', isOcean(40.7128, -74.0060)); // Should be false
  console.log('Tokyo, Japan (35.6762, 139.6503):', isOcean(35.6762, 139.6503)); // Should be false
  
  // Test special cases
  console.log('\nSpecial cases:');
  console.log('Mediterranean Sea (36, 15):', isOcean(36, 15)); // Should be true
  console.log('Black Sea (43, 35):', isOcean(43, 35)); // Should be true
  
  console.log('=== END DEBUG ===');
};

/**
 * SIMPLIFIED AND CORRECTED ocean detection
 * Uses a more straightforward approach with better defined land areas
 */
export const isOcean = (latitude: number, longitude: number): boolean => {
  // Simple approach: define major land masses more accurately
  
  // 1. Check if it's clearly in the middle of oceans first
  if (Math.abs(latitude) > 70) {
    // Polar regions - mostly ocean except for some land masses
    if (longitude >= -75 && longitude <= -10 && latitude > 60) {
      return false; // Greenland
    }
    if (latitude < -60) {
      return false; // Antarctica
    }
    return true; // Polar oceans
  }
  
  // 2. Europe and Western Asia
  if (latitude >= 35 && latitude <= 75 && longitude >= -10 && longitude <= 60) {
    // Special cases for seas within Europe
    if (latitude >= 30 && latitude <= 46 && longitude >= -6 && longitude <= 36) {
      return true; // Mediterranean
    }
    if (latitude >= 40 && latitude <= 48 && longitude >= 27 && longitude <= 42) {
      return true; // Black Sea
    }
    return false; // Europe and western Asia
  }
  
  // 3. Africa
  if (latitude >= -35 && latitude <= 37 && longitude >= -20 && longitude <= 55) {
    // Red Sea exception
    if (latitude >= 12 && latitude <= 30 && longitude >= 32 && longitude <= 43) {
      return true; // Red Sea
    }
    return false; // Africa
  }
  
  // 4. Asia (Eastern)
  if (latitude >= 5 && latitude <= 80 && longitude >= 60 && longitude <= 180) {
    // Caspian Sea
    if (latitude >= 36 && latitude <= 47 && longitude >= 46 && longitude <= 55) {
      return true; // Caspian Sea (treat as ocean for pH)
    }
    return false; // Asia
  }
  
  // 5. North America
  if (latitude >= 25 && latitude <= 70 && longitude >= -170 && longitude <= -50) {
    return false; // North America
  }
  
  // 6. South America
  if (latitude >= -55 && latitude <= 15 && longitude >= -85 && longitude <= -35) {
    return false; // South America
  }
  
  // 7. Australia and Oceania
  if (latitude >= -45 && latitude <= -10 && longitude >= 110 && longitude <= 155) {
    return false; // Australia
  }
  
  // If none of the above, it's ocean
  return true;
};

/**
 * Async version of isOcean for consistency with potential future API calls
 */
export const isOceanAsync = async (coordinates: Coordinates): Promise<boolean> => {
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return isOcean(coordinates.latitude, coordinates.longitude);
};

export type { Coordinates }; 