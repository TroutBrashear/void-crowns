import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';
import type { Fleet, System, Org } from '../../../types/gameState';
import styles from './AssignModal.module.css';


function CharacterAssignModal() {
    const characterAssignTarget = useUiStore(state => state.characterAssignTarget);
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const getOrgById = useGameStore(state => state.getOrgById);
    const getFleetById = useGameStore(state => state.getFleetById);
    const getSystemById = useGameStore(state => state.getSystemById);
    const getCharacterById = useGameStore(state => state.getCharacterById);
    const assignCharacter = useGameStore(state => state.assignCharacter);

    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

    let targetEntity: Fleet | System | Org | undefined;
    let targetOwnerOrg: Org | undefined;
    let targetName: string | undefined;
    if(characterAssignTarget?.position === 'admiral'){
        targetEntity = getFleetById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg =  targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : null;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'governor'){
        targetEntity = getSystemById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg =  targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : null;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'leader'){
        targetEntity = getOrgById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg = targetEntity;
            targetName = targetEntity.flavor.name;
        }
    }
    else{
        return null;
    }

    if(!targetEntity){
        return null;
    }


    if(!targetOwnerOrg){
        return null;
    }

    const poolCharacters = targetOwnerOrg.characters.characterPool.map(characterId => getCharacterById(characterId));


    return(
        <div className={styles.assignModal}>
            <h3>Assigning Character to {targetName}</h3>

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
                assignCharacter({charId: selectedCharacter, assignmentTargetId: targetEntity.id, assignmentType: characterAssignTarget.position}); closeAssignModal();}}}>Assign </button>

            <button onClick={closeAssignModal}>Close</button>
        </div>
    );
}

export default CharacterAssignModal;
