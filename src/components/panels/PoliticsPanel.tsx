import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

import { Button } from '../pure/Button';

function PoliticsPanel() {

    const closePanel = useUiStore(state => state.closePanel);
    const openAssignModal = useUiStore(state => state.openAssignModal);


    const getOrgById = useGameStore(state => state.getOrgById);
    const getCharacterById = useGameStore(state => state.getCharacterById);

    const playerOrg = getOrgById(1);

    //something is seriously wrong in this case...
    if(!playerOrg){
      return null;
    }



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
        {leaderChar ? <p>`${leaderChar.name.firstName} ${leaderChar.name.lastName}`</p> : <p>Vacant</p>}
        {isAssignable && <Button onClick={() => openAssignModal("assign_character", {targetId: 1, position: 'leader'})}>Assign new Leader</Button>}
      </div>
    );

}

export default PoliticsPanel;
