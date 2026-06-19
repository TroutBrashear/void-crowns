import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import styles from './AssignModal.module.css';

import { Button } from '../../pure/Button';

function HabitatAssignModal() {
    const characterAssignTarget = useUiStore(state => state.characterAssignTarget); //which should be called simply assignTarget
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const getPlanetoidsBySystem = useGameStore(state => state.getPlanetoidsBySystem);
    const constructHabitat = useGameStore(state => state.constructHabitat);

    const [selectedPlanetoid, setselectedPlanetoid] = useState<number | null>(null);

    if(!characterAssignTarget){
        return null;
    }

   let planetoidOptions = getPlanetoidsBySystem(characterAssignTarget.targetId);

   planetoidOptions = planetoidOptions.filter(planetoid => planetoid.classification !== 'gravWell' && planetoid.classification !== 'station');

    return(
        <div className={styles.assignModal}>
            <h3>Build a habitat on the Planetoid: </h3>

            <div>
            {planetoidOptions.map(planetoid => {
                return(
                    <Button key={planetoid.id} className={`${styles.characterButton} ${planetoid.id === selectedPlanetoid ? styles.selected : ''}`} onClick={() => setselectedPlanetoid(planetoid.id)}>
                    {planetoid.id}
                    </Button>);
            })}
            </div>
            <Button  disabled={!selectedPlanetoid} className={styles.characterButton} onClick={() => {if(selectedPlanetoid){
            constructHabitat({ targetPlanetoid: selectedPlanetoid });
            closeAssignModal();}}}>Construct </Button>

            <Button className={styles.characterButton} onClick={closeAssignModal}>Close</Button>
        </div>
    );
}

export default HabitatAssignModal;
