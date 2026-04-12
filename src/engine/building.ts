import type { GameState, ShipType, MilShipType, Building, BuildingClass, EngineResult, GameEvent, Resources } from '../types/gameState';

import { BUILDING_CATALOG } from '../data/buildings';
import { SHIP_CATALOG } from '../data/ships';
import { NAME_LISTS } from '../data/names';

//global unit costs
const FLEET_COST = 10000;

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
		assignedCharacter: null,
        ships: [],
        contextHistory: {
          previousSystemId: locationId,
        },
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

    let cost: Resources = { credits: 0, rocks: 0, consumerGoods: 0 };

    switch(shipType){
      case 'colony_ship':
        cost = SHIP_CATALOG['colony_ship'].cost;
        break;
      case 'survey_ship':
        cost = SHIP_CATALOG['survey_ship'].cost;
        break;
    }


      //if the org can't afford the fleet, do nothing.
      if(ownerOrg.resources.credits < cost.credits || ownerOrg.resources.rocks < cost.rocks) {
        return currentState; 
      }

      const newShip = {
        id: newId,
        name: "new Ship",
        type: shipType,
        ownerNationId: buildSystem.ownerNationId,
        locationSystemId: locationId,
        movementPath: [],
        assignmentTargetId: null,
        assignedCharacter: null,
        contextHistory: {
          assignmentProgress: 0,
        }
      };

      const updatedOrg = {
        ...ownerOrg,
        resources: {
          ...ownerOrg.resources,
          credits: ownerOrg.resources.credits - cost.credits,
          rocks: ownerOrg.resources.rocks - cost.rocks,
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

export function addShipToFleet(currentState: GameState, fleetId: number, shipId: number): GameState {
  let fleets = { ...currentState.fleets.entities };
  const fleet = fleets[fleetId];
  const ship = currentState.milShips.entities[shipId];

  if(!fleet || !ship || ship.parentFleet === fleetId){
    return currentState;
  }

  let fleetShips = [ ... fleet.ships];

  fleetShips.push(shipId);

  fleets = {
    ...fleets,
    [fleetId]: {
      ...fleets[fleetId],
      ships: fleetShips,
    }
  };

  if(ship.parentFleet){
    const formerFleet = fleets[ship.parentFleet];

    if(formerFleet){
      let formerFleetShips = [...formerFleet.ships];

      formerFleetShips = formerFleetShips.filter(f => f !== shipId);

      fleets = {
        ...fleets,
        [ship.parentFleet]: {
          ...fleets[ship.parentFleet],
          ships: formerFleetShips,
        }
      };
    }
  }

  return {
    ...currentState,
    fleets: fleets,
    milShips: {
      ...currentState.milShips,
      entities: {
        ...currentState.milShips.entities,
        [shipId]: {
          ...currentState.milShips.entities[shipId],
          parentFleet: fleetId,
        }
      }
    }
  }
}

export function engineCreateMilShip(currentState: GameState, orgId: number, shipType: MilShipType): GameState {
  const newId = currentState.meta.lastMilShipId + 1;

  const newShip = {
    id: newId,
    flavor: {
      name: "new Ship",
      traits: [],
      type: shipType,
    },
    stats: {
      size: 1,
      speed: 1,
      strength: 1,
    }
    ownerNationId: orgId,
    parentFleet: null,
    assignedCharacter: null,
    history: {
      events: [],
    }
  };

  return {
    ...currentState,
    milShips: {
      ...currentState.milShips,
      entities: {
        ...currentState.milShips.entities,
        [newId]: newShip,
      },
      ids: [...currentState.milShips.ids, newId],
    },
    meta: {
      ...currentState.meta,
      lastMilShipId: newId,
    },
  };
}

export function engineBuildMilShip(currentState: GameState, orgId: number, locationId: number, shipType: MilShipType): GameState {

  return currentState;
}


export function canBuildBuilding(currentState: GameState, planetoidId: number, buildingClass: BuildingClass, orgId: number){
	const bDefinition = BUILDING_CATALOG[buildingClass];
	const org = currentState.orgs.entities[orgId];
    const planetoid = currentState.planetoids.entities[planetoidId];

	
	if (!org || !planetoid) {
        return false;
    }

    const isSubsidiary = org.parentId;

    if(planetoid.ownerNationId !== org.id){
        if(!isSubsidiary){
          return false;
        }
        else if(isSubsidiary){
          if(planetoid.ownerNationId !== org.parentId){
            return false;
          }
        }
    }


	
	//check cost - can org afford the Building
	if((org.resources.credits < bDefinition.cost.credits || org.resources.rocks < bDefinition.cost.rocks)){
		return false;
	}
	
	return true; 
}

export function engineBuildBuilding(currentState: GameState, planetoidId: number, buildingClass: BuildingClass, _orgId: number): EngineResult {

  
  const planetoid = currentState.planetoids.entities[planetoidId];
  if (planetoid === null || planetoid === undefined) {
    return { 
		newState: currentState,
		events: [],
	};  
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
    ownerNationId: ownerId,
    locationId:planetoidId,

    assignedCharacter: null,

    research: {
      progress: 0,
      project: null,
    }
  };
  
  const updatedPlanetoid = {
    ...planetoid,
    buildings: [...planetoid.buildings, newId]
  };
  
  const updatedOrg = {
    ...org,
    resources: {
      credits: org.resources.credits - bDefinition.cost.credits,
      rocks: org.resources.rocks - bDefinition.cost.rocks,
      consumerGoods: org.resources.consumerGoods - bDefinition.cost.consumerGoods,
    }
  };
  
  const buildEvent: GameEvent = {
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
        buildings: {
          ...currentState.buildings,
          ids: [ ...currentState.buildings.ids, newId],
          entities: {
            ...currentState.buildings.entities,
            [newId]: newBuilding,
          }
        }
	},
	events: [buildEvent],
  };
}
