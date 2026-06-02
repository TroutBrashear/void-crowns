import type { GameState, ColonizePayload, Planetoid } from '../types/gameState';

import { PLANET_ENVIRONMENTS } from '../data/planets';

export function evaluatePlanetoidValue(planetoid: Planetoid): number {

  if(planetoid.classification === 'gravWell'){
    return 0;
  }

  let planetoidValue = 0;

  planetoidValue = PLANET_ENVIRONMENTS[planetoid.environment].defaultValue;

  for(const deposit of planetoid.deposits){
    if(deposit.isVisible){
      planetoidValue += 2;
    }
  }

  planetoidValue = planetoidValue + planetoid.size;

  return planetoidValue;
}

export function evaluateSystemValue(currentState: GameState, systemId: number): number {
  let systemValue = 0;

  const system = currentState.systems.entities[systemId];

  for(const planetoidId of system.planetoids){
    const planetoid = currentState.planetoids.entities[planetoidId];

    if(planetoid){
      systemValue += evaluatePlanetoidValue(planetoid);
    }
  }

  return systemValue;
}

export function colonizePlanetoid(currentState: GameState, payload: ColonizePayload ): GameState {
	const planetoid = currentState.planetoids.entities[payload.planetoidId]; //the target planetoid (will receive population update - for now, an onwed system disables colonization within that system.)
      const ship = currentState.ships.entities[payload.shipId]; //the colony ship will be used up and removed from the game
      const system = currentState.systems.entities[planetoid.locationSystemId]; //we may return the system with a new onwer

      if(!planetoid) {
        return currentState;
      }

      const updatedSystem = {
        ...system,
        ownerNationId: ship.ownerNationId,
      }; 

      const updatedPlanetoid = {
        ...planetoid,
        ownerNationId: ship.ownerNationId,
        population: {
          total: 1,
          progress: 0,
        }
      };

      const shipEntities = { ...currentState.ships.entities };
      const shipIds = [...currentState.ships.ids];
      delete shipEntities[ship.id];
      shipIds.splice(shipIds.indexOf(ship.id), 1);

      return  {
      	...currentState,
        planetoids: {
          ...currentState.planetoids,
          entities: {
            ...currentState.planetoids.entities,
            [payload.planetoidId]: updatedPlanetoid,
          },
        },
        systems: {
          ...currentState.systems,
          entities: {
            ...currentState.systems.entities,
            [planetoid.locationSystemId]: updatedSystem,
          },
        },
        ships: {
          entities: shipEntities,
          ids: shipIds,
        }
      };    
}

export function beginPlanetoidSurvey(currentState: GameState, payload: ColonizePayload ): GameState {

  return {
    ...currentState,
    ships: {
      ...currentState.ships,
      entities: {
        ...currentState.ships.entities,
        [payload.shipId]: {
          ...currentState.ships.entities[payload.shipId],
          assignmentTargetId: payload.planetoidId,
        }
      }
    },
  };
}

export function getHabitablesInSystem(currentState: GameState, systemId: number): Planetoid[] {
    const system = currentState.systems.entities[systemId];
    if(!system) {
      return [];
    }


    return system.planetoids.map(planetoidId => currentState.planetoids.entities[planetoidId]).filter(planetoid => {
      if((planetoid.classification !== 'gravWell' && planetoid.classification !== 'station' && planetoid.classification !== 'asteroid') && (planetoid.environment !== 'barren' && planetoid.environment !== 'molten' && planetoid.environment !== 'gaseous') && planetoid.ownerNationId === null){
        return planetoid;
      }
    });
  }
