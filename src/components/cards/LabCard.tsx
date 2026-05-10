import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';

import  ProgressBar  from '../pure/ProgressBar';

import { RESEARCH_CATALOG } from '../../data/research';
import type { ResearchDefinition } from '../../data/research';

function LabCard({ buildingId }: { buildingId: number }) {

    const openAssignModal = useUiStore(state => state.openAssignModal);

    const researchLab = useGameState(state => state.buildings.entities[buildingId]);

    if(!researchLab){
        return null;
    }

    let researchProject: ResearchDefinition | undefined;
    if(researchLab.research.project) {
        researchProject = RESEARCH_CATALOG[researchLab.research.project];
    }

    return(
        <div>
            <p>{researchLab.type} : {researchLab.id}</p>
            { researchProject ?  <div><p>Current project: {researchLab.research.project}</p> <ProgressBar fill={researchLab.research.progress} full={researchProject.cost ?? "10000"}/></div> : <p> No Project</p>}
            <button onClick={() => openAssignModal("assign_research", { targetId: researchLab.id, position: "scientist"})}>Assign Research Project</button>


            { researchLab.assignedCharacter ? <p> Scientist: {useGameStore(state => state.characters.entities[researchLab.assignedCharacter])?.name ?? "error"}</p> : <p> No Scientist </p>}
            <button onClick={() => openAssignModal("assign_character", { targetId: researchLab.id, position: "scientist"})}>Assign Scientist</button>
        </div>
    );
}

export default LabCard;
