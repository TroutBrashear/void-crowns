import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';
import type { Fleet, System, Org, Ship, Building } from '../../../types/gameState';
import styles from './AssignModal.module.css';


function CharacterAssignModal() {
    const characterAssignTarget = useUiStore(state => state.characterAssignTarget);
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const getOrgById = useGameStore(state => state.getOrgById);
    const assignCharacter = useGameStore(state => state.assignCharacter);

    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

    let targetEntity: Fleet | System | Org | Ship | Building | undefined;
    let targetOwnerOrg: Org | undefined;
    let targetName: string | undefined;
    if(characterAssignTarget?.position === 'admiral'){
        targetEntity = useGameStore(state => state.fleets.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg =  targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'governor'){
        targetEntity = useGameStore(state => state.systems.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg =  targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
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
    else if(characterAssignTarget?.position === 'surveyor'){
        targetEntity = useGameStore(state => state.ships.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'scientist'){
        targetEntity = useGameStore(state => state.buildings.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
            targetName = `${targetEntity.type} : ${targetEntity.id}`;
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

    const poolCharacters = targetOwnerOrg.characters.characterPool.map(characterId => useGameStore(state => state.characters.entities[characterId]));


    return(
        <div className={styles.assignModal}>
            <h3>Assigning Character to {targetName}</h3>

            <div>
                {poolCharacters.map(character => {
                    if (!character) return null;
                    return(
                        <button key={character.id} className={`${styles.characterButton} ${character.id === selectedCharacter ? styles.selected : ''}`} onClick={() => setSelectedCharacter(character.id)}>
                        {character.name}
                        </button>);
                })}
            </div>

            <button  disabled={!selectedCharacter} className={styles.characterButton} onClick={() => {if(selectedCharacter){
                assignCharacter({charId: selectedCharacter, assignmentTargetId: targetEntity.id, assignmentType: characterAssignTarget.position}); closeAssignModal();}}}>Assign </button>

            <button className={styles.characterButton} onClick={closeAssignModal}>Close</button>
        </div>
    );
}

export default CharacterAssignModal;
