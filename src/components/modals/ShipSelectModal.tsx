import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';
import { useState } from 'react';

function ShipSelectModal() {
  const selection = useUiStore(state => state.selection);
  const closeModal = useUiStore(state => state.closeModal);
  
  const getShipById = useGameStore(state => state.getShipById);
  const getHabitablesInSystem  = useGameStore(state => state.getHabitablesInSystem);
  const getPlanetoidsBySystem = useGameStore(state => state.getPlanetoidsBySystem);

  const colonizePlanetoid = useGameStore(state => state.colonizePlanetoid);
  const beginPlanetoidSurvey = useGameStore(state => state.beginPlanetoidSurvey);
  const [selectedPlanetoid, setSelectedPlanetoid] = useState<number | null>(null);


  const shipToShow = 
    (selection?.type === 'ship') 
    ? getShipById(selection.id) 
    : null;

  if (!shipToShow) {
    return null; 
  }

  const allPlanetoids = getPlanetoidsBySystem(shipToShow.locationSystemId);
  const colonizablePlanetoids = getHabitablesInSystem(shipToShow.locationSystemId);
  console.log(colonizablePlanetoids);

  return (
    <div className={styles.modal}>
      <h2>Ship: {shipToShow.name}</h2>
      <p>Location: System {shipToShow.locationSystemId}</p>
      { (colonizablePlanetoids.length > 0 && shipToShow.type === 'colony_ship') && <div>
          <select name="colonyTarget" value={selectedPlanetoid || ''} onChange={(e) => setSelectedPlanetoid(Number(e.target.value))}>
           {colonizablePlanetoids.map(planetoid => {
            if (!planetoid) return null; 
              return(
              <option value={planetoid.id}>
                {planetoid.name}
             </option>);
            })}
          </select>
          <button onClick={() => {if(selectedPlanetoid){
            colonizePlanetoid({shipId: shipToShow.id, planetoidId: selectedPlanetoid}); closeModal();}
          }}>Colonize World</button>
        </div>
      }

      {  shipToShow.type === 'survey_ship' && <div>
        <select name="surveyTarget" value={selectedPlanetoid || ''} onChange={(e) => setSelectedPlanetoid(Number(e.target.value))}>
        {allPlanetoids.map(planetoid => {
          if (!planetoid) return null;
          return(
            <option value={planetoid.id}>
            {planetoid.name}
            </option>);
        })}
        </select>
        <button onClick={() => {if(selectedPlanetoid){
          beginPlanetoidSurvey({shipId: shipToShow.id, planetoidId: selectedPlanetoid}); closeModal();}
        }}>Colonize World</button>
        </div>
      }
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default ShipSelectModal;
