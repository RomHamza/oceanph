import './App.css';
import MapDisplay from './components/Map/MapDisplay';
import MapClickHandler from './components/Map/MapClickHandler';
import ClickMarker from './components/Map/ClickMarker';
import InfoPanel from './components/UI/InfoPanel';
import PhLegend from './components/UI/PhLegend';
import { useMapInteractionController } from './controllers/MapInteractionController';
import { useCoordinates, useIsOcean, usePhValue } from './store/appStore';

function App() {
  const { handleMapClick } = useMapInteractionController();
  const coordinates = useCoordinates();
  const isOcean = useIsOcean();
  const phValue = usePhValue();

  return (
    <div className="app">
      <MapDisplay>
        <MapClickHandler onMapClick={handleMapClick} />
        <ClickMarker 
          coordinates={coordinates}
          isOcean={isOcean}
          phValue={phValue}
        />
      </MapDisplay>
      <InfoPanel />
      <PhLegend />
    </div>
  );
}

export default App;
