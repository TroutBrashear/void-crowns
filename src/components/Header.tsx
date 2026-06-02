import { useGameStore } from '../state/gameStore'; 
import { useUiStore } from '../state/uiStore';

import { Button } from './pure/Button';
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
        <Button onClick = {() => openPanel("diplomacy_panel")}>Diplomacy</Button>
        <Button onClick = {() => openPanel("politics_panel")}>Politics</Button>
        <Button onClick = {() => openPanel("research_panel")}>Research</Button>
      </div>
       <ResourcePanel resources={playerOrg.resources}/>
    </header>
  );
}
