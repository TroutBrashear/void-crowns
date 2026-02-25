import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import type { BuildingClass } from '../../types/gameState';
import styles from './Modal.module.css';


function BuildingSelectModal() {

    const selection = useUiStore(state => state.selection);
    const backModal = useUiStore(state => state.backModal);
    const closeModal = useUiStore(state => state.closeModal);

    const getBuildingById = useGameStore(state => state.getBuildingById);

    const buildingToShow =
    (selection?.type === 'building')
    ? getBuildingById(selection.id)
    : null;



    return (
        <div>
            <h2>Building: {buildingToShow.type}</h2>

            <button onClick={backModal}>Back</button>
            <button onClick={closeModal}>Close</button>
       </div>
    );
}

export default BuildingSelectModal;
