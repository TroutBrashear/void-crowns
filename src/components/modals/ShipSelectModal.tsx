import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';
import { useState } from 'react';

import { Button } from '../pure/Button';

function ShipSelectModal() {
  const selection = useUiStore(state => state.selection);
  const closeModal = useUiStore(state => state.closeModal);
  const openAssignModal = useUiStore(state => state.openAssignModal);

  const getShipById = useGameStore(state => state.getShipById);
  const getHabitablesInSystem  = useGameStore(state => state.getHabitablesInSystem);
  const getPlanetoidsBySystem = useGameStore(state => state.getPlanetoidsBySystem);

  const getCharacterById = useGameStore(state => state.getCharacterById);

  const colonizePlanetoid = useGameStore(state => state.colonizePlanetoid);
  const beginPlanetoidSurvey = useGameStore(state => state.beginPlanetoidSurvey);
  const [selectedPlanetoid, setSelectedPlanetoid] = useState<number | null>(null);

  if (!selection) {
    return null;
  }

  const shipToShow = 
    (selection?.type === 'ship') 
    ? getShipById(selection.id) 
    : null;

  if (!shipToShow) {
    return null; 
  }

  const allPlanetoids = getPlanetoidsBySystem(shipToShow.locationSystemId);
  const colonizablePlanetoids = getHabitablesInSystem(shipToShow.locationSystemId);

  const assignedCharacter = shipToShow.assignedCharacter
  ? getCharacterById(shipToShow.assignedCharacter)
  : null;

  return (
    <div className={styles.modal}>
      <h2>Ship: {shipToShow.name}</h2>
      <p>Location: System {shipToShow.locationSystemId}</p>
      {assignedCharacter && <p>Surveyor: `${assignedCharacter.name.firstName} ${assignedCharacter.name.lastName}`</p>}

      { (colonizablePlanetoids.length > 0 && shipToShow.type === 'colony_ship' && shipToShow.ownerNationId === 1) && <div>
          <select name="colonyTarget" value={selectedPlanetoid || ''} onChange={(e) => setSelectedPlanetoid(Number(e.target.value))}>
           {colonizablePlanetoids.map(planetoid => {
            if (!planetoid) return null; 
              return(
              <option value={planetoid.id}>
                {planetoid.name}
             </option>);
            })}
          </select>
          <Button onClick={() => {if(selectedPlanetoid){
            colonizePlanetoid({shipId: shipToShow.id, planetoidId: selectedPlanetoid}); closeModal();}
          }}>Colonize World</Button>
        </div>
      }

      { (shipToShow.type === 'survey_ship' && shipToShow.ownerNationId === 1) && <div>

        <select name="surveyTarget" value={selectedPlanetoid || ''} onChange={(e) => setSelectedPlanetoid(Number(e.target.value))}>
        {allPlanetoids.map(planetoid => {
          if (!planetoid) return null;
          return(
            <option value={planetoid.id}>
            {planetoid.name}
            </option>);
        })}
        </select>
        <Button onClick={() => {if(selectedPlanetoid){
          beginPlanetoidSurvey({shipId: shipToShow.id, planetoidId: selectedPlanetoid}); closeModal();}
        }}>Survey World</Button>

        {shipToShow.ownerNationId === 1 && <button onClick={() => openAssignModal("assign_character", {targetId: selection.id, position: 'surveyor'})}>Assign new Surveyor</button>}
        </div>
      }

      { (shipToShow.type === 'construction_ship' && shipToShow.ownerNationId === 1) && <div>
         <Button onClick={() => openAssignModal("assign_anchor", {targetId: shipToShow.locationSystemId, position: 'surveyor'})}>Construct Anchor</Button>
         <Button onClick={() => openAssignModal("assign_habitat", {targetId: shipToShow.locationSystemId, position: 'surveyor'})}>Construct Habitat</Button>
        </div>
      }

      <Button onClick={closeModal}>Close</Button>
    </div>
  );
}

export default ShipSelectModal;
