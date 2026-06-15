import type { GameState, Ideology } from '../../types/gameState';

//stub
export function determinePotentialIdeology(currentState: GameState): Ideology {
    if(currentState){
        return 'republican';
    }
     return 'republican';
}


export function spawnMovement(currentState: GameState, planetoidId: number, ideology: Ideology): GameState {
    const originatingPlanetoid = currentState.planetoids.entities[planetoidId];

    if(!originatingPlanetoid){
        return currentState;
    }

    let nextId = currentState.meta.lastMovementId;

    let newMovement = {
        id: nextId++,
        ideology: ideology,
        originLocation: planetoidId,
        fervor: 0
    };

    return {
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
    }
}
