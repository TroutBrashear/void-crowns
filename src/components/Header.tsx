import { TimeControls } from './controls/TimeControls';
import styles from './Header.module.css'; // We'll create this for styling

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.controls}>
        <TimeControls />
      </div>
    </header>
  );
}