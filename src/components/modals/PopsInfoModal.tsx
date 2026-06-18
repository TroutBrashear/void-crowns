import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';

import styles from './Modal.module.css';

import { Button } from '../pure/Button';


function PopsInfoModal() {
    const selection = useUiStore(state => state.selection);
    const backModal = useUiStore(state => state.backModal);
    const closeModal = useUiStore(state => state.closeModal);

    const getPopById = useGameStore(state => state.getPopById);
    const getPlanetoidById = useGameStore(state => state.getPlanetoidById);

    const planetToShow =
    (selection?.type === 'planetoid')
    ? getPlanetoidById(selection.id)
    : null;

    if (!planetToShow || !planetToShow.population) {
        return null;
    }

    const pops = planetToShow.population.popIds.map(popId => getPopById(popId));

    return (
        <div className={styles.modal}>
            <h2>{planetToShow.name} Population</h2>

            <ul>
                {pops.map(pop => {
                    if(!pop){
                        return null;
                    }
                    return(
                    <li key={pop.id}>
                        <p>{pop.species} {pop.id}</p>
                        <p>Happiness: {pop.feelings.happiness}</p>
                        <p>Fear: {pop.feelings.fear}</p>
                    </li>);
                })};
            </ul>

            <Button onClick={backModal}>Back</Button>
            <Button onClick={closeModal}>Close</Button>
        </div>
    );
}

export default PopsInfoModal;
