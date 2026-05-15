import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';


function BuildingSelectModal() {

    const selection = useUiStore(state => state.selection);
    const backModal = useUiStore(state => state.backModal);
    const closeModal = useUiStore(state => state.closeModal);
    const openAssignModal = useUiStore(state => state.openAssignModal);

    const getBuildingById = useGameStore(state => state.getBuildingById);
    const getCharacterById = useGameStore(state => state.getCharacterById);

    if (!selection) {
        return null;
    }

    const buildingToShow =
    (selection?.type === 'building')
    ? getBuildingById(selection.id)
    : null;


    if(!buildingToShow){
        return null;
    }

    const assignedCharacter = buildingToShow.assignedCharacter ? getCharacterById(buildingToShow.assignedCharacter) : null;


    return (
        <div className={styles.modal}>
            <h2>Building: {buildingToShow.type}</h2>
            {buildingToShow.type === 'navalAcademy' &&
                <div>
                    <p>Academy President: { assignedCharacter ? assignedCharacter.name : null } </p>
                    {buildingToShow.ownerNationId === 1 && <button onClick={() => openAssignModal("assign_character", {targetId: selection.id, position: "academyPresident"})}>Assign Academy President</button>}
                </div>
            }

            {buildingToShow.type === 'researchLab' &&
                <div>
                <p>Scientist: { assignedCharacter ? assignedCharacter.name : null } </p>
                {buildingToShow.ownerNationId === 1 && <button onClick={() => openAssignModal("assign_character", {targetId: selection.id, position: "scientist"})}>Assign Scientist</button>}
                </div>
            }

            <button onClick={backModal}>Back</button>
            <button onClick={closeModal}>Close</button>
       </div>
    );
}

export default BuildingSelectModal;
