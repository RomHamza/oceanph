import { useAppActions } from '../store/appStore';
import { isOcean } from '../services/oceanDetectionService';
import { simulatePhAsync } from '../services/phSimulationService';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const useMapInteractionController = () => {
  const actions = useAppActions();

  const handleMapClick = async (coordinates: Coordinates) => {
    console.log('MapInteractionController: handleMapClick called with:', coordinates);
    
    try {
      // Reset previous state
      actions.resetState();
      
      // Set coordinates immediately
      actions.setClickedLocation(coordinates);
      actions.setLoading(true);
      
      console.log('MapInteractionController: Checking if location is ocean...');
      
      // Check if location is ocean
      const oceanCheck = isOcean(coordinates.latitude, coordinates.longitude);
      console.log('MapInteractionController: Ocean check result:', oceanCheck);
      
      actions.setIsOcean(oceanCheck);
      
      if (oceanCheck) {
        console.log('MapInteractionController: Location is ocean, simulating pH...');
        // Simulate pH for ocean locations
        const phValue = await simulatePhAsync(coordinates);
        console.log('MapInteractionController: pH simulation result:', phValue);
        actions.setPhValue(phValue);
      } else {
        console.log('MapInteractionController: Location is land, no pH simulation');
        // For land locations, don't set pH value
      }
      
    } catch (error) {
      console.error('MapInteractionController: Error during map click handling:', error);
      actions.setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      actions.setLoading(false);
      console.log('MapInteractionController: Loading finished');
    }
  };

  return {
    handleMapClick
  };
}; 