import type { GameState, Fleet, Ship } from '../types/gameState';



function evaluateIntelStatus(currentState: GameState): GameState {
  let newIntelStatus: Record<number, IntelStatus> = {};
  const fleets = Object.values(currentState.fleets.entities);

  let fleetStrength: Record<number, number> = {};

  for(const orgId of currentState.orgs.ids){
    fleetStrength[orgId] = 0;
  }

  for(const fleet of fleets){
    fleetStrength[fleet.ownerNationId] =  fleetStrength[fleet.ownerNationId] + 1;
  }

  for(const orgId of currentState.orgs.ids){
    newIntelStatus[orgId] = {
      militaryStrength: 20 * fleetStrength[orgId],
      };
  }

  return {
    ...currentState,
    intelligence: {
      ...currentState.intelligence,
      trueStatus: newIntelStatus,
    }
  }
}


export function processTick(currentState: GameState): GameState {
  console.log('tick');

  let nextState =  evaluateIntelStatus(currentState);

  //Process Fleet movements
  const updatedFleetEntities: { [id: number]: Fleet } = {};
  let hasChanges = false;

  for (const fleetId of currentState.fleets.ids) {
    const fleet = currentState.fleets.entities[fleetId];
	console.log(fleet);
    //is the fleet moving?
    if (fleet.movementPath.length > 0) {
      hasChanges = true; 

      const newLocationSystemId = fleet.movementPath[0];
      
      const newMovementPath = fleet.movementPath.slice(1);

      const updatedFleet: Fleet = {
        ...fleet,
        locationSystemId: newLocationSystemId,
        movementPath: newMovementPath,
      };

      updatedFleetEntities[fleetId] = updatedFleet;
    }
  }

  //Process Ship Movements
  const updatedShipEntities: { [id: number]: Ship } = {};

  for (const shipId of currentState.ships.ids) {
    const ship = currentState.ships.entities[shipId];

    //is the ship moving?
    if (ship.movementPath.length > 0) {
      hasChanges = true; 

      const newLocationSystemId = ship.movementPath[0];
      
      const newMovementPath = ship.movementPath.slice(1);

      const updatedShip: Ship = {
        ...ship,
        locationSystemId: newLocationSystemId,
        movementPath: newMovementPath,
      };

      updatedShipEntities[shipId] = updatedShip;
    }
  }

  if (!hasChanges) {
    return nextState;
  }

   nextState = {
    ...nextState,
    fleets: {
      ...nextState.fleets,
      entities: {
        ...nextState.fleets.entities,
        ...updatedFleetEntities,
      },
    },
    ships: {
      ...nextState.ships,
      entities: {
        ...nextState.ships.entities,
        ...updatedShipEntities,
      },
    },
  };



  return nextState;
}
