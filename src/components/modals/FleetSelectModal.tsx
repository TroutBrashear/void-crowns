import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import { useState } from 'react';
import styles from './Modal.module.css';

function FleetSelectModal() {
  const selection = useUiStore(state => state.selection);
  const closeModal = useUiStore(state => state.closeModal);
  
  const getOrgById = useGameStore(state => state.getOrgById);
  const getFleetById = useGameStore(state => state.getFleetById);
  const getCharacterById = useGameStore(state => state.getCharacterById);
  const assignCharacter = useGameStore(state => state.assignCharacter);
  
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);


  const fleetToShow = 
    (selection?.type === 'fleet') 
    ? getFleetById(selection.id) 
    : null;

  if (!fleetToShow) {
    return null; 
  }
  
  //we need the org to access character pool
  const fleetOwnerOrg = fleetToShow.ownerNationId 
  ? getOrgById(fleetToShow.ownerNationId) 
  : null;
  
  const poolCharacters = fleetOwnerOrg?.characters.characterPool.map(characterId => getCharacterById(characterId));

  
  const comCharacter = fleetToShow.assignedCharacter 
		? getCharacterById(fleetToShow.assignedCharacter) 
		: null;

  return (
    <div className={styles.modal}>
      <h2>Fleet: {fleetToShow.name}</h2>
      <p>Location: System {fleetToShow.locationSystemId}</p>
       {comCharacter && <p>Commander: { comCharacter.name} </p>}
	    {(fleetToShow.ownerNationId === 1 && poolCharacters) && <div>
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
			assignCharacter({charId: selectedCharacter, assignmentTargetId: fleetToShow.id, assignmentType: "fleet"});}}}>Assign Commander</button>
		</div>
	  }
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default FleetSelectModal;
