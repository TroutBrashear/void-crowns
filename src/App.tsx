import './App.css'
import Map from './components/map';
import { GameClock } from './components/GameClock';
import { useState } from 'react';
import { Header } from './components/Header';
import type { Selection } from './types/gameState'; 


function App() {

    const [selection, setSelection] = useState<Selection | null>(null);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameClock />
      <Header />
      <Map selectedFleetId={selection} setSelectedFleetId={setSelection} />
    </div>
  )
}

export default App
