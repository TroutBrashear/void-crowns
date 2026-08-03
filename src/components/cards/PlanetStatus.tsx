import { useGameStore } from '../../state/gameStore';

function PlanetStatus({ planetoidId }: { planetoidId: number }) {

    const getPlanetoidById = useGameStore(state => state.getPlanetoidById);

    const planetoid = getPlanetoidById(planetoidId);

    if(!planetoid || !planetoid.government || !planetoid.population ){
        return null;
    }


    return(
        <div>
        <p>{planetoid.name}</p>
        <p>{planetoid.government.status}</p>
        <p>Population: {planetoid.population.total} </p>
        </div>
    );
}

export default PlanetStatus;
