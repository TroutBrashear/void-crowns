import { CYCLE_CONFIG } from '../constants/cycle_config';
import type { GameState, Pop } from '../types/gameState';


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
    let rolledSpecies = localPops[0].species;

    for(const [speciesId, speciesTotal] of Object.entries(speciesTotals)){
        weight += speciesTotal;
        if(speciesRoll < weight){
            rolledSpecies = Number(speciesId);
            break;
        }
    }

    return rolledSpecies;
}


export function pushPopEvent(currentEvents: string[], newEvent: string): string[] {
    let functionEvents = [ ...currentEvents ];

    functionEvents.push(newEvent);

    functionEvents.slice(-1 * CYCLE_CONFIG.POPULATION.MAX_RECENT_EVENTS);

    return functionEvents;
}


export function averagePopHappiness(pops: Pop[]): number {
    if(pops.length === 0){
        return 0;
    }

    let avg = 0;
    for(const pop of pops){
        avg += pop.feelings.happiness;
    }
    if(avg > 0){
        avg = avg / pops.length;
    }

    return avg;
}

export function gatherCitizenPops(currentState: GameState, orgId: number): Pop[] {
    let citizenPops: Pop[] = [];
    const planetoids = Object.values(currentState.planetoids.entities);

    for(const planetoid of planetoids){
        if(planetoid.ownerNationId !== orgId || !planetoid.population){
            continue;
        }

        for(const popId of planetoid.population.popIds){
            citizenPops.push(currentState.pops.entities[popId]);
        }
    }

    return citizenPops;
}
