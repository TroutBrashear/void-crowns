import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';
import type { Fleet, System } from '../../../types/gameState';
import styles from './AssignModal.module.css';


function CharacterAssignModal() {
    const selection = useUiStore(state => state.selection);
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const getOrgById = useGameStore(state => state.getOrgById);
    const getFleetById = useGameStore(state => state.getFleetById);
    const getSystemById = useGameStore(state => state.getSystemById);
    const getCharacterById = useGameStore(state => state.getCharacterById);
    const assignCharacter = useGameStore(state => state.assignCharacter);

    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

    let targetEntity: Fleet | System | undefined;

    if(selection?.type === 'fleet'){
        targetEntity = getFleetById(selection.id);
    }
    else if(selection?.type === 'system'){
        targetEntity = getSystemById(selection.id);
    }
    else{
        return null;
    }

    if(!targetEntity){
        return null;
    }

    const targetOwnerOrg =  targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : null;

    if(!targetOwnerOrg){
        return null;
    }

    const poolCharacters = targetOwnerOrg.characters.characterPool.map(characterId => getCharacterById(characterId));


    return(
        <div className={styles.assignModal}>
            <h3>Assigning Character to {targetEntity.name}</h3>

            <div>
                {poolCharacters.map(character => {
                    if (!character) return null;
                    return(
                        <button key={character.id} onClick={() => setSelectedCharacter(character.id)}>
                        {character.name}
                        </button>);
                })}
            </div>

            <button onClick={() => {if(selectedCharacter){
                assignCharacter({charId: selectedCharacter, assignmentTargetId: targetEntity.id, assignmentType: selection.type}); closeAssignModal();}}}>Assign </button>

            <button onClick={closeAssignModal}>Close</button>
        </div>
    );
}

export default CharacterAssignModal;
