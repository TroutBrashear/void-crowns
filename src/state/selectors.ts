import type { GameState } from "../types/gameState";
import type { Planetoid, System } from "../types/geoState";
import type { Fleet } from "../types/shipTypes";



export const getFleetById = (currentState: GameState, fleetId: number):  Fleet | undefined => {
    return currentState.fleets.entities[fleetId];
}


export const getFleetsBySystem = (currentState: GameState, systemId: number): Fleet[] => {
    return Object.values(currentState.fleets.entities).filter(fleet => fleet.locationSystemId === systemId);
}

export const getSystemsByOrg = (currentState: GameState, orgId: number): System[] => {
    return Object.values(currentState.systems.entities).filter(system => system.ownerNationId === orgId);
}

export const getPlanetoidsBySystem = (currentState: GameState, systemId: number): Planetoid[] => {
    const system = currentState.systems.entities[systemId];

    return system.planetoids.map(planetoidId => currentState.planetoids.entities[planetoidId]);
}
