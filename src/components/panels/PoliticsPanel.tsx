import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

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


    return (
      <div className={styles.panel}>
        <h1>Politics</h1>
        <button onClick={() => closePanel()}>Close</button>


        <h3>Leader:</h3>
        {leaderChar ? <p>{leaderChar.name}</p> : <p>Vacant</p>}
        <button onClick={() => openAssignModal("assign_character", {targetId: 1, position: 'leader'})}>Assign new Leader</button>
      </div>
    );

}

export default PoliticsPanel;
