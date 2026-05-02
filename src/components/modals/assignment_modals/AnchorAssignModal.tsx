import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import styles from './AssignModal.module.css';

function AnchorAssignModal() {
    const characterAssignTarget = useUiStore(state => state.characterAssignTarget); //which should be called simply assignTarget
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const getSystemById = useGameStore(state => state.getSystemById);

    const [selectedLane, setSelectedLane] = useState<number | null>(null);

    if(!characterAssignTarget){
        return null;
    }

    const hostSystem = getSystemById(characterAssignTarget.targetId);

    let laneOptions = hostSystem.adjacentLanes.map(laneId => useGameStore(state => state.lanes.entities[laneId]));

    return(
          <div className={styles.assignModal}>
            <h3>Build an anchor station on the lane to: </h3>

            <div>
                {laneOptions.map(lane => {
                    <button key={lane.id} className={`${styles.characterButton} ${lane.id === selectedLane ? styles.selected : ''}`} onClick={() => setSelectedLane(lane.id)}>
                        {lane.id}
                    </button>);
                })}
            </div>
            <button  disabled={!selectedLane} className={styles.characterButton} onClick={() => {if(selectedLane){

                closeAssignModal();}}}>Construct </button>

                <button className={styles.characterButton} onClick={closeAssignModal}>Close</button>
          </div>
    );
}

export default AnchorAssignModal;
