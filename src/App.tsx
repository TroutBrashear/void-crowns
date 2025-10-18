import './App.css'
import Map from './components/map';
import { GameClock } from './components/GameClock';
import { useState, useEffect } from 'react';

function App() {

  const [selectedFleetId, setSelectedFleetId] = useState<number | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameClock />
      <Map selectedFleetId={selectedFleetId} setSelectedFleetId={setSelectedFleetId} />
    </div>
  )
}

export default App
