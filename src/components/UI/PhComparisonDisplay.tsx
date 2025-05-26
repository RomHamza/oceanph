/**
 * PhComparisonDisplay Component
 * Displays side-by-side pH comparison with animations and efficiency metrics
 * Based on roadmap2.md Step 7 requirements
 */

import React from 'react';
import './PhComparisonDisplay.css';

interface PhComparisonDisplayProps {
  originalPh: number;
  newPh: number;
  addedQuantity: number;
  mixingRatio: number;
  impactCategory: string;
  impactColor: string;
  efficiency: number;
  warnings: string[];
  onReset: () => void;
}

export const PhComparisonDisplay: React.FC<PhComparisonDisplayProps> = ({
  originalPh,
  newPh,
  addedQuantity,
  mixingRatio,
  impactCategory,
  impactColor,
  efficiency,
  warnings,
  onReset
}) => {
  const phChange = newPh - originalPh;
  const isIncrease = phChange > 0;
  const isSignificant = Math.abs(phChange) >= 0.01;

  const getChangeIcon = () => {
    if (!isSignificant) return '➡️';
    return isIncrease ? '⬆️' : '⬇️';
  };

  const getChangeClass = () => {
    if (!isSignificant) return 'minimal';
    return isIncrease ? 'increase' : 'decrease';
  };

  const formatPercentage = (value: number): string => {
    return (value * 100).toFixed(4) + '%';
  };

  const formatEfficiency = (value: number): string => {
    return (value / 1000).toFixed(3) + '/1000L';
  };

  return (
    <div className="ph-comparison-display">
      <div className="comparison-header">
        <h3 className="comparison-title">
          🧪 Concrete Water Mixing Results
        </h3>
        <p className="comparison-subtitle">
          {addedQuantity}L of concrete water added
        </p>
      </div>

      <div className="ph-comparison-main">
        <div className="ph-value-card original">
          <div className="ph-label">Original pH</div>
          <div className="ph-value">{originalPh.toFixed(2)}</div>
          <div className="ph-source">Natural ocean</div>
        </div>

        <div className="ph-change-indicator">
          <div className="change-arrow">
            <span className="arrow-icon">{getChangeIcon()}</span>
          </div>
          <div className={`ph-change-value ${getChangeClass()}`}>
            {isIncrease ? '+' : ''}{phChange.toFixed(2)}
          </div>
          <div className="change-label">Change</div>
        </div>

        <div className="ph-value-card new">
          <div className="ph-label">New pH</div>
          <div className="ph-value">{newPh.toFixed(2)}</div>
          <div className="ph-source">After mixing</div>
        </div>
      </div>

      <div className="impact-analysis">
        <div className="impact-category" style={{ borderLeftColor: impactColor }}>
          <span className="impact-icon">📊</span>
          <span className="impact-label">Impact:</span>
          <span className="impact-value" style={{ color: impactColor }}>
            {impactCategory}
          </span>
        </div>

        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-icon">⚖️</span>
            <span className="metric-label">Added quantity</span>
            <span className="metric-value">{addedQuantity}L</span>
          </div>

          <div className="metric-item">
            <span className="metric-icon">🔄</span>
            <span className="metric-label">Mixing ratio</span>
            <span className="metric-value">{formatPercentage(mixingRatio)}</span>
          </div>

          <div className="metric-item">
            <span className="metric-icon">⚡</span>
            <span className="metric-label">Efficiency</span>
            <span className="metric-value">{formatEfficiency(efficiency)}</span>
          </div>
        </div>
      </div>

      <div className="scientific-notes">
        <h4 className="notes-title">
          📋 Scientific Notes
        </h4>
        <div className="notes-content">
          <div className="note-item">
            <span className="note-icon">🧪</span>
            <span className="note-text">
              Calculation based on mixing principles (pH 5 + pH 12 → pH 7.5-8)
            </span>
          </div>
          <div className="note-item">
            <span className="note-icon">🌊</span>
            <span className="note-text">
              Ocean buffering effect applied (factor: 0.75)
            </span>
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="warnings-section">
          <h4 className="warnings-title">
            ⚠️ Warnings
          </h4>
          <div className="warnings-list">
            {warnings.map((warning, index) => (
              <div key={index} className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span className="warning-text">{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button onClick={onReset} className="reset-button">
          <span className="button-icon">🔄</span>
          Reset Simulation
        </button>
      </div>

      <div className="disclaimer">
        <p className="disclaimer-text">
          Results are simulated and for educational purposes only. 
          Actual environmental impacts may vary significantly.
        </p>
      </div>
    </div>
  );
}; 