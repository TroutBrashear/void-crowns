import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';

function FleetSelectModal() {
  const selection = useUiStore(state => state.selection);
  const closeModal = useUiStore(state => state.closeModal);
  
  const getFleetById = useGameStore(state => state.getFleetById);
  const getCharacterById = useGameStore(state => state.getCharacterById);

  const fleetToShow = 
    (selection?.type === 'fleet') 
    ? getFleetById(selection.id) 
    : null;

  if (!fleetToShow) {
    return null; 
  }
  
  const comCharacter = fleetToShow.assignedCharacter 
		? getCharacterById(fleetToShow.assignedCharacter) 
		: null;

  return (
    <div className={styles.modal}>
      <h2>Fleet: {fleetToShow.name}</h2>
      <p>Location: System {fleetToShow.locationSystemId}</p>
       {comCharacter && <p>Commander: { comCharacter.name} </p>}
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default FleetSelectModal;