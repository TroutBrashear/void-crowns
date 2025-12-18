import type { GameState, ShipType, Building, BuildingClass } from '../types/gameState';
import { BUILDING_CATALOG } from '../data/buildings';

//global unit costs
const FLEET_COST = 10000;
const COL_SHIP_COST = 15000;

export function engineBuildFleet(currentState: GameState, locationId: number): GameState {

	const buildSystem = currentState.systems.entities[locationId];

      if(!buildSystem || buildSystem.ownerNationId === null)
      {
        return currentState;
      }
      const newId = currentState.meta.lastFleetId + 1;
      const ownerOrg = currentState.orgs.entities[buildSystem.ownerNationId];

      
      //if the org can't afford the fleet, do nothing.
      if(ownerOrg.resources.credits < FLEET_COST) {
        return currentState; 
      }

      const newFleet = {
        id: newId,
        name: "new Fleet",
        ownerNationId: buildSystem.ownerNationId,
        locationSystemId: locationId,
        movementPath: [],
        movesRemaining: 3,
      };

      const updatedOrg = {
        ...ownerOrg,
        resources: {
          ...ownerOrg.resources,
          credits: ownerOrg.resources.credits - FLEET_COST,
        }
      };

    return {
    	...currentState,
        fleets: {
          ...currentState.fleets,
          entities: {
            ...currentState.fleets.entities,
            [newId]: newFleet,
          },
          ids: [...currentState.fleets.ids, newId],
        },
        orgs: {
          ...currentState.orgs,
          entities: {
            ...currentState.orgs.entities,
            [ownerOrg.id]: updatedOrg,
          }
        },
        meta: {
          ...currentState.meta,
          lastFleetId: newId,
 	  	},
    };
}

export function engineBuildShip(currentState: GameState, locationId: number, shipType: ShipType){
    const buildSystem = currentState.systems.entities[locationId];

    if(!buildSystem || buildSystem.ownerNationId === null)
    {
      return currentState;
    }
    const newId = currentState.meta.lastShipId + 1;
    const ownerOrg = currentState.orgs.entities[buildSystem.ownerNationId];

    let cost: number = 0;

    switch(shipType){
      case 'colony_ship':
        cost = COL_SHIP_COST;
        break;
    }


      //if the org can't afford the fleet, do nothing.
      if(ownerOrg.resources.credits < cost) {
        return currentState; 
      }

      const newShip = {
        id: newId,
        name: "new Ship",
        type: shipType,
        ownerNationId: buildSystem.ownerNationId,
        locationSystemId: locationId,
        movementPath: [],
        };

      const updatedOrg = {
        ...ownerOrg,
        resources: {
          ...ownerOrg.resources,
          credits: ownerOrg.resources.credits - cost,
        }
      };

      return {
        ...currentState,
        ships: {
          ...currentState.ships,
          entities: {
            ...currentState.ships.entities,
            [newId]: newShip,
          },
          ids: [...currentState.ships.ids, newId],
        },
        orgs: {
          ...currentState.orgs,
          entities: {
            ...currentState.orgs.entities,
            [ownerOrg.id]: updatedOrg,
          }
        },
        meta: {
          ...currentState.meta,
          lastShipId: newId,
        },
      };
}

export function canBuildBuilding(currentState: GameState, planetoidId: number, buildingClass: BuildingClass, orgId: number){

	return true; //currently a rubber stamp - later use to filter what building options are displayed
}

export function engineBuildBuilding(currentState: GameState, planetoidId: number, buildingClass: BuildingClass, orgId: number){
  const planetoid = currentState.planetoids.entities[planetoidId];
  const system = currentState.systems.entities[planetoid.locationSystemId];
  const ownerId = system.ownerNationId; 
  const org = currentState.orgs.entities[ownerId];
  const bDefinition = BUILDING_CATALOG[buildingClass];
  const newId = currentState.meta.lastBuildingId + 1;

  const newBuilding: Building = {
    id: newId, 
    type: buildingClass,
    ownerNationId: ownerId
  };
  
  const updatedPlanetoid = {
    ...planetoid,
    buildings: [...planetoid.buildings, newBuilding]
  };
  
  const updatedOrg = {
    ...org,
    resources: {
      credits: org.resources.credits - bDefinition.cost.credits,
      rocks: org.resources.rocks - bDefinition.cost.rocks,
    }
  };
  
  return {
    ...currentState,
    planetoids: {
      ...currentState.planetoids,
      entities: { ...currentState.planetoids.entities, [planetoidId]: updatedPlanetoid }
    },
    orgs: {
      ...currentState.orgs,
      entities: { ...currentState.orgs.entities, [org.id]: updatedOrg }
    },
	meta: {
        ...currentState.meta,
        lastBuildingId: newId,
 	},
  };
}