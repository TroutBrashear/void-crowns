import { useGameStore } from '../../state/gameStore';
import { useUiStore } from '../../state/uiStore';

import Button from '../pure/Button';

function PlanetStatus({ planetoidId }: { planetoidId: number }) {
     const openAssignModal = useUiStore(state => state.openAssignModal);

    const planetoid = useGameStore(state => state.planetoids.entities[planetoidId]);

    if(!planetoid || !planetoid.government || !planetoid.population ){
        return null;
    }


    return(
        <div>
            <p>{planetoid.name}</p>
            <p>{planetoid.government.status}</p>
             <Button onClick={() => openAssignModal("assign_status", { targetId: planetoid.id, position: "scientist"})}>Change Status</Button>
            <p>Population: {planetoid.population.total} </p>
        </div>
    );
}

export default PlanetStatus;
