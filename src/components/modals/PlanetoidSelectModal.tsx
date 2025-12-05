import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';


function PlanetoidSelectModal() {
	const selection = useUiStore(state => state.selection);
    const setSelection = useUiStore(state => state.setSelection);
    const backModal = useUiStore(state => state.backModal);
    const closeModal = useUiStore(state => state.closeModal);

    const getSystemById = useGameStore(state => state.getSystemById);
    const getPlanetoidById = useGameStore(state => state.getPlanetoidById);
    const getOrgById = useGameStore(state => state.getOrgById);

    const planetToShow = 
    (selection?.type === 'planetoid') 
    ? getPlanetoidById(selection.id) 
    : null;

  	if (!planetToShow) {
  	  return null; 
  	}

  	const parentSystem = getSystemById(planetToShow.locationSystemId);


	return (
		<div className={styles.modal}>
    	  <h2>Planetoid: {planetToShow.name}</h2>
      	  <h3>In the System: {parentSystem.name}</h3>

      	  <h4>Buildings:</h4>

      	  <button onClick={backModal}>Back</button>
      	  <button onClick={closeModal}>Close</button>
    	</div>
	);

}

export default PlanetoidSelectModal;
