import React from 'react';
import { 
  useCoordinates, 
  usePhValue, 
  useIsOcean, 
  useIsLoading, 
  useError,
  useAppActions,
  // Concrete mixing hooks only
  useIsConcreteMixingMode,
  useConcreteOriginalPh,
  useConcreteAddedQuantity,
  useConcreteNewPh,
  useConcreteMixingRatio,
  useConcreteImpactCategory,
  useConcreteImpactColor,
  useConcreteEfficiency,
  useConcreteMixingWarnings,
  useConcreteMixingInProgress,
  useHasConcreteData,
  useConcreteActions
} from '../../store/appStore';
import { getPhCategory } from '../../services/phSimulationService';
import { getPhColor } from '../../config/phConstants';
import { calculateNewPh } from '../../services/phMixingService';
import { PhComparisonDisplay } from './PhComparisonDisplay';
import { BetonWaterInput } from './BetonWaterInput';
import './InfoPanel.css';

const InfoPanel: React.FC = () => {
  const coordinates = useCoordinates();
  const phValue = usePhValue();
  const isOcean = useIsOcean();
  const isLoading = useIsLoading();
  const error = useError();
  
  // Actions
  const appActions = useAppActions();

  // Concrete mixing state
  const isConcreteMixingMode = useIsConcreteMixingMode();
  const concreteOriginalPh = useConcreteOriginalPh();
  const concreteAddedQuantity = useConcreteAddedQuantity();
  const concreteNewPh = useConcreteNewPh();
  const concreteMixingRatio = useConcreteMixingRatio();
  const concreteImpactCategory = useConcreteImpactCategory();
  const concreteImpactColor = useConcreteImpactColor();
  const concreteEfficiency = useConcreteEfficiency();
  const concreteMixingWarnings = useConcreteMixingWarnings();
  const concreteMixingInProgress = useConcreteMixingInProgress();
  const hasConcreteData = useHasConcreteData();
  
  // Actions
  const concreteActions = useConcreteActions();

  const formatCoordinate = (value: number, type: 'lat' | 'lng'): string => {
    const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
    return `${Math.abs(value).toFixed(4)}° ${direction}`;
  };

  const handleConcreteCalculation = async (quantity: number) => {
    if (!phValue) return;

    try {
      concreteActions.setConcreteMixingInProgress(true);
      
      // Set original pH first
      concreteActions.setConcreteOriginalPh(phValue);
      
      const result = calculateNewPh(phValue, quantity);
      
      // Update all concrete state
      concreteActions.setConcreteAddedQuantity(quantity);
      concreteActions.setConcreteNewPh(result.newPh);
      concreteActions.setConcreteEfficiency(result.efficiency);
      concreteActions.setConcreteImpactCategory(result.impactCategory);
      concreteActions.setConcreteImpactColor(result.impactColor);
      concreteActions.setConcreteMixingRatio(result.mixingRatio);
      concreteActions.setConcreteMixingWarnings(result.warnings);
      
      // Enable concrete mixing mode if not already enabled
      if (!isConcreteMixingMode) {
        concreteActions.enableConcreteMixingMode();
      }
      
    } catch (error) {
      console.error('Concrete calculation error:', error);
      appActions.setError(error instanceof Error ? error.message : 'Calculation failed');
    } finally {
      concreteActions.setConcreteMixingInProgress(false);
    }
  };

  const handleResetConcrete = () => {
    concreteActions.disableConcreteMixingMode();
  };

  const renderConcreteSection = () => {
    if (!isOcean || !phValue) return null;

    return (
      <div className="info-section concrete-section">
        {!isConcreteMixingMode || !hasConcreteData ? (
          <>
            <div className="concrete-section__header">
              <h4>🏗️ Concrete Wash Water Simulation</h4>
              <p className="concrete-section__description">
                Test the impact of adding concrete wash water (pH ~12) to this ocean location
              </p>
            </div>
            <BetonWaterInput 
              onAddBeton={handleConcreteCalculation}
              isLoading={concreteMixingInProgress}
              disabled={isLoading}
            />
          </>
        ) : (
          <PhComparisonDisplay
            originalPh={concreteOriginalPh || phValue}
            newPh={concreteNewPh || phValue}
            addedQuantity={concreteAddedQuantity || 0}
            mixingRatio={concreteMixingRatio || 0.001}
            impactCategory={concreteImpactCategory || 'MINIMAL'}
            impactColor={concreteImpactColor || '#28A745'}
            efficiency={concreteEfficiency || 0}
            warnings={concreteMixingWarnings || []}
            restorationLevel={(() => {
              if (!concreteOriginalPh || !concreteNewPh) return 'Unknown';
              if (concreteOriginalPh <= 5.5 && concreteNewPh >= 7.5) return 'Dead Zone Restoration';
              if (concreteOriginalPh <= 7.0 && concreteNewPh >= 7.8) return 'Acidification Mitigation';
              if (concreteOriginalPh <= 7.7 && concreteNewPh >= 8.0) return 'Normal Ocean Restoration';
              if (concreteNewPh > concreteOriginalPh) return 'pH Improvement';
              return 'Minimal Impact';
            })()}
            scientificNotes={(() => {
              const notes: string[] = [];
              if (concreteMixingRatio) {
                notes.push(`Mixing ratio: ${(concreteMixingRatio * 100).toFixed(4)}% concrete wastewater`);
              }
              if (concreteOriginalPh && concreteOriginalPh <= 5.5) {
                notes.push('Dead zone detected - high restoration potential');
                notes.push('~50% concrete water needed for full restoration (pH 8)');
              }
              if (concreteOriginalPh && concreteOriginalPh <= 7.7) {
                notes.push('Acidified ocean water - concrete alkalinity helps neutralization');
              }
              if (concreteNewPh && concreteNewPh >= 8.0) {
                notes.push('Target pH for marine life achieved');
              }
              notes.push('OH⁻ ions from concrete neutralize H⁺ ions causing acidification');
              return notes;
            })()}
            onReset={handleResetConcrete}
          />
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="info-panel__error">
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => appActions.setError(null)}
            className="error-dismiss-btn"
          >
            Dismiss
          </button>
        </div>
      );
    }

    if (!coordinates) {
      return (
        <div className="info-panel__welcome">
          <h3>🌊 Ocean pH Restoration Simulator</h3>
          <p>Valorisation des eaux résiduelles du béton pour lutter contre l'acidification des océans</p>
          
          <div className="info-panel__new-feature">
            <span className="new-feature-badge">🏗️ Scientific Project</span>
            <p>Simulate the use of concrete wastewater (pH 12.0) to neutralize ocean acidification. OH⁻ ions from concrete neutralize H⁺ ions causing acidification.</p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="info-panel__loading">
          <h3>Analyzing Location...</h3>
          <div className="loading-spinner"></div>
          <p>Determining if location is ocean or land and calculating pH levels.</p>
        </div>
      );
    }

    return (
      <div className="info-panel__data">
        <h3>Location Analysis</h3>
        
        <div className="info-section">
          <h4>Coordinates</h4>
          <div className="coordinates">
            <span className="coordinate">
              <strong>Latitude:</strong> {formatCoordinate(coordinates.latitude, 'lat')}
            </span>
            <span className="coordinate">
              <strong>Longitude:</strong> {formatCoordinate(coordinates.longitude, 'lng')}
            </span>
          </div>
        </div>

        <div className="info-section">
          <h4>Location Type</h4>
          <div className={`location-type ${isOcean ? 'ocean' : 'land'}`}>
            {isOcean ? '🌊 Ocean' : '🏔️ Land'}
          </div>
        </div>

        {isOcean && phValue !== null && (
          <div className="info-section">
            <h4>
              {isOcean ? 'Ocean pH Level' : 'Land pH Level'}
            </h4>
            <div className="ph-display">
              <div 
                className="ph-value"
                style={{ backgroundColor: getPhColor(phValue) }}
              >
                {phValue.toFixed(2)}
              </div>
              <div className="ph-category">
                {getPhCategory(phValue)}
              </div>
              <div className="ph-scale">
                <span className="scale-label">More Acidic</span>
                <div className="scale-bar">
                  <div 
                    className="scale-indicator"
                    style={{ 
                      left: `${((phValue - 7.7) / (8.1 - 7.7)) * 100}%`,
                      backgroundColor: getPhColor(phValue)
                    }}
                  ></div>
                </div>
                <span className="scale-label">More Alkaline</span>
              </div>
            </div>
          </div>
        )}

        {!isOcean && (
          <div className="info-section">
            <div className="land-message">
              <p>This location is on land. Ocean pH data is only available for ocean locations.</p>
              <p>Try clicking on an ocean area to see pH measurements and test alkaline water effects.</p>
            </div>
          </div>
        )}

        {/* Concrete Section - Only show for ocean locations */}
        {renderConcreteSection()}
      </div>
    );
  };

  return (
    <div className="info-panel">
      {renderContent()}
    </div>
  );
};

export default InfoPanel; 