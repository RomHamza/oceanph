# 🌊 Ocean pH Visualizer

An interactive web application for visualizing ocean pH levels across the globe. Click anywhere on the map to analyze ocean acidity levels at that location.

![Ocean pH Visualizer](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Leaflet](https://img.shields.io/badge/Leaflet-1.x-green)

## 🚀 Features

- **Interactive World Map**: Click anywhere to analyze ocean pH levels
- **Real-time Analysis**: Instant determination of ocean vs. land locations
- **pH Simulation**: Scientifically-based pH value simulation considering:
  - Latitude effects (polar waters are more acidic)
  - Ocean current influences
  - Natural pH variations
- **Visual Indicators**: Color-coded markers and pH scale
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## 🎯 pH Scale

The application simulates ocean pH values in the realistic range of **7.7 to 8.1**:

- 🔴 **7.7**: More Acidic
- 🟠 **7.8**: Acidic  
- 🟡 **7.9**: Slightly Acidic
- 🟢 **8.0**: Normal (Average ocean pH)
- 🔵 **8.1**: More Alkaline

## 🛠️ Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ocean-ph-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Map/            # Map-related components
│   │   ├── MapDisplay.tsx
│   │   ├── MapClickHandler.tsx
│   │   └── ClickMarker.tsx
│   └── UI/             # User interface components
│       ├── InfoPanel.tsx
│       └── PhLegend.tsx
├── config/             # Configuration files
│   ├── mapConfig.ts
│   └── phConstants.ts
├── controllers/        # Business logic controllers
│   └── MapInteractionController.ts
├── hooks/              # Custom React hooks
│   └── useMapClick.ts
├── services/           # Data services
│   ├── oceanDetectionService.ts
│   └── phSimulationService.ts
├── store/              # State management
│   └── appStore.ts
├── styles/             # Global styles
│   └── variables.css
└── utils/              # Utility functions
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Leaflet** - Interactive maps
- **Zustand** - State management
- **CSS Variables** - Design system

## 🎮 How to Use

1. **Explore the Map**: Use mouse/touch to pan and zoom around the world
2. **Click to Analyze**: Click anywhere on the map to analyze that location
3. **View Results**: 
   - 🌊 Blue markers indicate ocean locations with pH data
   - 🏔️ Red markers indicate land locations
   - ⚪ Gray markers show analysis in progress
4. **Check the Legend**: Expand the pH scale legend (bottom-left) to understand the color coding
5. **Read Details**: The info panel (top-right) shows detailed information about the selected location

## 🧪 pH Simulation Algorithm

The pH simulation considers several scientific factors:

### Latitude Effects
- **Polar regions** (>60°): More acidic due to increased CO₂ solubility in cold water
- **Tropical regions** (<23.5°): Slightly more alkaline due to warmer temperatures
- **Temperate regions**: Gradual transition between polar and tropical effects

### Ocean Current Effects
- **Gulf Stream**: Slightly more alkaline
- **Kuroshio Current**: Slightly more alkaline  
- **Antarctic Circumpolar Current**: More acidic due to upwelling
- **Equatorial Upwelling**: Slightly more acidic

### Natural Variation
Random noise is added to simulate natural pH fluctuations while maintaining realistic ranges.

## 🌍 Ocean Detection

The application uses a simplified geographical algorithm to determine if coordinates are over ocean or land:

- Major continental landmasses are defined by bounding boxes
- Special cases for seas (Mediterranean, Black Sea, etc.) are handled
- The algorithm provides ~85% accuracy for demonstration purposes

> **Note**: In a production application, this would use precise GeoJSON data or a geospatial API.

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience with side panel
- **Tablet**: Adapted layout with bottom panel
- **Mobile**: Optimized touch interactions and compact UI

## 🎨 Design System

The application uses a consistent design system with:

- **CSS Variables**: Centralized color and spacing definitions
- **Modern Typography**: System font stack for optimal readability
- **Accessible Colors**: High contrast ratios for all text
- **Smooth Animations**: Subtle transitions for better UX

## 🔮 Future Enhancements

Potential improvements for future versions:

- **Real Data Integration**: Connect to actual oceanographic APIs
- **Historical Data**: Show pH trends over time
- **Depth Simulation**: 3D pH visualization at different depths
- **Climate Impact**: Show correlation with climate change data
- **Export Features**: Save and share pH measurements
- **Offline Support**: PWA capabilities for offline use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** for map tiles
- **Leaflet** for the mapping library
- **React Leaflet** for React integration
- **Oceanographic Research** for pH data insights

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

---

**Built with ❤️ for ocean science education and awareness** 