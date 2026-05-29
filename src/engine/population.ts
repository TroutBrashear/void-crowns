import type { GameState } from '../types/gameState';


export function popIncreaseSpeciesRoll(currentState: GameState, planetoidId: number): number | null {
    const planetoid = currentState.planetoids.entities[planetoidId];
    if(!planetoid.population){
        return null;
    }
    const localPops = Object.values(currentState.pops.entities).filter(pop => pop.locationId === planetoidId);

    let speciesTotals: Record<number, number> = {} ;
    const popTotal = localPops.length;

    for(const pop of localPops){
        if(speciesTotals[pop.species]){
            speciesTotals[pop.species] += 1;
        }
        else{
            speciesTotals[pop.species] = 1;
        }
    }

    const speciesRoll = Math.random() * popTotal;
    let weight = 0;
    let rolledSpecies = localPops[0].id;

    for(const [speciesId, speciesTotal] of Object.entries(speciesTotals)){
        weight += speciesTotal;
        if(speciesRoll < weight){
            rolledSpecies = Number(speciesId);
            break;
        }
    }

    return rolledSpecies;
}
