import type { GameState } from "../types/gameState";
import type { Fleet } from "../types/shipTypes";



export const getFleetById = (currentState: GameState, fleetId: number):  Fleet | undefined => {
    return currentState.fleets.entities[fleetId];
}
