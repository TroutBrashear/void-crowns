import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import styles from './AssignModal.module.css';

import { Button } from '../../pure/Button';

import type { PoliticalStatus } from '../../../types/govState';


function StatusAssignModal() {
     const characterAssignTarget = useUiStore(state => state.characterAssignTarget); //which should be called simply assignTarget
     const closeAssignModal = useUiStore(state => state.closeAssignModal);


     const getPlanetoidById = useGameStore(state => state.getPlanetoidById);
     const assignStatus = useGameStore(state => state.assignStatus);

     const [selectedStatus, setSelectedStatus] = useState<PoliticalStatus | null>(null);

     if(!characterAssignTarget){
         return null;
     }

     const targetPlanetoid = getPlanetoidById(characterAssignTarget.targetId);

     if(!targetPlanetoid){
         return null;
    }

    return(
        <div className={styles.assignModal}>
            <h3>Assigning Political Status to {targetPlanetoid.name}</h3>

            <Button key={"Core"} className={`${styles.characterButton} ${"Core" === selectedStatus ? styles.selected : ''}`} onClick={() => setSelectedStatus("Core")}>Core</Button>
            <Button key={"Martial"} className={`${styles.characterButton} ${"Martial" === selectedStatus ? styles.selected : ''}`} onClick={() => setSelectedStatus("Martial")}>Core</Button>
            <Button key={"Colony"} className={`${styles.characterButton} ${"Colony" === selectedStatus ? styles.selected : ''}`} onClick={() => setSelectedStatus("Colony")}>Core</Button>

            <Button  disabled={!selectedStatus} className={styles.characterButton} onClick={() => {if(selectedStatus){
                assignStatus({planetoidId: targetPlanetoid.id, newStatus: selectedStatus});
                closeAssignModal();}}}>Assign </Button>

            <Button className={styles.characterButton} onClick={closeAssignModal}>Close</Button>
        </div>
    );
}

export default StatusAssignModal;
