import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';

function SystemSelectModal() {
  const selection = useUiStore(state => state.selection);
  //const setSelection = useUiStore(state => state.setSelection);
  const changeModal = useUiStore(state => state.changeModal);
  const closeModal = useUiStore(state => state.closeModal);
  const openAssignModal = useUiStore(state => state.openAssignModal);


  const getSystemById = useGameStore(state => state.getSystemById);
  const getPlanetoidById = useGameStore(state => state.getPlanetoidById);
  const getCharacterById = useGameStore(state => state.getCharacterById);
  const getOrgById = useGameStore(state => state.getOrgById);
  const buildShip = useGameStore(state => state.buildShip);
  const buildMilShip = useGameStore(state => state.buildMilShip);

  if (!selection) {
    return null;
  }

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

  const govCharacter = systemToShow.assignedCharacter
  ? getCharacterById(systemToShow.assignedCharacter)
  : null;


  return (
    <div className={styles.modal}>
    <h2>System: {systemToShow.name}</h2>
    {systemOwnerOrg && <button onClick={() => {changeModal('org_modal', {type: 'org', id: systemOwnerOrg.id}); }}>{systemOwnerOrg.flavor.name}</button>}
    {systemToShow.ownerNationId === 1 && <button onClick={() => buildMilShip({locationId: systemToShow.id, shipType: 'destroyer'})}>Construct Destroyer</button>}

    {systemToShow.ownerNationId === 1 && <button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'colony_ship'})}>Construct Colony Ship</button>}
    {systemToShow.ownerNationId === 1 && <button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'survey_ship'})}>Construct Survey Ship</button>}
    {systemToShow.ownerNationId === 1 && <button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'construction_ship'})}>Construct Construction Ship</button>}

    {govCharacter && <p>Governor: { govCharacter.name} </p>}
    {systemToShow.ownerNationId === 1 && <button onClick={() => openAssignModal( "assign_character", {targetId: selection.id, position: 'governor'})}>Assign new Governor</button>}
    <h3>Planetoids:</h3>
    <ul>
    {systemPlanetoids.map(planetoid => {
      if (!planetoid) return null;

      const owner = planetoid.ownerNationId ? getOrgById(planetoid.ownerNationId) : null;

      const buttonStyle = {
        backgroundColor: owner ? owner.flavor.color : '#aaa'
      };

      return(
        <li key={planetoid.id}>
          <button style={buttonStyle} onClick={() => {changeModal('planet_modal', {type: 'planetoid', id: planetoid.id}); }}>{planetoid.name}</button>
        </li>);
    })}
    </ul>

    <button onClick={closeModal}>Close</button>
    </div>
    );
}

export default SystemSelectModal;
