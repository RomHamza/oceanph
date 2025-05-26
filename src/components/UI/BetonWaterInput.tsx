/**
 * BetonWaterInput Component
 * Input form for concrete water quantity with validation and preset buttons
 * Based on roadmap2.md Step 7 requirements
 */

import React, { useState } from 'react';
import './BetonWaterInput.css';

interface BetonWaterInputProps {
  onAddBeton: (quantity: number) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const BetonWaterInput: React.FC<BetonWaterInputProps> = ({
  onAddBeton,
  isLoading,
  disabled = false
}) => {
  const [quantity, setQuantity] = useState<string>('100');
  const [error, setError] = useState<string>('');

  const presetQuantities = [
    { value: 10, label: '10L', description: 'Small batch' },
    { value: 100, label: '100L', description: 'Medium batch' },
    { value: 500, label: '500L', description: 'Large batch' },
    { value: 1000, label: '1000L', description: 'Industrial scale' }
  ];

  const validateQuantity = (value: string): boolean => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid positive number');
      return false;
    }
    if (num < 0.1) {
      setError('Minimum quantity is 0.1 liters');
      return false;
    }
    if (num > 10000) {
      setError('Maximum quantity is 10,000 liters');
      return false;
    }
    setError('');
    return true;
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (value.trim()) {
      validateQuantity(value);
    } else {
      setError('');
    }
  };

  const handlePresetClick = (value: number) => {
    setQuantity(value.toString());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuantity(quantity)) {
      return;
    }

    const numQuantity = parseFloat(quantity);
    onAddBeton(numQuantity);
  };

  return (
    <div className="beton-water-input">
      <div className="input-header">
        <h4>🏗️ Concrete Wash Water Addition</h4>
        <p className="input-description">
          Enter the quantity of concrete wash water to add to the ocean
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="quantity-input-group">
          <label htmlFor="quantity" className="input-label">
            Quantity (Liters)
          </label>
          <div className="input-wrapper">
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className={`quantity-input ${error ? 'error' : ''}`}
              placeholder="Enter quantity..."
              min="0.1"
              max="10000"
              step="0.1"
              disabled={disabled || isLoading}
            />
            <span className="input-unit">L</span>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="preset-buttons">
          <span className="preset-label">Quick Select:</span>
          <div className="preset-grid">
            {presetQuantities.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetClick(preset.value)}
                className={`preset-button ${quantity === preset.value.toString() ? 'active' : ''}`}
                disabled={disabled || isLoading}
              >
                <span className="preset-value">{preset.label}</span>
                <span className="preset-description">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="calculate-button"
          disabled={disabled || isLoading || !!error || !quantity.trim()}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Calculating...
            </>
          ) : (
            <>
              <span className="button-icon">🧪</span>
              Calculate pH Impact
            </>
          )}
        </button>
      </form>

      <div className="info-section">
        <div className="info-item">
          <span className="info-icon">ℹ️</span>
          <span className="info-text">
            Concrete wash water typically has a pH of ~12.0
          </span>
        </div>
        <div className="info-item">
          <span className="info-icon">⚠️</span>
          <span className="info-text">
            Results are simulated and consider ocean buffering effects
          </span>
        </div>
        <div className="info-item">
          <span className="info-icon">🌊</span>
          <span className="info-text">
            Larger quantities show diminishing returns due to natural ocean chemistry
          </span>
        </div>
      </div>
    </div>
  );
}; 