import { useGameStore } from '../state/gameStore'; 

import { TimeControls } from './controls/TimeControls';
import { ResourcePanel } from './ResourcePanel';
import styles from './Header.module.css';

export function Header() {
  const playerOrg = useGameStore(state => state.orgs.entities[1]);

  return (
    <header className={styles.header}>
      <div className={styles.controls}>
        <TimeControls />
      </div>
       <ResourcePanel resources={playerOrg.resources}/>
    </header>
  );
}