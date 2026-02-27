import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import { RESEARCH_CATALOG } from '../../../data/research';

import styles from './AssignModal.module.css';


function ResearchAssignModal() {
    const characterAssignTarget = useUiStore(state => state.characterAssignTarget); //which should be called simply assignTarget
    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const getOrgById = useGameStore(state => state.getOrgById);
    const getBuildingById = useGameStore(state => state.getBuildingById);
    const getOrgResearchOptions = useGameStore(state => state.getOrgResearchOptions);
    const assignResearch = useGameStore(state => state.assignResearch);

    const [selectedResearch, setSelectedResearch] = useState<string | null>(null);


    const targetBuilding = getBuildingById(characterAssignTarget.targetId);

    if(!targetBuilding){
        return null;
    }

    const targetOwnerOrg =  getOrgById(targetBuilding.ownerNationId);

    if(!targetOwnerOrg){
        return null;
    }

    const researchOptions = getOrgResearchOptions(targetBuilding.ownerNationId);

    return(
        <div className={styles.assignModal}>
            <h3>Assigning Research to {targetBuilding.type} : {targetBuilding.id}</h3>

            <div>
                {researchOptions.map(researchId => {
                    const research = RESEARCH_CATALOG[researchId];
                    if (!research) return null;
                    return(
                        <button key={research.researchId} className={`${styles.characterButton} ${research.researchId === selectedResearch ? styles.selected : ''}`} onClick={() => setSelectedResearch(research.researchId)}>
                        {research.researchId}
                        </button>);
                })}
            </div>

            <button  disabled={!selectedResearch} className={styles.characterButton} onClick={() => {if(selectedResearch){
                 assignResearch({buildingId: targetBuilding.id, researchId: selectedResearch});
                 closeAssignModal();}}}>Assign </button>

            <button className={styles.characterButton} onClick={closeAssignModal}>Close</button>
        </div>
    );
}

export default ResearchAssignModal;
