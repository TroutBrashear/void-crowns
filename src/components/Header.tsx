import { useGameStore } from '../state/gameStore'; 
import { useUiStore } from '../state/uiStore';

import { TimeControls } from './controls/TimeControls';
import { ResourcePanel } from './ResourcePanel';
import styles from './Header.module.css';

export function Header() {
  const playerOrg = useGameStore(state => state.orgs.entities[1]);

  const openPanel = useUiStore(state => state.openPanel);

  return (
    <header className={styles.header}>
      <div className={styles.controls}>
        <TimeControls />
        <button onClick = {() => openPanel("diplomacy_panel")}>Diplomacy</button>
      </div>
       <ResourcePanel resources={playerOrg.resources}/>
    </header>
  );
}
