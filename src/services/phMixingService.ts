/**
 * pH Mixing Service for Concrete Water Addition
 * Implements mixing calculations based on presentation slides
 * Example from Slide 10: pH 5 + pH 12 → pH 7.5-8
 */

import { MIXING_CONSTANTS, type ImpactCategory } from '../config/mixingConstants';

export interface MixingResult {
  newPh: number;
  phChange: number;
  impactCategory: ImpactCategory;
  impactColor: string;
  efficiency: number;
  mixingRatio: number;
  isValid: boolean;
  warnings: string[];
}

export interface MixingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Main function to calculate new pH after adding concrete water
 * Based on slide example and realistic ocean buffering
 */
export function calculateNewPh(
  initialPh: number,
  quantityAddedInLiters: number,
  concreteWaterPh: number = MIXING_CONSTANTS.CONCRETE_WATER_PH
): MixingResult {
  const validation = validateMixingInputs(initialPh, quantityAddedInLiters, concreteWaterPh);
  
  if (!validation.isValid) {
    return {
      newPh: initialPh,
      phChange: 0,
      impactCategory: 'MINIMAL',
      impactColor: MIXING_CONSTANTS.IMPACT_CATEGORIES.MINIMAL.color,
      efficiency: 0,
      mixingRatio: 0,
      isValid: false,
      warnings: validation.errors
    };
  }

  // Calculate mixing ratio
  const mixingRatio = calculateMixingRatio(MIXING_CONSTANTS.STANDARD_OCEAN_VOLUME, quantityAddedInLiters);
  
  // Apply the mixing formula based on slide principles
  const theoreticalPh = calculateTheoreticalMixedPh(initialPh, concreteWaterPh, mixingRatio);
  
  // Apply ocean buffer effect and diminishing returns
  const bufferedPh = applyOceanBufferEffect(theoreticalPh, initialPh);
  const finalPh = applyDiminishingReturns(bufferedPh, initialPh, quantityAddedInLiters);
  
  // Ensure pH stays within realistic ocean bounds
  const boundedPh = Math.max(
    MIXING_CONSTANTS.MIN_OCEAN_PH,
    Math.min(MIXING_CONSTANTS.MAX_OCEAN_PH, finalPh)
  );

  const phChange = boundedPh - initialPh;
  const impactCategory = determineImpactCategory(Math.abs(phChange));
  const efficiency = calculateEfficiency(phChange, quantityAddedInLiters);

  return {
    newPh: Number(boundedPh.toFixed(2)),
    phChange: Number(phChange.toFixed(2)),
    impactCategory,
    impactColor: MIXING_CONSTANTS.IMPACT_CATEGORIES[impactCategory].color,
    efficiency: Number(efficiency.toFixed(1)),
    mixingRatio: Number(mixingRatio.toFixed(6)),
    isValid: true,
    warnings: validation.warnings
  };
}

/**
 * Calculate theoretical mixed pH using weighted average approach
 * Inspired by slide example: pH 5 + pH 12 → pH 7.5-8
 */
function calculateTheoreticalMixedPh(
  initialPh: number,
  addedPh: number,
  mixingRatio: number
): number {
  // Convert pH to H+ concentration for proper mixing calculation
  const initialH = Math.pow(10, -initialPh);
  const addedH = Math.pow(10, -addedPh);
  
  // Calculate weighted average of H+ concentrations
  const mixedH = (initialH * (1 - mixingRatio)) + (addedH * mixingRatio);
  
  // Convert back to pH
  const mixedPh = -Math.log10(mixedH);
  
  // Apply base mixing factor to match slide behavior
  const adjustedChange = (mixedPh - initialPh) * MIXING_CONSTANTS.BASE_MIXING_FACTOR;
  
  return initialPh + adjustedChange;
}

/**
 * Apply ocean's natural buffering capacity
 */
function applyOceanBufferEffect(theoreticalPh: number, initialPh: number): number {
  const change = theoreticalPh - initialPh;
  const bufferedChange = change * MIXING_CONSTANTS.OCEAN_BUFFER_FACTOR;
  return initialPh + bufferedChange;
}

/**
 * Apply diminishing returns for larger quantities
 */
function applyDiminishingReturns(
  bufferedPh: number,
  initialPh: number,
  quantityLiters: number
): number {
  const change = bufferedPh - initialPh;
  
  // Diminishing returns based on quantity (logarithmic)
  const diminishingFactor = Math.pow(
    MIXING_CONSTANTS.DIMINISHING_RETURNS_FACTOR,
    Math.log10(quantityLiters + 1)
  );
  
  const adjustedChange = change * diminishingFactor;
  return initialPh + adjustedChange;
}

/**
 * Calculate mixing ratio (volume of added water / total volume)
 */
export function calculateMixingRatio(oceanVolume: number, addedVolume: number): number {
  return addedVolume / (oceanVolume + addedVolume);
}

/**
 * Determine impact category based on pH change magnitude
 */
function determineImpactCategory(phChangeAbs: number): ImpactCategory {
  const categories = MIXING_CONSTANTS.IMPACT_CATEGORIES;
  
  if (phChangeAbs <= categories.MINIMAL.threshold) return 'MINIMAL';
  if (phChangeAbs <= categories.LOW.threshold) return 'LOW';
  if (phChangeAbs <= categories.MODERATE.threshold) return 'MODERATE';
  if (phChangeAbs <= categories.HIGH.threshold) return 'HIGH';
  return 'EXTREME';
}

/**
 * Calculate efficiency (pH change per liter)
 */
function calculateEfficiency(phChange: number, quantityLiters: number): number {
  if (quantityLiters === 0) return 0;
  return Math.abs(phChange) / quantityLiters * 1000; // Per 1000L for readability
}

/**
 * Validate mixing inputs
 */
export function validateMixingInputs(
  initialPh: number,
  quantityLiters: number,
  concreteWaterPh: number
): MixingValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate initial pH
  if (initialPh < 6 || initialPh > 9) {
    errors.push(`pH initial invalide: ${initialPh}. Doit être entre 6 et 9.`);
  }

  // Validate quantity
  if (quantityLiters < MIXING_CONSTANTS.MIN_QUANTITY) {
    errors.push(`Quantité trop faible: ${quantityLiters}L. Minimum: ${MIXING_CONSTANTS.MIN_QUANTITY}L`);
  }
  
  if (quantityLiters > MIXING_CONSTANTS.MAX_QUANTITY) {
    errors.push(`Quantité trop élevée: ${quantityLiters}L. Maximum: ${MIXING_CONSTANTS.MAX_QUANTITY}L`);
  }

  // Validate concrete water pH
  if (concreteWaterPh < 11 || concreteWaterPh > 13) {
    warnings.push(`pH eau béton inhabituel: ${concreteWaterPh}. Attendu: ~12.0`);
  }

  // Warning for very large quantities
  if (quantityLiters > 1000) {
    warnings.push('Quantité très élevée - impact environnemental significatif');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get suggested quantities based on initial pH and desired impact
 */
export function getSuggestedQuantities(initialPh: number): number[] {
  // Filter preset quantities based on what would give meaningful results
  return MIXING_CONSTANTS.PRESET_QUANTITIES.filter(quantity => {
    const result = calculateNewPh(initialPh, quantity);
    return result.isValid && result.phChange > 0.05; // Only suggest if meaningful change
  });
}

/**
 * Calculate quantity needed for target pH change
 */
export function calculateQuantityForTargetChange(
  initialPh: number,
  targetPhChange: number
): number | null {
  if (targetPhChange <= 0 || targetPhChange > 2) return null;

  // Binary search for optimal quantity
  let low = MIXING_CONSTANTS.MIN_QUANTITY;
  let high = MIXING_CONSTANTS.MAX_QUANTITY;
  let bestQuantity = null;
  let bestDifference = Infinity;

  for (let i = 0; i < 20; i++) { // Max 20 iterations
    const mid = (low + high) / 2;
    const result = calculateNewPh(initialPh, mid);
    
    if (!result.isValid) break;
    
    const difference = Math.abs(result.phChange - targetPhChange);
    
    if (difference < bestDifference) {
      bestDifference = difference;
      bestQuantity = mid;
    }

    if (result.phChange < targetPhChange) {
      low = mid;
    } else {
      high = mid;
    }

    if (difference < 0.01) break; // Close enough
  }

  return bestQuantity ? Number(bestQuantity.toFixed(1)) : null;
} 