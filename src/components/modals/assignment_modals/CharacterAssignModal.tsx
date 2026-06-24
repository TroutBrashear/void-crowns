import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';
import type {  Building } from '../../../types/gameState';
import type { System } from '../../../types/geoState';
import type { Org } from '../../../types/govState';
import type { Fleet, Ship } from '../../../types/shipTypes';
import styles from './AssignModal.module.css';

import { Button } from '../../pure/Button';

function CharacterAssignModal() {
    const characterAssignTarget = useUiStore(state => state.characterAssignTarget);
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const getOrgById = useGameStore(state => state.getOrgById);
    const getFleetById = useGameStore(state => state.getFleetById);
    const getShipById = useGameStore(state => state.getShipById);
    const getSystemById = useGameStore(state => state.getSystemById);
    const getCharacterById = useGameStore(state => state.getCharacterById);
    const getBuildingById = useGameStore(state => state.getBuildingById);
    const assignCharacter = useGameStore(state => state.assignCharacter);

    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

    let targetEntity: Fleet | System | Org | Ship | Building | undefined;
    let targetOwnerOrg: Org | undefined;
    let targetName: string | undefined;

    if(characterAssignTarget?.position === 'admiral'){
        targetEntity = getFleetById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg =  targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'governor'){
        targetEntity = getSystemById(characterAssignTarget.targetId);
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
        targetEntity = getShipById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'scientist'){
        targetEntity = getBuildingById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
            targetName = `${targetEntity.type} : ${targetEntity.id}`;
        }
    }
    else if(characterAssignTarget?.position === 'academyPresident'){
        targetEntity = getBuildingById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? getOrgById(targetEntity.ownerNationId) : undefined;
            targetName = `${targetEntity.type} : ${targetEntity.id}`;
        }
    }
    else if(characterAssignTarget?.position === 'diplomat'){
        targetEntity = getOrgById(characterAssignTarget.targetId);
        if(targetEntity){
            targetOwnerOrg = getOrgById(1);
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
                        <button key={character.id} className={`${styles.characterButton} ${character.id === selectedCharacter ? styles.selected : ''}`} onClick={() => setSelectedCharacter(character.id)}>
                        `${character.name.firstName} ${character.name.lastName}`
                        </button>);
                })}
            </div>

            <Button  disabled={!selectedCharacter} className={styles.characterButton} onClick={() => {if(selectedCharacter){
                assignCharacter({charId: selectedCharacter, assignmentTargetId: targetEntity.id, assignmentType: characterAssignTarget.position}); closeAssignModal();}}}>Assign </Button>

            <Button className={styles.characterButton} onClick={closeAssignModal}>Close</Button>
        </div>
    );
}

export default CharacterAssignModal;
