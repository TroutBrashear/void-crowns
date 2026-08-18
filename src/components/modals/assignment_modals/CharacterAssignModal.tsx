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
    const orgs = useGameStore(state => state.orgs.entities);
    const getCharacterById = useGameStore(state => state.getCharacterById);
    const assignCharacter = useGameStore(state => state.assignCharacter);

    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

    let targetEntity: Fleet | System | Org | Ship | Building | undefined;
    let targetOwnerOrg: Org | undefined;
    let targetName: string | undefined;

    if(characterAssignTarget?.position === 'admiral'){
       targetEntity = useGameStore(state => state.fleets.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg =  targetEntity.ownerNationId ? orgs[targetEntity.ownerNationId] : undefined;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'governor'){
        targetEntity = useGameStore(state => state.systems.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg =  targetEntity.ownerNationId ? orgs[targetEntity.ownerNationId] : undefined;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'leader'){
        targetEntity = orgs[characterAssignTarget.targetId];
        if(targetEntity){
            targetOwnerOrg = targetEntity;
            targetName = targetEntity.flavor.name;
        }
    }
    else if(characterAssignTarget?.position === 'surveyor'){
        targetEntity = useGameStore(state => state.ships.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? orgs[targetEntity.ownerNationId] : undefined;
            targetName = targetEntity.name;
        }
    }
    else if(characterAssignTarget?.position === 'scientist'){
        targetEntity = useGameStore(state => state.buildings.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? orgs[targetEntity.ownerNationId] : undefined;
            targetName = `${targetEntity.type} : ${targetEntity.id}`;
        }
    }
    else if(characterAssignTarget?.position === 'academyPresident'){
        targetEntity = useGameStore(state => state.buildings.entities[characterAssignTarget.targetId]);
        if(targetEntity){
            targetOwnerOrg = targetEntity.ownerNationId ? orgs[targetEntity.ownerNationId] : undefined;
            targetName = `${targetEntity.type} : ${targetEntity.id}`;
        }
    }
    else if(characterAssignTarget?.position === 'diplomat'){
        targetEntity = orgs[characterAssignTarget.targetId];
        if(targetEntity){
            targetOwnerOrg = orgs[1];
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
