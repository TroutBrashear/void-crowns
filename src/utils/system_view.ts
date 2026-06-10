import type { Planetoid } from '../types/geoState';

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

    let results: Planetoid[] = [];

    for(const star of stars){
        results.push(...orderChildren(systemPlanetoids, star));
    }

    return results;
}




//planetoid display functions
export function aggregateStockpiles(planetoid: Planetoid): Record<string, number> {
    let allGoods: Record<string, number> = {};
    if(planetoid.resources.goodsStockpiles){
        let orgKeys = Object.keys(planetoid.resources.goodsStockpiles);
        for(const orgId of orgKeys){
            for(const goodId of Object.keys(planetoid.resources.goodsStockpiles[Number(orgId)])){
                if(allGoods[goodId]){
                    allGoods[goodId] += planetoid.resources.goodsStockpiles[Number(orgId)][Number(goodId)];
                }
                else{
                    allGoods[goodId] = planetoid.resources.goodsStockpiles[Number(orgId)][Number(goodId)];
                }
            }
        }
    }

    return allGoods;
}
