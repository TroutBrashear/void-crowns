import type { GameEvent, GameState } from '../../types/gameState';
import type { Ideology } from '../../types/govState';

//stub
export function determinePotentialIdeology(currentState: GameState): Ideology {
    if(currentState){
        return 'republican';
    }
     return 'republican';
}


export function spawnMovement(currentState: GameState, planetoidId: number, ideology: Ideology): {newState: GameState, event: GameEvent} {
    const originatingPlanetoid = currentState.planetoids.entities[planetoidId];

    let event: GameEvent = {
        type: 'pol_event',
        message: 'a',
        locationId: planetoidId,
        involvedOrgIds: [],
        isPlayerVisible: false,
    };

    if(!originatingPlanetoid){
        return {newState: currentState, event: event };
    }


    let nextId = currentState.meta.lastMovementId;

    let newMovement = {
        id: nextId++,
        ideology: ideology,
        originLocation: planetoidId,
        fervor: 0
    };

     event = {
         ...event,
        message: `a ${ideology} movement appeared on ${originatingPlanetoid.name}.`,
        locationId: originatingPlanetoid.locationSystemId,
        isPlayerVisible: originatingPlanetoid.ownerNationId === 1,
    };

    let nextState =  {
        ...currentState,
        meta: {
            ...currentState.meta,
            lastMovementId: nextId,
        },
        movements: {
            ids: [...currentState.movements.ids, nextId],
            entities: {
                ...currentState.movements.entities,
                [nextId]: newMovement
            }
        }
    };

    return { newState: nextState, event: event };
}
