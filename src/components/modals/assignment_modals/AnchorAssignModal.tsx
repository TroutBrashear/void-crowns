import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import styles from './AssignModal.module.css';

import { Button } from '../../pure/Button';

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

    const laneOptions = hostSystem.adjacentLanes.map(laneId => lanes[laneId]);

    return(
          <div className={styles.assignModal}>
            <h3>Build an anchor station on the lane to: </h3>

            <div>
                {laneOptions.map(lane => {
                    return(
                        <Button key={lane.id} className={`${styles.characterButton} ${lane.id === selectedLane ? styles.selected : ''}`} onClick={() => setSelectedLane(lane.id)}>
                            {lane.id}
                        </Button>);
                })}
            </div>
            <Button  disabled={!selectedLane} className={styles.characterButton} onClick={() => {if(selectedLane){
                constructAnchor({parentPlanetoidId: hostSystem.planetoids[0], targetLaneId: selectedLane});
                closeAssignModal();}}}>Construct </Button>

                <Button className={styles.characterButton} onClick={closeAssignModal}>Close</Button>
          </div>
    );
}

export default AnchorAssignModal;
