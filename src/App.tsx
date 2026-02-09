import './App.css'
import Map from './components/map';
import { GameClock } from './components/GameClock';
import { Header } from './components/Header';
import type { Selection } from './types/gameState'; 
import { useUiStore } from './state/uiStore';
import { ModalManager } from './components/modals/ModalManager';
import { OrgCreation } from './components/OrgCreation';
import Notification  from './components/Notification';

function App() {

  const setSelection = useUiStore(state => state.setSelection);
  const openModal = useUiStore(state => state.openModal);


  const appState = useUiStore(state => state.appState);
  const setAppState = useUiStore(state => state.setAppState);

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
        case 'ship':
          openModal('ship_modal');
          break;
        default:
          break;
      }
  };

  const initOrg = () => {
    setAppState('org_creation');
  };




   if (appState === 'main_menu') {
    return (
      <div>
        <h1>VOID CROWNS (Main Menu)</h1>
        <button onClick= {initOrg}>Start New Game</button>
      </div>
    );
  }
  else if(appState === 'org_creation') {
    return (
      <OrgCreation/>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameClock />
      <Header />
      <Map onSelect={handleSelection} />

      <Notification />
      <ModalManager />
    </div>
  )
}

export default App
