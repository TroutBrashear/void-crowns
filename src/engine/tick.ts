import type { GameState, Fleet, Ship, IntelStatus } from '../types/gameState';



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

  let updatedPlanetoidEntities = { ...currentState.planetoids.entities };

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
    else{ //evaluate certain Ship assignments
      //evaluate an ongoing survey
      if(ship.type === 'survey_ship' && ship.assignmentTargetId && (currentState.meta.turn % 20) === 0){
        let targetPlanetoid =  updatedPlanetoidEntities[ship.assignmentTargetId];
        if(targetPlanetoid.locationSystemId === ship.locationSystemId){

          const surveyRoll = Math.random() * 6;

          const depositIndex = targetPlanetoid.deposits.findIndex(deposit => !deposit.isVisible && deposit.difficulty < surveyRoll);

          if(depositIndex !== -1){
            hasChanges = true;
            let newDeposits = [ ...targetPlanetoid.deposits ];
            newDeposits[depositIndex] = {
              ...newDeposits[depositIndex],
              isVisible: true,
            }

            updatedPlanetoidEntities[ship.assignmentTargetId] = {
              ...updatedPlanetoidEntities[ship.assignmentTargetId],
              deposits: newDeposits,
            };
          }
        }
      }
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
    planetoids: {
      ...nextState.planetoids,
      entities: updatedPlanetoidEntities,
    }
  };



  return nextState;
}
