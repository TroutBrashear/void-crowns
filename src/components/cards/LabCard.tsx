import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';

import  ProgressBar  from '../pure/ProgressBar';
import { Button } from '../pure/Button';

import { RESEARCH_CATALOG } from '../../data/research';
import type { ResearchDefinition } from '../../data/research';

import type { Character } from '../../types/charState';

function LabCard({ buildingId }: { buildingId: number }) {

    const openAssignModal = useUiStore(state => state.openAssignModal);

    const getBuildingById = useGameStore(state => state.getBuildingById);

    const researchLab = getBuildingById (buildingId);

    if(!researchLab){
        return null;
    }

    let researchProject: ResearchDefinition | undefined;
    if(researchLab.research.project) {
        researchProject = RESEARCH_CATALOG[researchLab.research.project];
    }

    let assignedCharacter: Character | undefined;

    return(
        <div>
            <p>{researchLab.type} : {researchLab.id}</p>
            { researchProject ?  <div><p>Current project: {researchLab.research.project}</p> <ProgressBar fill={researchLab.research.progress} full={researchProject.cost ?? "10000"}/></div> : <p> No Project</p>}
            <Button onClick={() => openAssignModal("assign_research", { targetId: researchLab.id, position: "scientist"})}>Assign Research Project</Button>


            { assignedCharacter ? <p> Scientist: {`${assignedCharacter.name.firstName} ${assignedCharacter.name.lastName}` }</p> : <p> No Scientist </p>}
            <Button onClick={() => openAssignModal("assign_character", { targetId: researchLab.id, position: "scientist"})}>Assign Scientist</Button>
        </div>
    );
}

export default LabCard;
