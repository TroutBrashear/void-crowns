import type { GameState, Fleet, Ship } from '../types/gameState';

export function processTick(currentState: GameState): GameState {
  console.log('tick');



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
    return currentState;
  }

  const newState: GameState = {
    ...currentState, 
    fleets: {
      ...currentState.fleets, 
      entities: {
        ...currentState.fleets.entities, 
        ...updatedFleetEntities,
      },
    },
    ships: {
      ...currentState.ships,
      entities: {
        ...currentState.ships.entities,
        ...updatedShipEntities,
      },
    },
  };

  return newState;
}