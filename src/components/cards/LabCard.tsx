import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';

function LabCard({ buildingId: number}) {

    const openAssignModal = useUiStore(state => state.openAssignModal);

    const getBuildingById = useGameStore(state => state.getBuildingById);
    const getCharacterById = useGameStore(state => state.getCharacterById);

    const researchLab = getBuildingById (buildingId);

    if(!researchLab){
        return null;
    }

    const assignedCharacter = ;

    return(
        <div>
            <p>{researchLab.type} : {researchLab.id}</p>
            { researchLab.research.project ?  <p>Current project: {researchLab.research.project}</p> : <p> No Project</p>}
            <button onClick={() => openAssignModal("assign_research", { targetId: researchLab.id, position: "nonapp"})}>Assign Research Project</button>

            { researchLab.assignedCharacter ? <p> Scientist: {getCharacterById(researchLab.assignedCharacter).name} : <p> No Scientist </p>}
            <button onClick={() => openAssignModal("assign_character", { targetId: researchLab.id, position: "scientist"})}>Assign Scientist</button>
        </div>
    );
}

export default LabCard;
