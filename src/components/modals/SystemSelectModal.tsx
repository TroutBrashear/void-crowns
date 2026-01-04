import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import { useState } from 'react';
import styles from './Modal.module.css';

function SystemSelectModal() {
  const selection = useUiStore(state => state.selection);
  //const setSelection = useUiStore(state => state.setSelection);
  const changeModal = useUiStore(state => state.changeModal);
  const closeModal = useUiStore(state => state.closeModal);
  
  const getSystemById = useGameStore(state => state.getSystemById);
  const getPlanetoidById = useGameStore(state => state.getPlanetoidById);
  const getCharacterById = useGameStore(state => state.getCharacterById);
  const getOrgById = useGameStore(state => state.getOrgById);
  const buildFleet = useGameStore(state => state.buildFleet);
  const buildShip = useGameStore(state => state.buildShip);
  const assignCharacter = useGameStore(state => state.assignCharacter);
  
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const systemToShow = 
    (selection?.type === 'system') 
    ? getSystemById(selection.id) 
    : null;

  if (!systemToShow) {
    return null; 
  }

  const planetoidIds = systemToShow.planetoids;
  const systemPlanetoids = planetoidIds.map(id => getPlanetoidById(id)).filter(Boolean);
  const systemOwnerOrg = systemToShow.ownerNationId 
  ? getOrgById(systemToShow.ownerNationId) 
  : null;
  
  const govCharacter = systemToShow.assignedCharacter 
  ? getCharacterById(systemToShow.assignedCharacter) 
  : null;

  const poolCharacters = systemOwnerOrg?.characters.characterPool.map(characterId => getCharacterById(characterId));
  

  return (
    <div className={styles.modal}>
      <h2>System: {systemToShow.name}</h2>
      {systemOwnerOrg && <button onClick={() => {changeModal('org_modal', {type: 'org', id: systemOwnerOrg.id}); }}>{systemOwnerOrg.flavor.name}</button>}
      {systemToShow.ownerNationId === 1 && <button onClick={() => buildFleet(systemToShow.id)}>Construct Fleet</button>}

      {systemToShow.ownerNationId === 1 && <button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'colony_ship'})}>Construct Colony Ship</button>}

	  {govCharacter && <p>Governor: { govCharacter.name} </p>}
	  {(systemToShow.ownerNationId === 1 && poolCharacters) && <div>
		<select name="characterTarget" value={selectedCharacter || ''} onChange={(e) => setSelectedCharacter(Number(e.target.value))}>
			{poolCharacters.map(character => {
				if (!character) return null; 
				return(
				<option value={character.id}>
					{character.name}
				</option>);
			})}
		</select>
		<button onClick={() => {if(selectedCharacter){
			assignCharacter({charId: selectedCharacter, assignmentTargetId: systemToShow.id, assignmentType: "system"});}}}>Assign Governor</button>
		</div>
	  }
      <h3>Planetoids:</h3>
      <ul>
        {systemPlanetoids.map(planetoid => {
          if (!planetoid) return null; 
          return(
            <li key={planetoid.id}>
              <button onClick={() => {changeModal('planet_modal', {type: 'planetoid', id: planetoid.id}); }}>{planetoid.name}</button>
           </li>);
        })}
      </ul>

      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default SystemSelectModal;
