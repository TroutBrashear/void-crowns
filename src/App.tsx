import './App.css'
import Map from './components/map';
import { useState } from 'react';

function App() {

  const [selectedFleetId, setSelectedFleetId] = useState<number | null>(null);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map selectedFleetId={selectedFleetId} setSelectedFleetId={setSelectedFleetId} />
    </div>
  )
}

export default App
