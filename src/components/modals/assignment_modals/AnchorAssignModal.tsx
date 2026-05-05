import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import styles from './AssignModal.module.css';

function AnchorAssignModal() {
    const characterAssignTarget = useUiStore(state => state.characterAssignTarget); //which should be called simply assignTarget
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const constructAnchor = useGameStore(state => state.constructAnchor);
    const lanes = useGameStore(state => state.lanes.entities);
    const systems = useGameStore(state => state.systems.entities);

    const [selectedLane, setSelectedLane] = useState<number | null>(null);

    if(!characterAssignTarget){
        return null;
    }

    const hostSystem = systems[characterAssignTarget.targetId];

    if(!hostSystem){
        return null;
    }

    let laneOptions = hostSystem.adjacentLanes.map(laneId => lanes[laneId]);

    return(
          <div className={styles.assignModal}>
            <h3>Build an anchor station on the lane to: </h3>

            <div>
                {laneOptions.map(lane => {
                    return(
                        <button key={lane.id} className={`${styles.characterButton} ${lane.id === selectedLane ? styles.selected : ''}`} onClick={() => setSelectedLane(lane.id)}>
                            {lane.id}
                        </button>);
                })}
            </div>
            <button  disabled={!selectedLane} className={styles.characterButton} onClick={() => {if(selectedLane){
                constructAnchor({parentPlanetoidId: hostSystem.planetoids[0], targetLaneId: selectedLane});
                closeAssignModal();}}}>Construct </button>

                <button className={styles.characterButton} onClick={closeAssignModal}>Close</button>
          </div>
    );
}

export default AnchorAssignModal;
