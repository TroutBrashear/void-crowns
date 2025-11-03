import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';

function SystemSelectModal() {
  const selection = useUiStore(state => state.selection);
  const setSelection = useUiStore(state => state.setSelection);
  const openModal = useUiStore(state => state.openModal);
  const closeModal = useUiStore(state => state.closeModal);
  
  const getSystemById = useGameStore(state => state.getSystemById);
  const getPlanetoidById = useGameStore(state => state.getPlanetoidById);
  const getOrgById = useGameStore(state => state.getOrgById);
  const buildFleet = useGameStore(state => state.buildFleet);
  const buildShip = useGameStore(state => state.buildShip);

  const systemToShow = 
    (selection?.type === 'system') 
    ? getSystemById(selection.id) 
    : null;

  if (!systemToShow) {
    return null; 
  }

  const planetoidIds = systemToShow.planetoids;
  const systemPlanetoids = planetoidIds.map(id => getPlanetoidById(id)).filter(Boolean);
  const systemOwnerOrg = systemToShow.ownerNationId 
  ? getOrgById(systemToShow.ownerNationId) 
  : null;

  return (
    <div className={styles.modal}>
      <h2>System: {systemToShow.name}</h2>
      {systemOwnerOrg && <button onClick={() => {setSelection({type: 'org', id: systemOwnerOrg.id}); openModal('org_modal'); }}>{systemOwnerOrg.name}</button>}
      {systemToShow.ownerNationId === 1 && <button onClick={() => buildFleet(systemToShow.id)}>Construct Fleet</button>}

      {systemToShow.ownerNationId === 1 && <button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'colony_ship'})}>Construct Colony Ship</button>}

      <h3>Planetoids</h3>
      <ul>
        {systemPlanetoids.map(planetoid => {
          if (!planetoid) return null; 
          return(
            <li key={planetoid.id}>
              {planetoid.name}
           </li>);
        })}
      </ul>

      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default SystemSelectModal;
