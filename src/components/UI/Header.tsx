import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src="/images/brainstormeurs-logo.svg" 
              alt="BRAINSTORMEURS Logo" 
              className="header-logo"
              onError={(e) => {
                // Fallback to a simple circle if SVG fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="logo-fallback" style={{ display: 'none' }}>
              🌊
            </div>
          </div>
          <div className="header-text">
            <h1 className="header-title">BRAINSTORMEURS</h1>
            <p className="header-subtitle">Ocean pH Restoration Simulator</p>
          </div>
        </div>
        <div className="project-info">
          <span className="project-badge">🏗️ Scientific Project</span>
          <span className="year-badge">2024-2025</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 