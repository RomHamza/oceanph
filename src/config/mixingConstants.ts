/**
 * Constants for pH Mixing Calculations with Concrete Water
 * Based on presentation slides - specifically Slide 10 example: pH 5 + pH 12 → pH 7.5-8
 */

export const MIXING_CONSTANTS = {
  // Concrete water properties (from slides)
  CONCRETE_WATER_PH: 12.0,
  
  // Mixing calculation parameters
  BASE_MIXING_FACTOR: 0.15, // Based on slide example: significant but not linear
  OCEAN_BUFFER_FACTOR: 0.75, // Ocean's natural buffering capacity
  DIMINISHING_RETURNS_FACTOR: 0.85, // Efficiency decreases with larger quantities
  
  // Quantity limits (liters)
  MIN_QUANTITY: 0.1 as number,
  MAX_QUANTITY: 10000 as number,
  
  // pH limits for ocean mixing
  MAX_OCEAN_PH: 8.5, // Realistic maximum for ocean water
  MIN_OCEAN_PH: 6.5, // Realistic minimum for ocean water
  
  // Volume ratios for calculation
  STANDARD_OCEAN_VOLUME: 1000000, // 1M liters as reference volume
  
  // Preset quantities for UI
  PRESET_QUANTITIES: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500],
  
  // Impact categories based on pH change
  IMPACT_CATEGORIES: {
    MINIMAL: { threshold: 0.1, label: 'Minimal', color: '#28A745' },
    LOW: { threshold: 0.3, label: 'Faible', color: '#FFC107' },
    MODERATE: { threshold: 0.6, label: 'Modéré', color: '#FF6B35' },
    HIGH: { threshold: 1.0, label: 'Élevé', color: '#DC3545' },
    EXTREME: { threshold: Infinity, label: 'Extrême', color: '#6F42C1' }
  }
} as const;

export type ImpactCategory = keyof typeof MIXING_CONSTANTS.IMPACT_CATEGORIES; 