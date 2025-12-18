import type { GameState, ColonizePayload, planetoid } from '../../types/gameState';

export function colonizePlanetoid(currentState: GameState, payload: ColonizePayload ): GameState {

	console.log(payload.planetoidId);

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
        population: 200000,
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

export function getHabitablesInSystem(currentState: GameState, systemId: number): Planetoid[] {
    const system = currentState.systems.entities[systemId];
    console.log(system);
    if(!system) {
      return [];
    }

     if (system.ownerNationId !== null) {
      return [];
    }

    return system.planetoids.map(planetoidId => currentState.planetoids.entities[planetoidId]).filter(planetoid => {
      if(planetoid.environment !== 'Barren'){
        return planetoid;
      }
    });
  }