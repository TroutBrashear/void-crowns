import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';

function SystemSelectModal() {
  const selection = useUiStore(state => state.selection);
  const closeModal = useUiStore(state => state.closeModal);
  
  const getSystemById = useGameStore(state => state.getSystemById);

  const systemToShow = 
    (selection?.type === 'system') 
    ? getSystemById(selection.id) 
    : null;

  if (!systemToShow) {
    return null; 
  }

  return (
    <div className={styles.modal}>
      <h2>System: {systemToShow.name}</h2>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default SystemSelectModal;
