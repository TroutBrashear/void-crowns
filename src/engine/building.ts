import type { GameState, ShipType, Building, BuildingClass, EngineResult } from '../types/gameState';

import { BUILDING_CATALOG } from '../data/buildings';
import { NAME_LISTS } from '../data/names';

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
	
	  const nameList = NAME_LISTS[ownerOrg.flavor.nameList];
	
	  let fleetName = nameList.fleetNames[Math.floor(Math.random()* nameList.fleetNames.length)];

      const newFleet = {
        id: newId,
        name: fleetName,
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

export function canBuildBuilding(currentState: GameState, _planetoidId: number, buildingClass: BuildingClass, orgId: number){
	const bDefinition = BUILDING_CATALOG[buildingClass];
	const org = currentState.orgs.entities[orgId];
	
	if (!org) {
        return false;
    }
	
	//check cost - can org afford the Building
	if((org.resources.credits < bDefinition.cost.credits )){
		return false;
	}
	
	return true; 
}

export function engineBuildBuilding(currentState: GameState, planetoidId: number, buildingClass: BuildingClass, _orgId: number): EngineResult {

  
  const planetoid = currentState.planetoids.entities[planetoidId];
  if (planetoid === null || planetoid === undefined) {
    return currentState; 
  }
  const system = currentState.systems.entities[planetoid.locationSystemId];
  const ownerId = system.ownerNationId;
  if (ownerId === null || ownerId === undefined) {
    return { 
		newState: currentState,
		events: [],
	}; 
  }
  
  const org = currentState.orgs.entities[ownerId];
  if (org === null || org === undefined) {
    return { 
		newState: currentState,
		events: [],
	}; 
  }
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
  
  const buildEvent = {
	type: 'construction_complete',
	message: `${buildingClass} constructed on ${planetoid.name}`,
	involvedOrgIds: [ownerId],
	isPlayerVisible: ownerId===1, 
	locationId: planetoid.locationSystemId,
  };
  
  return {
	newState: {
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
	},
	events: [buildEvent],
  };
}