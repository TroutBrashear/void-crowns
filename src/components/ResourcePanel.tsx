import type { Resources } from '../types/gameState'; 
import styles from './ResourcePanel.module.css';

interface ResourcePanelProps {
  resources: Resources;
}


export function ResourcePanel({ resources }: ResourcePanelProps) {
	return(
		<div className={styles.resourcePanel}>
			<div className={styles.resourceItem}>
				<span>Credits: </span>
				<span>{resources.credits}</span>
				<span>Rocks: </span>
				<span>{resources.rocks}</span>
			</div>
		</div>
	);
}
