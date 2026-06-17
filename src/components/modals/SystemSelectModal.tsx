import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import { hierarchizeSystem, getPlanetoidDepth } from '../../utils/system_view';
import styles from './Modal.module.css';

import { SYSTEM_METADATA } from '../../data/names';

import { Tooltip } from 'react-tooltip';
import { Button } from '../pure/Button';

function SystemSelectModal() {
  const selection = useUiStore(state => state.selection);
  //const setSelection = useUiStore(state => state.setSelection);
  const changeModal = useUiStore(state => state.changeModal);
  const closeModal = useUiStore(state => state.closeModal);
  const openAssignModal = useUiStore(state => state.openAssignModal);

  const planetoids = useGameStore(state => state.planetoids.entities);

  const getSystemById = useGameStore(state => state.getSystemById);
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

  const systemPlanetoids = hierarchizeSystem(planetoids, systemToShow.id);
  const systemOwnerOrg = systemToShow.ownerNationId
  ? getOrgById(systemToShow.ownerNationId)
  : null;

  const govCharacter = systemToShow.assignedCharacter
  ? getCharacterById(systemToShow.assignedCharacter)
  : null;

  const starMetadata = SYSTEM_METADATA[systemToShow.name] ?? { name: systemToShow.name, type: 'Machine Generated', lang: 'Machine Generated', blurb: 'N/A'};

  return (
    <div className={styles.modal}>
    <h2 data-tooltip-id='star tooltip'  data-tooltip-content={`Name: ${starMetadata.name} Type: ${starMetadata.type}  Language: ${starMetadata.lang}  Info: ${starMetadata.blurb}`}>System: {systemToShow.name}</h2>
    {systemOwnerOrg && <Button onClick={() => {changeModal('org_modal', {type: 'org', id: systemOwnerOrg.id}); }}>{systemOwnerOrg.flavor.name}</Button>}
    {systemToShow.ownerNationId === 1 && <Button onClick={() => buildMilShip({locationId: systemToShow.id, shipType: 'destroyer'})}>Construct Destroyer</Button>}

    {systemToShow.ownerNationId === 1 && <Button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'colony_ship'})}>Construct Colony Ship</Button>}
    {systemToShow.ownerNationId === 1 && <Button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'survey_ship'})}>Construct Survey Ship</Button>}
    {systemToShow.ownerNationId === 1 && <Button onClick={() => buildShip({locationId: systemToShow.id, shipType: 'construction_ship'})}>Construct Construction Ship</Button>}

    {govCharacter && <p>Governor: `${govCharacter.name.firstName} ${govCharacter.name.lastName}` </p>}
    {systemToShow.ownerNationId === 1 && <Button onClick={() => openAssignModal( "assign_character", {targetId: selection.id, position: 'governor'})}>Assign new Governor</Button>}
    <h3>Planetoids:</h3>
    <ul>
    {systemPlanetoids.map(planetoid => {
      if (!planetoid) return null;

      const depth = getPlanetoidDepth(planetoids, planetoid.id);

      const owner = planetoid.ownerNationId ? getOrgById(planetoid.ownerNationId) : null;

      const buttonStyle = {
        backgroundColor: owner ? owner.flavor.color : '#446',
        marginLeft: `${depth * 10}px`
      };

      return(
        <li key={planetoid.id}>
          <Button style={buttonStyle} onClick={() => {changeModal('planet_modal', {type: 'planetoid', id: planetoid.id}); }}>{planetoid.name}</Button>
        </li>);
    })}
    </ul>


    <Button onClick={closeModal}>Close</Button>
    <Tooltip id='star tooltip'  />
    </div>
    );
}

export default SystemSelectModal;
