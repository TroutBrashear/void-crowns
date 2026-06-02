import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import LabCard  from '../cards/LabCard';
import styles from './Panel.module.css';

import { Button } from '../pure/Button';

function ResearchPanel() {

    const closePanel = useUiStore(state => state.closePanel);

    const buildings = useGameStore(state => state.buildings.entities);
    const researchLabs = Object.values(buildings).filter(building => building.type === 'researchLab' && building.ownerNationId === 1);

    return (
        <div className={styles.panel}>
            <h1>Research</h1>
            <Button onClick={() => closePanel()}>Close</Button>

            <h3>Labs:</h3>
            <ul>
                {researchLabs.map(lab => {
                    return(
                        <li key={lab.id}>
                            <LabCard buildingId={lab.id}/>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

}

export default ResearchPanel;
