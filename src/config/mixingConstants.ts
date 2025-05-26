/**
 * Constants for pH Mixing Calculations with Concrete Wastewater
 * VALORISATION DES EAUX RESIDUELLES ISSUES DU PROCESS DE FABRICATION DU BETON
 * EXTREME SIMULATION MODE FOR MAXIMUM VISIBILITY
 */

export const MIXING_CONSTANTS = {
  // Concrete wastewater properties (real data)
  CONCRETE_WATER_PH: 12.0, // pH de l'eau de gâchage de béton
  
  // Real ocean pH values
  CURRENT_ACIDIFIED_OCEAN_PH: 7.7, // pH actuel de l'eau de mer acidifiée
  NORMAL_OCEAN_PH: 8.1, // pH normal de l'eau de mer
  DEAD_ZONE_PH: 5.0, // pH dans les zones mortes
  TARGET_MARINE_LIFE_PH: 8.0, // pH adapté à la vie marine
  
  // EXTREME SIMULATION PARAMETERS FOR MAXIMUM VISIBILITY
  BASE_MIXING_FACTOR: 50.0, // EXTREME increase for maximum visible demonstration
  OCEAN_BUFFER_FACTOR: 0.1, // Minimal buffering for dramatic changes
  DIMINISHING_RETURNS_FACTOR: 0.99, // Almost no diminishing returns
  
  // Quantity limits (liters) - Based on real production data
  MIN_QUANTITY: 1 as number,
  MAX_QUANTITY: 15000 as number, // Up to 15K liters for dramatic impact demonstration
  
  // pH limits for realistic ocean mixing
  MAX_OCEAN_PH: 10.0, // Increased maximum for extreme results
  MIN_OCEAN_PH: 5.0, // Dead zone minimum
  
  // Volume ratios for calculation - Very small volumes for massive impact
  STANDARD_OCEAN_VOLUME: 5000, // Reduced to 5K liters for EXTREME visible results
  
  // Preset quantities for UI - Range from small tests to massive impact
  PRESET_QUANTITIES: [100, 500, 1000, 2500, 5000, 10000],
  
  // Impact categories based on real pH restoration needs - VERY LOW THRESHOLDS
  IMPACT_CATEGORIES: {
    MINIMAL: { threshold: 0.02, label: 'Minimal', color: '#28A745' },
    LOW: { threshold: 0.1, label: 'Low', color: '#FFC107' },
    MODERATE: { threshold: 0.2, label: 'Moderate', color: '#FF6B35' },
    HIGH: { threshold: 0.4, label: 'High', color: '#DC3545' },
    EXTREME: { threshold: Infinity, label: 'Restoration', color: '#6F42C1' }
  },
  
  // Real world data
  ANNUAL_CONCRETE_CONSUMPTION: 6000000000, // 6 milliards de m3
  WATER_NEEDED_PER_M3: 166.67, // 1 milliard de litres / 6 milliards m3
  WASTEWATER_PERCENTAGE: 0.3, // 30% sont des eaux résiduelles
  DEAD_ZONE_MIXING_RATIO: 0.5 // 50% needed for pH 5 → pH 8
} as const;

export type ImpactCategory = keyof typeof MIXING_CONSTANTS.IMPACT_CATEGORIES; 