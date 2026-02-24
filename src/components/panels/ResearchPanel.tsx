import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

function ResearchPanel() {

    const closePanel = useUiStore(state => state.closePanel);


    return (
        <div className={styles.panel}>
        <h1>Research</h1>
        <button onClick={() => closePanel()}>Close</button>

        </div>
    );

}

export default ResearchPanel;
