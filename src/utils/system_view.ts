import type { Planetoid } from '../types/gameState';

export function getPlanetoidDepth(planetoids: Record<number, Planetoid>, planetoidId: number): number {
    const currentPlanetoid = planetoids[planetoidId];
    let planetaryDepth = 0;
    if(currentPlanetoid.parentPlanetoidId){
        planetaryDepth = getPlanetoidDepth(planetoids, currentPlanetoid.parentPlanetoidId) + 1;
    }

    return planetaryDepth;
}

function orderChildren(planetoids: Planetoid[], parent: Planetoid): Planetoid[]{
    let children: Planetoid[] = [];
    children.push(parent);
    for(const planetoid of planetoids){
        if(planetoid.parentPlanetoidId === parent.id){
            children = [...children, ...orderChildren(planetoids, planetoid)];
        }
    }

    return children;
}

export function hierarchizeSystem(planetoids: Record<number, Planetoid>, systemId: number): Planetoid[] {
    let systemPlanetoids = Object.values(planetoids).filter(planetoid => planetoid.locationSystemId === systemId);

    let stars = systemPlanetoids.filter(planetoid => planetoid.parentPlanetoidId === null);

    for(const star of stars){
         systemPlanetoids.push(...orderChildren(systemPlanetoids, star));
    }


    return systemPlanetoids;
}
