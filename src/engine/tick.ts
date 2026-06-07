import type { GameState,  IntelStatus } from '../types/gameState';
import type { Fleet, Ship } from '../types/shipTypes';

import { CYCLE_CONFIG } from '../constants/cycle_config';

function evaluateIntelStatus(currentState: GameState): GameState {
  const newIntelStatus: Record<number, IntelStatus> = {};
  const fleets = Object.values(currentState.fleets.entities);

  const fleetStrength: Record<number, number> = {};

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

  const updatedPlanetoidEntities = { ...currentState.planetoids.entities };
  const planetoidIntel = { ...currentState.intelligence.planetoidIntel };

  for (const shipId of currentState.ships.ids) {
    let updatedShip = { ...currentState.ships.entities[shipId] };
    //is the ship moving?
    if (updatedShip.movementPath.length > 0) {
      hasChanges = true; 

      const newLocationSystemId = updatedShip.movementPath[0];
      
      const newMovementPath = updatedShip.movementPath.slice(1);

      updatedShip = {
        ...updatedShip,
        locationSystemId: newLocationSystemId,
        movementPath: newMovementPath,
      };
    }
    else{ //evaluate certain Ship assignments
      //evaluate an ongoing survey
      if(updatedShip.type === 'survey_ship' && updatedShip.assignmentTargetId && (currentState.meta.turn % CYCLE_CONFIG.SURVEY.SURVEY_INTERVAL) === 0){
        const targetPlanetoid =  updatedPlanetoidEntities[updatedShip.assignmentTargetId];
        if(targetPlanetoid.locationSystemId === updatedShip.locationSystemId){
          hasChanges = true;
          let surveyRoll = Math.random() * 6;

          if(updatedShip.assignedCharacter){
            const techBonus = nextState.orgs.entities[updatedShip.ownerNationId].research.researchBonuses.depositSurvey;
            surveyRoll += ((nextState.characters.entities[updatedShip.assignedCharacter].skills.exploration + nextState.characters.entities[updatedShip.assignedCharacter].skills.academics)/2) + techBonus;

          }

          const depositIndex = targetPlanetoid.deposits.findIndex(deposit => !deposit.isVisible && deposit.difficulty < surveyRoll);

          if(depositIndex !== -1){
            hasChanges = true;
            const newDeposits = [ ...targetPlanetoid.deposits ];
            newDeposits[depositIndex] = {
              ...newDeposits[depositIndex],
              isVisible: true,
            }

            updatedPlanetoidEntities[updatedShip.assignmentTargetId] = {
              ...updatedPlanetoidEntities[updatedShip.assignmentTargetId],
              deposits: newDeposits,
            };

            updatedShip = {
              ...updatedShip,
              contextHistory: {
                ...updatedShip.contextHistory,
                assignmentProgress: 0,
              }
            };
          }
          else{
            updatedShip = {
              ...updatedShip,
              contextHistory: {
                ...updatedShip.contextHistory,
                assignmentProgress: updatedShip.contextHistory.assignmentProgress + 1,
              }
            };

            if(updatedShip.contextHistory.assignmentProgress > 10){
              //enable noProspects
              const orgPlanetoidIntel = [ ...planetoidIntel[updatedShip.ownerNationId].noProspects];
              if(updatedShip.assignmentTargetId !== null){
                orgPlanetoidIntel.push(updatedShip.assignmentTargetId);
              }

              planetoidIntel[updatedShip.ownerNationId] = { ...planetoidIntel[updatedShip.ownerNationId], noProspects: orgPlanetoidIntel};
            }
          }
        }
      }
    }

    updatedShipEntities[shipId] = updatedShip;
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
    },
    intelligence: {
      ...nextState.intelligence,
      planetoidIntel: planetoidIntel,
    }
  };



  return nextState;
}
