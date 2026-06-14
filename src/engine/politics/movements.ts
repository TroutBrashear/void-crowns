import type { GameState, Ideology } from '../../types/gameState';


export function spawnMovement(currentState: GameState, planetoidId: number, ideology: Ideology): GameState {
    const originatingPlanetoid = currentState.planetoids.entities[planetoidId];

    if(!originatingPlanetoid){
        return currentState;
    }

    return {
        ...currentState
    }
}
