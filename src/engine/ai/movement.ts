import type { GameState } from '../../types/gameState';
import { findPath } from '../pathfinding';

export function processAiFleetMoves(currentState: GameState, orgId: number): GameState {
	
	const allFleets = Object.values(currentState.fleets.entities);
	const orgFleets = allFleets.filter(fleet => fleet.ownerNationId === orgId);


	const idleFleets = orgFleets.filter(fleet => fleet.movementPath.length === 0);

	if (idleFleets.length === 0) {
    	return currentState;
  	}

  	const newFleetEntities = { ...currentState.fleets.entities };
  	let hasMadeChanges = false;

  	for (const fleet of idleFleets) {
  		const currentSystem = currentState.systems.entities[fleet.locationSystemId];
    	if (!currentSystem) {
     		continue;
    	}

    	const targetSystemId = currentSystem.adjacentSystemIds.find(id => {
     		const system = currentState.systems.entities[id];
      		const isTargeted = Object.values(newFleetEntities).some(f => 
        		f.movementPath.includes(id) && f.ownerNationId === orgId
      		);
      		return system && system.ownerNationId === null && !isTargeted;
    	});

    	if (targetSystemId) {
      		const newPath = findPath(
        		fleet.locationSystemId,
        		targetSystemId,
        		currentState.systems
      		);

      		const updatedFleet = {
        		...fleet,
      			movementPath: newPath,
      		};
      
     		newFleetEntities[fleet.id] = updatedFleet;
    		hasMadeChanges = true;
    	}
  	}

	if (hasMadeChanges) {
	   	return {
	      ...currentState,
    	  fleets: {
    	    ...currentState.fleets,
    	    entities: newFleetEntities, 
      	  },
    	};
  	}

  	return currentState;
}

export function processAiShipMoves(currentState: GameState, orgId: number): GameState {
	const allShips = Object.values(currentState.ships.entities);
	const orgShips = allShips.filter(ship => ship.ownerNationId === orgId);

	const idleShips = orgShips.filter(ship => ship.movementPath.length === 0);

	if (idleShips.length === 0) {
    	return currentState;
  	}

	const newShipEntities = { ...currentState.ships.entities };
  	let hasMadeChanges = false;

  	for (const ship of idleShips) {
  		const currentSystem = currentState.systems.entities[ship.locationSystemId];
    	if (!currentSystem) {
     		continue;
    	}

    	const targetSystemId = currentSystem.adjacentSystemIds.find(id => {
     		const system = currentState.systems.entities[id];
      		const isTargeted = Object.values(newShipEntities).some(s => 
        		s.movementPath.includes(id) && s.ownerNationId === orgId
      		);
      		return system && system.ownerNationId === null && !isTargeted;
    	});

    	if (targetSystemId) {
      		const newPath = findPath(
        		ship.locationSystemId,
        		targetSystemId,
        		currentState.systems
      		);

      		const updatedShip = {
        		...ship,
      			movementPath: newPath,
      		};
      
     		newShipEntities[ship.id] = updatedShip;
    		hasMadeChanges = true;
    	}
  	}
}