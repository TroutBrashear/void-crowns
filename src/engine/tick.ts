import type { GameState, Fleet } from '../types/gameState';

export function processTick(currentState: GameState): GameState {
  console.log('tick');

  const updatedFleetEntities: { [id: number]: Fleet } = {};
  let hasChanges = false;

  for (const fleetId of currentState.fleets.ids) {
    const fleet = currentState.fleets.entities[fleetId];

    // The core real-time logic: does the fleet have a destination?
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
  };

  return newState;
}