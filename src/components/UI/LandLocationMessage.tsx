import React from 'react';
import './LandLocationMessage.css';

/**
 * Component to display when user clicks on a land location
 * Shows appropriate message explaining that pH data is only available for oceans
 */
const LandLocationMessage: React.FC = () => {
  return (
    <div className="land-location-alert">
      <div className="land-location-icon">🏔️</div>
      <h3>Zone Terrestre</h3>
      <p>Aucune donnée de pH disponible pour cette localisation.</p>
      <small>Le pH est une mesure spécifique aux océans.</small>
      <div className="land-location-suggestion">
        <p>💡 Essayez de cliquer sur une zone océanique pour voir les données de pH.</p>
      </div>
    </div>
  );
};

export default LandLocationMessage; 