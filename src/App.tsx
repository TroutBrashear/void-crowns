import './App.css'
import Map from './components/map';
import { GameClock } from './components/GameClock';
//import { useState } from 'react';
import { Header } from './components/Header';
import type { Selection } from './types/gameState'; 
import { useUiStore } from './state/uiStore';
import { ModalManager } from './components/modals/ModalManager';

function App() {

  const setSelection = useUiStore(state => state.setSelection);
  const openModal = useUiStore(state => state.openModal);


  const handleSelection = (newSelection: Selection | null) => {
      setSelection(newSelection);
      if (!newSelection) {
        return; 
      }
      console.log(newSelection.id);
      switch(newSelection.type){
        case 'fleet':
          openModal('fleet_modal');
          break;
        case 'system':
          openModal('system_modal');
          break;
        default:
          break;
      }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameClock />
      <Header />
      <Map onSelect={handleSelection} />

      <ModalManager />
    </div>
  )
}

export default App
