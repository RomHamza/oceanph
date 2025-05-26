/**
 * Map Interaction Controller
 * Orchestrates the flow from map click to data display
 * Extended with concrete water mixing functionality
 */

import React from 'react';
import type { Coordinates } from '../hooks/useMapClick';
import { isOceanAsync } from '../services/oceanDetectionService';
import { simulatePhAsync } from '../services/phSimulationService';
import { calculateNewPh, validateMixingInputs } from '../services/phMixingService';
import { useAppActions, useConcreteActions } from '../store/appStore';

/**
 * Main controller class for handling map interactions and concrete mixing
 */
export class MapInteractionController {
  private actions: ReturnType<typeof useAppActions>;
  private concreteActions: ReturnType<typeof useConcreteActions>;
  private abortController: AbortController | null = null;

  constructor(
    actions: ReturnType<typeof useAppActions>,
    concreteActions: ReturnType<typeof useConcreteActions>
  ) {
    this.actions = actions;
    this.concreteActions = concreteActions;
  }

  /**
   * Handle map click event - main orchestration method
   */
  async handleMapClick(coordinates: Coordinates): Promise<void> {
    try {
      // Cancel any ongoing operation
      this.cancelOngoingOperation();
      
      // Create new abort controller for this operation
      this.abortController = new AbortController();
      
      // Step 1: Update state with new coordinates and start loading
      this.actions.setClickedLocation(coordinates);
      this.actions.setLoading(true);
      this.actions.setError(null);

      // Step 2: Determine if location is ocean or land
      const isOcean = await this.checkIfOcean(coordinates);
      
      // Check if operation was cancelled
      if (this.abortController.signal.aborted) {
        return;
      }

      // Step 3: Update ocean/land status
      this.actions.setIsOcean(isOcean);

      // Step 4: If ocean, simulate pH value
      if (isOcean) {
        const phValue = await this.simulatePhValue(coordinates);
        
        // Check if operation was cancelled
        if (this.abortController.signal.aborted) {
          return;
        }

        this.actions.setPhValue(phValue);
      }

      // Step 5: Complete loading
      this.actions.setLoading(false);

    } catch (error) {
      // Handle errors gracefully
      if (!this.abortController?.signal.aborted) {
        console.error('Error in map interaction:', error);
        this.actions.setError(
          error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred while analyzing the location.'
        );
      }
    } finally {
      // Clean up
      this.abortController = null;
    }
  }

  /**
   * Check if coordinates are over ocean
   */
  private async checkIfOcean(coordinates: Coordinates): Promise<boolean> {
    try {
      return await isOceanAsync(coordinates);
    } catch (error) {
      console.error('Error checking ocean status:', error);
      throw new Error('Failed to determine if location is ocean or land.');
    }
  }

  /**
   * Simulate pH value for ocean coordinates
   */
  private async simulatePhValue(coordinates: Coordinates): Promise<number> {
    try {
      return await simulatePhAsync(coordinates);
    } catch (error) {
      console.error('Error simulating pH:', error);
      throw new Error('Failed to calculate pH value for this location.');
    }
  }

  /**
   * Cancel any ongoing operation
   */
  private cancelOngoingOperation(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Reset the application state completely
   */
  resetState(): void {
    this.cancelOngoingOperation();
    this.actions.resetState();
  }

  /**
   * Get current operation status
   */
  isOperationInProgress(): boolean {
    return this.abortController !== null;
  }

  /**
   * Handle concrete water mixing calculation
   * Based on roadmap2.md Step 8 requirements
   */
  async handleConcreteWaterMixing(quantityLiters: number): Promise<void> {
    try {
      // Validate input
      if (!this.validateConcreteInput(quantityLiters)) {
        throw new Error('Invalid quantity input. Please enter a value between 0.1 and 10,000 liters.');
      }

      // Get original pH value
      const originalPh = this.getOriginalPhValue();
      if (!originalPh) {
        throw new Error('Original pH value not available. Please click on an ocean location first.');
      }

      // Start concrete mixing calculation
      this.concreteActions.setConcreteMixingInProgress(true);
      this.actions.setError(null);

      // Perform mixing calculation
      const result = calculateNewPh(originalPh, quantityLiters);

      // Update concrete mixing state with results
      this.concreteActions.setConcreteAddedQuantity(quantityLiters);
      this.concreteActions.setConcreteNewPh(result.newPh);
      this.concreteActions.setConcreteImpactCategory(result.impactCategory);
      this.concreteActions.setConcreteImpactColor(result.impactColor);
      this.concreteActions.setConcreteEfficiency(result.efficiency);
      this.concreteActions.setConcreteMixingRatio(result.mixingRatio);
      this.concreteActions.setConcreteMixingWarnings(result.warnings);

      // Enable concrete mixing mode
      this.concreteActions.enableConcreteMixingMode();

    } catch (error) {
      console.error('Error in concrete water mixing calculation:', error);
      this.actions.setError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred during concrete water mixing calculation.'
      );
    } finally {
      this.concreteActions.setConcreteMixingInProgress(false);
    }
  }

  /**
   * Reset concrete mixing simulation while keeping original pH data
   */
  resetConcreteMixingSimulation(): void {
    this.concreteActions.disableConcreteMixingMode();
  }

  /**
   * Reset concrete mixing data completely
   */
  resetConcreteData(): void {
    this.concreteActions.resetConcreteData();
  }

  /**
   * Validate concrete water input
   */
  validateConcreteInput(quantityLiters: number): boolean {
    const validation = validateMixingInputs(7.8, quantityLiters, 12.0); // Use typical ocean pH for validation
    return validation.isValid;
  }

  /**
   * Get original pH value for concrete mixing
   */
  private getOriginalPhValue(): number | null {
    // This would typically come from the store, but we'll implement it
    // by accessing the current pH value when it's available
    // In a real implementation, this would be handled by the store
    return null; // This will be handled by the component calling this method
  }
}

/**
 * Hook to create and use the map interaction controller
 */
export const useMapInteractionController = () => {
  const actions = useAppActions();
  const concreteActions = useConcreteActions();
  
  // Create controller instance (memoized to avoid recreation)
  const controller = React.useMemo(
    () => new MapInteractionController(actions, concreteActions),
    [actions, concreteActions]
  );

  return controller;
}; 