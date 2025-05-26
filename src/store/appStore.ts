/**
 * Global Application Store using Zustand
 * Manages the state for map interactions, coordinates, and pH data
 * Extended with concrete water mixing functionality
 */

import React from 'react';
import { create } from 'zustand';
import type { Coordinates } from '../hooks/useMapClick';
import type { ImpactCategory } from '../config/mixingConstants';

interface AppState {
  // Current state
  clickedCoordinates: Coordinates | null;
  simulatedPhValue: number | null;
  isOceanLocation: boolean | null;
  isLoading: boolean;
  error: string | null;
  
  // Concrete water mixing state
  concreteOriginalPhValue: number | null;        // pH before concrete water addition
  concreteAddedQuantityLiters: number | null;    // Quantity of concrete water added in liters
  concreteNewPhValue: number | null;             // pH after concrete water mixing
  isConcreteMixingMode: boolean;                 // Concrete mixing mode activated
  concreteMixingInProgress: boolean;             // Calculation in progress
  concreteMixingRatio: number | null;            // Mixing ratio (added volume / total volume)
  concreteImpactCategory: ImpactCategory | null; // Impact category (MINIMAL, LOW, etc.)
  concreteImpactColor: string | null;            // Color for impact visualization
  concreteEfficiency: number | null;             // pH change per liter efficiency
  concreteMixingWarnings: string[];              // Warnings from mixing calculation
  
  // Actions
  setClickedLocation: (coordinates: Coordinates) => void;
  setPhValue: (value: number) => void;
  setIsOcean: (isOcean: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
  
  // Concrete mixing actions
  setConcreteOriginalPh: (value: number) => void;
  setConcreteAddedQuantity: (liters: number) => void;
  setConcreteNewPh: (value: number) => void;
  setConcreteImpactCategory: (category: ImpactCategory) => void;
  setConcreteImpactColor: (color: string) => void;
  setConcreteEfficiency: (efficiency: number) => void;
  setConcreteMixingRatio: (ratio: number) => void;
  setConcreteMixingWarnings: (warnings: string[]) => void;
  enableConcreteMixingMode: () => void;
  disableConcreteMixingMode: () => void;
  setConcreteMixingInProgress: (inProgress: boolean) => void;
  resetConcreteData: () => void;
  
  // Computed getters
  hasValidData: () => boolean;
  getLocationStatus: () => 'unknown' | 'ocean' | 'land';
  hasConcreteData: () => boolean;
  canEnableConcreteMixingMode: () => boolean;
}

const initialState = {
  clickedCoordinates: null,
  simulatedPhValue: null,
  isOceanLocation: null,
  isLoading: false,
  error: null,
  
  // Concrete initial state
  concreteOriginalPhValue: null,
  concreteAddedQuantityLiters: null,
  concreteNewPhValue: null,
  isConcreteMixingMode: false,
  concreteMixingInProgress: false,
  concreteMixingRatio: null,
  concreteImpactCategory: null,
  concreteImpactColor: null,
  concreteEfficiency: null,
  concreteMixingWarnings: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  
  // Actions
  setClickedLocation: (coordinates: Coordinates) => {
    set({
      clickedCoordinates: coordinates,
      // Reset dependent state when new location is clicked
      simulatedPhValue: null,
      isOceanLocation: null,
      error: null,
      // Reset concrete mixing state for new location
      concreteOriginalPhValue: null,
      concreteAddedQuantityLiters: null,
      concreteNewPhValue: null,
      isConcreteMixingMode: false,
      concreteMixingInProgress: false,
      concreteMixingRatio: null,
      concreteImpactCategory: null,
      concreteImpactColor: null,
      concreteEfficiency: null,
      concreteMixingWarnings: [],
    });
  },
  
  setPhValue: (value: number) => {
    set({ simulatedPhValue: value });
  },
  
  setIsOcean: (isOcean: boolean) => {
    set({ 
      isOceanLocation: isOcean,
      // Reset pH if it's land
      simulatedPhValue: isOcean ? get().simulatedPhValue : null,
    });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },
  
  resetState: () => {
    set(initialState);
  },
  
  // Concrete mixing actions
  setConcreteOriginalPh: (value: number) => {
    set({ concreteOriginalPhValue: value });
  },
  
  setConcreteAddedQuantity: (liters: number) => {
    set({ concreteAddedQuantityLiters: liters });
  },
  
  setConcreteNewPh: (value: number) => {
    set({ concreteNewPhValue: value });
  },
  
  setConcreteImpactCategory: (category: ImpactCategory) => {
    set({ concreteImpactCategory: category });
  },
  
  setConcreteImpactColor: (color: string) => {
    set({ concreteImpactColor: color });
  },
  
  setConcreteEfficiency: (efficiency: number) => {
    set({ concreteEfficiency: efficiency });
  },
  
  setConcreteMixingRatio: (ratio: number) => {
    set({ concreteMixingRatio: ratio });
  },
  
  setConcreteMixingWarnings: (warnings: string[]) => {
    set({ concreteMixingWarnings: warnings });
  },
  
  enableConcreteMixingMode: () => {
    const state = get();
    if (state.isOceanLocation && state.simulatedPhValue !== null) {
      set({ 
        isConcreteMixingMode: true,
        concreteOriginalPhValue: state.simulatedPhValue, // Save current pH as original
      });
    }
  },
  
  disableConcreteMixingMode: () => {
    set({ 
      isConcreteMixingMode: false,
      concreteNewPhValue: null,
      concreteAddedQuantityLiters: null,
      concreteMixingRatio: null,
      concreteImpactCategory: null,
      concreteImpactColor: null,
      concreteEfficiency: null,
      concreteMixingWarnings: [],
    });
  },
  
  setConcreteMixingInProgress: (inProgress: boolean) => {
    set({ concreteMixingInProgress: inProgress });
  },
  
  resetConcreteData: () => {
    set({
      concreteOriginalPhValue: null,
      concreteAddedQuantityLiters: null,
      concreteNewPhValue: null,
      isConcreteMixingMode: false,
      concreteMixingInProgress: false,
      concreteMixingRatio: null,
      concreteImpactCategory: null,
      concreteImpactColor: null,
      concreteEfficiency: null,
      concreteMixingWarnings: [],
    });
  },
  
  // Computed getters
  hasValidData: () => {
    const state = get();
    return state.clickedCoordinates !== null && state.isOceanLocation !== null;
  },
  
  getLocationStatus: () => {
    const state = get();
    if (state.isOceanLocation === null) return 'unknown';
    return state.isOceanLocation ? 'ocean' : 'land';
  },
  
  hasConcreteData: () => {
    const state = get();
    return state.concreteOriginalPhValue !== null && state.concreteAddedQuantityLiters !== null;
  },
  
  canEnableConcreteMixingMode: () => {
    const state = get();
    return state.isOceanLocation === true && state.simulatedPhValue !== null;
  },
}));

// Selector hooks for specific parts of the state
export const useCoordinates = () => useAppStore(state => state.clickedCoordinates);
export const usePhValue = () => useAppStore(state => state.simulatedPhValue);
export const useIsOcean = () => useAppStore(state => state.isOceanLocation);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useError = () => useAppStore(state => state.error);
export const useLocationStatus = () => useAppStore(state => state.getLocationStatus());
export const useHasValidData = () => useAppStore(state => state.hasValidData());

// Concrete mixing selector hooks
export const useConcreteOriginalPh = () => useAppStore(state => state.concreteOriginalPhValue);
export const useConcreteAddedQuantity = () => useAppStore(state => state.concreteAddedQuantityLiters);
export const useConcreteNewPh = () => useAppStore(state => state.concreteNewPhValue);
export const useIsConcreteMixingMode = () => useAppStore(state => state.isConcreteMixingMode);
export const useConcreteMixingInProgress = () => useAppStore(state => state.concreteMixingInProgress);
export const useConcreteMixingRatio = () => useAppStore(state => state.concreteMixingRatio);
export const useConcreteImpactCategory = () => useAppStore(state => state.concreteImpactCategory);
export const useConcreteImpactColor = () => useAppStore(state => state.concreteImpactColor);
export const useConcreteEfficiency = () => useAppStore(state => state.concreteEfficiency);
export const useConcreteMixingWarnings = () => useAppStore(state => state.concreteMixingWarnings);
export const useHasConcreteData = () => useAppStore(state => state.hasConcreteData());
export const useCanEnableConcreteMixingMode = () => useAppStore(state => state.canEnableConcreteMixingMode());

// Action hooks
export const useAppActions = () => {
  const setClickedLocation = useAppStore(state => state.setClickedLocation);
  const setPhValue = useAppStore(state => state.setPhValue);
  const setIsOcean = useAppStore(state => state.setIsOcean);
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);
  const resetState = useAppStore(state => state.resetState);

  return React.useMemo(() => ({
    setClickedLocation,
    setPhValue,
    setIsOcean,
    setLoading,
    setError,
    resetState,
  }), [setClickedLocation, setPhValue, setIsOcean, setLoading, setError, resetState]);
};

// Concrete mixing action hooks
export const useConcreteActions = () => {
  const setConcreteOriginalPh = useAppStore(state => state.setConcreteOriginalPh);
  const setConcreteAddedQuantity = useAppStore(state => state.setConcreteAddedQuantity);
  const setConcreteNewPh = useAppStore(state => state.setConcreteNewPh);
  const setConcreteImpactCategory = useAppStore(state => state.setConcreteImpactCategory);
  const setConcreteImpactColor = useAppStore(state => state.setConcreteImpactColor);
  const setConcreteEfficiency = useAppStore(state => state.setConcreteEfficiency);
  const setConcreteMixingRatio = useAppStore(state => state.setConcreteMixingRatio);
  const setConcreteMixingWarnings = useAppStore(state => state.setConcreteMixingWarnings);
  const enableConcreteMixingMode = useAppStore(state => state.enableConcreteMixingMode);
  const disableConcreteMixingMode = useAppStore(state => state.disableConcreteMixingMode);
  const setConcreteMixingInProgress = useAppStore(state => state.setConcreteMixingInProgress);
  const resetConcreteData = useAppStore(state => state.resetConcreteData);

  return React.useMemo(() => ({
    setConcreteOriginalPh,
    setConcreteAddedQuantity,
    setConcreteNewPh,
    setConcreteImpactCategory,
    setConcreteImpactColor,
    setConcreteEfficiency,
    setConcreteMixingRatio,
    setConcreteMixingWarnings,
    enableConcreteMixingMode,
    disableConcreteMixingMode,
    setConcreteMixingInProgress,
    resetConcreteData,
  }), [
    setConcreteOriginalPh,
    setConcreteAddedQuantity,
    setConcreteNewPh,
    setConcreteImpactCategory,
    setConcreteImpactColor,
    setConcreteEfficiency,
    setConcreteMixingRatio,
    setConcreteMixingWarnings,
    enableConcreteMixingMode,
    disableConcreteMixingMode,
    setConcreteMixingInProgress,
    resetConcreteData,
  ]);
}; 