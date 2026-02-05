import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

function PoliticsPanel() {

    const closePanel = useUiStore(state => state.closePanel);

    const getOrgById = useGameStore(state => state.getOrgById);
    const getCharacterById = useGameStore(state => state.getCharacterById);

    const setSelection = useUiStore(state => state.setSelection);

    const playerOrg = getOrgById(1);

    let leaderChar = getCharacterById(playerOrg.characters.leaderId);

    return (
      <div className={styles.panel}>
        <h1>Politics</h1>
        <button onClick={() => closePanel()}>Close</button>


        <h3>Leader:</h3>
        {leaderChar ? <p>{leaderChar.name}</p> : <p>Vacant</p>}
      </div>
    );

}

export default PoliticsPanel;
