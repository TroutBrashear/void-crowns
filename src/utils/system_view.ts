import type { Planetoid } from '../types/gameState';

export function getPlanetoidDepth(planetoids: Record<number, Planetoid>, planetoidId: number): number {
    const currentPlanetoid = planetoids[planetoidId];
    let planetaryDepth = 0;
    if(currentPlanetoid.parentPlanetoidId){
        planetaryDepth = getPlanetoidDepth(planetoids, currentPlanetoid.parentPlanetoidId) + 1;
    }

    return planetaryDepth;
}
