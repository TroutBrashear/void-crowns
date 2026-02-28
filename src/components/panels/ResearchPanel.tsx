import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

function ResearchPanel() {

    const closePanel = useUiStore(state => state.closePanel);
    const openAssignModal = useUiStore(state => state.openAssignModal);

    const buildings = useGameStore(state => state.buildings.entities);
    const researchLabs = Object.values(buildings).filter(building => building.type === 'researchLab' && building.ownerNationId === 1);

    return (
        <div className={styles.panel}>
            <h1>Research</h1>
            <button onClick={() => closePanel()}>Close</button>

            <h3>Labs:</h3>
            <ul>
                {researchLabs.map(lab => {
                    return(
                        <li key={lab.id}>
                            <p>{lab.type} : {lab.id}</p>
                            { lab.research.project ?  <p>Current project: {lab.research.project}</p> : <p> No Project</p>}
                            <button onClick={() => openAssignModal("assign_research", { targetId: lab.id, position: "nonapp"})}>Assign Research Project</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

}

export default ResearchPanel;
