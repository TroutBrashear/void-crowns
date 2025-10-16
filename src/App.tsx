import './App.css'
import Map from './components/map';
import { useState, useEffect } from 'react';
import { game } from './engine/gameEngine';

function App() {

  const [selectedFleetId, setSelectedFleetId] = useState<number | null>(null);


   useEffect(() => {
    // Start the game loop when the app mounts
    game.start();

    // Stop the loop when the app unmounts
    return () => {
      game.stop();
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map selectedFleetId={selectedFleetId} setSelectedFleetId={setSelectedFleetId} />
    </div>
  )
}

export default App
