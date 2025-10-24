import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';

function SystemSelectModal() {
  const selection = useUiStore(state => state.selection);
  const closeModal = useUiStore(state => state.closeModal);
  
  const getSystemById = useGameStore(state => state.getSystemById);
  const getPlanetoidById = useGameStore(state => state.getPlanetoidById);

  const systemToShow = 
    (selection?.type === 'system') 
    ? getSystemById(selection.id) 
    : null;

  if (!systemToShow) {
    return null; 
  }

  const planetoidIds = systemToShow.planetoids;
  const systemPlanetoids = planetoidIds.map(id => getPlanetoidById(id)).filter(Boolean);

  return (
    <div className={styles.modal}>
      <h2>System: {systemToShow.name}</h2>

      <h3>Planetoids</h3>
      <ul>
        {systemPlanetoids.map(planetoid => (
          <li key={planetoid.id}>
            {planetoid.name}
          </li>  
        ))}
      </ul>

      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default SystemSelectModal;
