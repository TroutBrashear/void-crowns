import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';

import { getFleetById } from '../../state/selectors';

import { Button } from '../pure/Button';

function FleetSelectModal() {
  const selection = useUiStore(state => state.selection);
  if (!selection) {
    return null;
  }

  const closeModal = useUiStore(state => state.closeModal);
  const openAssignModal = useUiStore(state => state.openAssignModal);

  const fleetToShow = useGameStore(state => getFleetById(state, selection.id));
  const getCharacterById = useGameStore(state => state.getCharacterById);
  const getMilShipById = useGameStore(state => state.getMilShipById);

  if (!fleetToShow) {
    return null; 
  }

  const fleetShips = fleetToShow.ships.map(shipId => getMilShipById(shipId));

  const comCharacter = fleetToShow.assignedCharacter 
		? getCharacterById(fleetToShow.assignedCharacter) 
		: null;

  return (
    <div className={styles.modal}>
      <h2>Fleet: {fleetToShow.name}</h2>
      <p>Location: System {fleetToShow.locationSystemId}</p>
       {comCharacter && <p>Commander: { `${comCharacter.name.firstName} ${comCharacter.name.lastName}` } </p>}
	    {fleetToShow.ownerNationId === 1 && <button onClick={() => openAssignModal("assign_character", {targetId: selection.id, position: 'admiral'})}>Assign new Commander</button>}

      <p>Ships:</p>
      <ul>
        { fleetShips.map(ship => {
          if (!ship) return null;

          return(
            <li key={ship.id}>
             <p>{ship.flavor.name} </p>
            </li>);
        })}
      </ul>
      <Button onClick={closeModal}>Close</Button>
    </div>
  );
}

export default FleetSelectModal;
