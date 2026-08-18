import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';

import { Button } from '../pure/Button';


function BuildingSelectModal() {
    const selection = useUiStore(state => state.selection);
    if (!selection) {
        return null;
    }

    const backModal = useUiStore(state => state.backModal);
    const closeModal = useUiStore(state => state.closeModal);
    const openAssignModal = useUiStore(state => state.openAssignModal);
    const characters = useGameStore(state => state.characters.entities);



    const buildingToShow =
    (selection?.type === 'building')
    ? useGameStore(state=> state.buildings.entities[selection.id])
    : null;


    if(!buildingToShow){
        return null;
    }

    const assignedCharacter = buildingToShow.assignedCharacter ? characters[buildingToShow.assignedCharacter] : null;


    return (
        <div className={styles.modal}>
            <h2>Building: {buildingToShow.type}</h2>
            {buildingToShow.tags.includes("academy") &&
                <div>
                    <p>Academy President: { assignedCharacter ? `${assignedCharacter.name.firstName} ${assignedCharacter.name.lastName}`  : null } </p>
                    {buildingToShow.ownerNationId === 1 && <button onClick={() => openAssignModal("assign_character", {targetId: selection.id, position: "academyPresident"})}>Assign Academy President</button>}
                </div>
            }

            {buildingToShow.type === 'researchLab' &&
                <div>
                <p>Scientist: { assignedCharacter ? `${assignedCharacter.name.firstName} ${assignedCharacter.name.lastName}`  : null } </p>
                {buildingToShow.ownerNationId === 1 && <button onClick={() => openAssignModal("assign_character", {targetId: selection.id, position: "scientist"})}>Assign Scientist</button>}
                </div>
            }

            <Button onClick={backModal}>Back</Button>
            <Button onClick={closeModal}>Close</Button>
       </div>
    );
}

export default BuildingSelectModal;
