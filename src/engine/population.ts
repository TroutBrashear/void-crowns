import { CYCLE_CONFIG } from '../constants/cycle_config';
import type { GameState, Pop } from '../types/gameState';
import { evaluatePlanetoidValue, getHabitablesInSystem } from './colonization';


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

export function findMigrationTarget(currentState: GameState, popId: number): number {
    const pop = currentState.pops.entities[popId];

    let currentOption = pop.locationId;
    let topValue = 0;

    const popSystem = currentState.systems.entities[currentState.planetoids.entities[pop.locationId].locationSystemId];

    //poss TODO: allow looking at neighbors of neighbors?

    for(const sysId of popSystem.adjacentSystemIds){
        const sysHabitables = getHabitablesInSystem(currentState, sysId);
        for(const habitable of sysHabitables){
            let habValue = evaluatePlanetoidValue(habitable);

            if(habitable.population){
                const planetoidPops = habitable.population.popIds.map(popId => currentState.pops.entities[popId]);
                habValue += (averagePopHappiness(planetoidPops) - 50) / 10;
            }

            if(habValue > topValue){
                currentOption = habitable.id;
                topValue = habValue;
            }
        }
    }

    return currentOption;
}

export function migratePop(currentState: GameState, popId: number, destinationId: number): GameState {
    let pop = { ... currentState.pops.entities[popId]};
    const originId = pop.locationId;


    let originPlanetoid = { ...currentState.planetoids.entities[originId]};
    let destinationPlanetoid = { ...currentState.planetoids.entities[destinationId]};

    if(!originPlanetoid.population){
        return currentState;
    }

    pop = {
        ...pop,
        locationId: destinationId
        feelings: {
            ...pop.feelings,
            happiness: 70 //reset so that the pop doesn't want to immediately migrate again
        }
    };

    let originPops = originPlanetoid.population.popIds.filter(cPopId => cPopId !== popId);

    originPlanetoid = {
        ...originPlanetoid,
        population: {
            ...originPlanetoid.population,
            popIds: originPops,
            total: originPlanetoid.population.total - 1
        }
    };

    if(destinationPlanetoid.population){
        destinationPlanetoid = {
            ...destinationPlanetoid,
            population: {
                ...destinationPlanetoid.population,
                popIds: [ ...destinationPlanetoid.population.popIds, popId],
                total: destinationPlanetoid.population.total + 1
            }
        };
    }
    else{
        destinationPlanetoid =  {
            ...destinationPlanetoid,
            population: {
                popIds: [popId],
                total: 1,
                progress: 0
            }
        };
    }

    return {
        ...currentState,
        pops: {
            ...currentState.pops,
            entities: {
                ...currentState.pops.entities,
                [popId]: pop
            }
        },
        planetoids: {
            ...currentState.planetoids,
            entities: {
                ...currentState.planetoids.entities,
                [originId]: originPlanetoid,
                [destinationId]: destinationPlanetoid
            }
        }
    }

}
