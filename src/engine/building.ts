import type { GameState, Building, BuildingClass, EngineResult, GameEvent } from '../types/gameState';
import type {  PlanetoidClassification, Lane, Planetoid } from '../types/geoState';

import { BUILDING_CATALOG } from '../data/buildings';

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
	if((org.resources.credits < (bDefinition.cost?.credits ?? 0) || org.resources.rocks < (bDefinition.cost?.rocks ?? 0 ))) {
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
    tags: bDefinition.tags,
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
      credits: org.resources.credits - (bDefinition.cost?.credits ?? 0),
      rocks: org.resources.rocks - (bDefinition.cost?.rocks ?? 0),
      gas: org.resources.gas - (bDefinition.cost?.gas ?? 0),
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

export function engineBuildPlanetoid(currentState: GameState, orgId: number, parentPlanetoidId: number, newType: PlanetoidClassification): GameState {
  const org = currentState.orgs.entities[orgId];

  //cost check
  if(org.resources.credits < 20000){
    return currentState;
  }

  const newId = currentState.meta.lastPlanetoidId + 1;
  const parentPlanetoid = currentState.planetoids.entities[parentPlanetoidId];

  const newPlanetoid = {
    id: newId,
    name: `${parentPlanetoid.name} 1`, //TODO
    parentPlanetoidId: parentPlanetoidId,
    locationSystemId: parentPlanetoid.locationSystemId,
    classification: newType,
    environment: 'construct', //TODO
    ownerNationId: orgId,
    size: 1,
    buildings: [],
    tags: [],
    deposits: [],
    resources: {}
  }

  const newOrg = {
    ...org,
    resources: {
      ...org.resources,
      credits: org.resources.credits - 20000,
    }
  };

  return {
    ...currentState,
    meta: {
      ...currentState.meta,
      lastPlanetoidId: newId,
    },
    planetoids: {
      ...currentState.planetoids,
      ids: [ ...currentState.planetoids.ids, newId],
      entities: {
        ...currentState.planetoids.entities,
        [newId]: newPlanetoid,
      }
    },
    systems: {
      ...currentState.systems,
      entities: {
        ...currentState.systems.entities,
        [parentPlanetoid.locationSystemId]: {
          ...currentState.systems.entities[parentPlanetoid.locationSystemId],
          planetoids: [...currentState.systems.entities[parentPlanetoid.locationSystemId].planetoids, newId],
        }
      }
    },
    orgs: {
      ...currentState.orgs,
      entities: {
        ...currentState.orgs.entities,
        [orgId]: newOrg,
      }
    }
  };
}


export function engineBuildAnchor(currentState: GameState, orgId: number, parentPlanetoidId: number, laneTargetId: number): GameState {
  const org = currentState.orgs.entities[orgId];
  const lane = currentState.lanes.entities[laneTargetId];
  if(!org || !lane){
    return currentState;
  }

  //cost check - these are seperate checks because I will probably want to return a GameEvent at some point
  if(org.resources.credits < 20000){
    return currentState;
  }

  const newId = currentState.meta.lastPlanetoidId + 1;
  const parentPlanetoid = currentState.planetoids.entities[parentPlanetoidId];

  const newPlanetoid: Planetoid = {
    id: newId,
    name: `${parentPlanetoid.name} Anchor ${newId}`, //TODO
    parentPlanetoidId: parentPlanetoidId,
    locationSystemId: parentPlanetoid.locationSystemId,
    classification: 'anchor',
    environment: 'construct-utility', //TODO
    ownerNationId: orgId,
    size: 1,
    buildings: [],
    tags: [],
    deposits: [],
    resources: {},
    construct: {
      anchorTarget: laneTargetId
    }
  }

  const newOrg = {
    ...org,
    resources: {
      ...org.resources,
      credits: org.resources.credits - 20000,
    }
  };

  const newLane: Lane = {
    ...lane,
    status: 'anchored',
  };


  return {
    ...currentState,
    meta: {
      ...currentState.meta,
      lastPlanetoidId: newId,
    },
    planetoids: {
      ...currentState.planetoids,
      ids: [ ...currentState.planetoids.ids, newId],
      entities: {
        ...currentState.planetoids.entities,
        [newId]: newPlanetoid,
      }
    },
    systems: {
      ...currentState.systems,
      entities: {
        ...currentState.systems.entities,
        [parentPlanetoid.locationSystemId]: {
          ...currentState.systems.entities[parentPlanetoid.locationSystemId],
          planetoids: [...currentState.systems.entities[parentPlanetoid.locationSystemId].planetoids, newId],
        }
      }
    },
    orgs: {
      ...currentState.orgs,
      entities: {
        ...currentState.orgs.entities,
        [orgId]: newOrg,
      }
    },
    lanes: {
      ...currentState.lanes,
      entities: {
        ...currentState.lanes.entities,
        [laneTargetId]: newLane,
      }
    }
  };
}
