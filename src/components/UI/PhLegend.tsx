import React, { useState } from 'react';
import { PH_COLOR_SCALE } from '../../config/phConstants';
import './PhLegend.css';

const PhLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const phLevels = [
    { ph: 7.7, label: 'More Acidic', color: PH_COLOR_SCALE[7.7] },
    { ph: 7.8, label: 'Acidic', color: PH_COLOR_SCALE[7.8] },
    { ph: 7.9, label: 'Slightly Acidic', color: PH_COLOR_SCALE[7.9] },
    { ph: 8.0, label: 'Normal', color: PH_COLOR_SCALE[8.0] },
    { ph: 8.1, label: 'More Alkaline', color: PH_COLOR_SCALE[8.1] },
  ];

  return (
    <div className={`ph-legend ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className="ph-legend__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse pH legend' : 'Expand pH legend'}
      >
        <span className="ph-legend__title">pH Scale</span>
        <span className={`ph-legend__arrow ${isExpanded ? 'up' : 'down'}`}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>
      
      {isExpanded && (
        <div className="ph-legend__content">
          <div className="ph-legend__description">
            Ocean pH levels typically range from 7.7 to 8.1. 
            Lower values indicate more acidic water, while higher values indicate more alkaline water.
          </div>
          
          <div className="ph-legend__scale">
            {phLevels.map((level) => (
              <div key={level.ph} className="ph-legend__item">
                <div 
                  className="ph-legend__color"
                  style={{ backgroundColor: level.color }}
                  title={`pH ${level.ph}`}
                />
                <div className="ph-legend__info">
                  <span className="ph-legend__ph">{level.ph}</span>
                  <span className="ph-legend__label">{level.label}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="ph-legend__note">
            <strong>Note:</strong> These are simulated values for demonstration purposes.
          </div>
        </div>
      )}
    </div>
  );
};

export default PhLegend; 