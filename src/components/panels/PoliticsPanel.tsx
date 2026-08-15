import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

import PlanetStatus  from '../cards/PlanetStatus';

import { Button } from '../pure/Button';

function PoliticsPanel() {

    const closePanel = useUiStore(state => state.closePanel);
    const openAssignModal = useUiStore(state => state.openAssignModal);


    const playerOrg = useGameStore(state => state.orgs.entities[1]);
    const getCharacterById = useGameStore(state => state.getCharacterById);


    //something is seriously wrong in this case...
    if(!playerOrg){
      return null;
    }

    const planetoids = useGameStore(state => state.planetoids.entities);
    const orgPlanetoids = Object.values(planetoids).filter(planetoid => planetoid.ownerNationId === 1);

    let leaderChar;
    if(playerOrg.characters.leaderId){
      leaderChar = getCharacterById(playerOrg.characters.leaderId);
    }

    const isAssignable = playerOrg.government.succession !== 'heriditary';

    return (
      <div className={styles.panel}>
        <h1>Politics</h1>
        <Button onClick={() => closePanel()}>Close</Button>


        <h3>Leader:</h3>
        {leaderChar ? <p>`{leaderChar.name.firstName} {leaderChar.name.lastName}`</p> : <p>Vacant</p>}
        {isAssignable && <Button onClick={() => openAssignModal("assign_character", {targetId: 1, position: 'leader'})}>Assign new Leader</Button>}


        <h3>Planets</h3>
        <ul>
        {orgPlanetoids.map(planetoid => {
          return(
            <li key={planetoid.id}>
            <PlanetStatus planetoidId={planetoid.id}/>
            </li>
          );
        })}
        </ul>

      </div>
    );

}

export default PoliticsPanel;
