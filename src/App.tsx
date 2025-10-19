import './App.css'
import Map from './components/map';
import { GameClock } from './components/GameClock';
import { useState } from 'react';
import { Header } from './components/Header';

function App() {

  const [selectedFleetId, setSelectedFleetId] = useState<number | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameClock />
      <Header />
      <Map selectedFleetId={selectedFleetId} setSelectedFleetId={setSelectedFleetId} />
    </div>
  )
}

export default App
