import type { GameState } from '../../types/gameState';

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