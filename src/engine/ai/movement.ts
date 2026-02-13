import type { GameState } from '../../types/gameState';
import { findPath } from '../pathfinding';
import { getHabitablesInSystem, colonizePlanetoid } from '../colonization';

export function processAiFleetMoves(currentState: GameState, orgId: number): GameState {

	const allFleets = Object.values(currentState.fleets.entities);
	const orgFleets = allFleets.filter(fleet => fleet.ownerNationId === orgId);


	const idleFleets = orgFleets.filter(fleet => fleet.movementPath.length === 0);

	if (idleFleets.length === 0) {
    	return currentState;
  	}

	let atWar = false;
	const thinkingOrg = currentState.orgs.entities[orgId];
	if(thinkingOrg.diplomacy.relations.some(relation => relation.status === 'war')){
		atWar = true;
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
			if(!atWar){
				return system && system.ownerNationId === orgId && !isTargeted;
			}
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
	console.log(hasMadeChanges);

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
	let nextState = currentState;

	let allShips = Object.values(currentState.ships.entities);
	let orgShips = allShips.filter(ship => ship.ownerNationId === orgId);
	let idleShips = orgShips.filter(ship => ship.movementPath.length === 0);


	if (idleShips.length === 0) {
    	return currentState;
  	}

  	const thinkingOrg = currentState.orgs.entities[orgId];
  	let hasMadeChanges = false;

  	//loop for idle ships to take actions if necessary. Right now, this means a colony ship is in a target system and colonizes a world.
  	for(const ship of idleShips) {
  		if(ship.type !== 'colony_ship') {
  			continue;
  		}

  		const locationSystem = nextState.systems.entities[ship.locationSystemId];
  		if(locationSystem.ownerNationId !== null){
  			continue;
  		}

  		const habitableWorlds = getHabitablesInSystem(nextState, locationSystem.id);
  		if(habitableWorlds.length > 0){
  			nextState = colonizePlanetoid(nextState, { shipId: ship.id, planetoidId: habitableWorlds[0].id });
  			hasMadeChanges = true;
  		}
  	}

  	const newShipEntities = { ...nextState.ships.entities };


	allShips = Object.values(nextState.ships.entities);
	orgShips = allShips.filter(ship => ship.ownerNationId === orgId);
	idleShips = orgShips.filter(ship => ship.movementPath.length === 0);

  	for (const ship of idleShips) {
  		const currentSystem = nextState.systems.entities[ship.locationSystemId];
    	if (!currentSystem) {
     		continue;
    	}

		console.log(thinkingOrg.contextHistory.targetSystems);

    	const targetSystemId = thinkingOrg.contextHistory.targetSystems.find(id => {
     		const system = nextState.systems.entities[id];

      		const isTargeted = Object.values(newShipEntities).some(s =>
        		s.movementPath.includes(id) && s.ownerNationId === orgId
      		);
      		return system && system.ownerNationId === null && !isTargeted;
    	});

    	if (targetSystemId) {
      		const newPath = findPath(
        		ship.locationSystemId,
        		targetSystemId,
        		nextState.systems
      		);

      		const updatedShip = {
        		...ship,
      			movementPath: newPath,
      		};

     		newShipEntities[ship.id] = updatedShip;
    		hasMadeChanges = true;
    	}
  	}


	if (hasMadeChanges) {
	   	return {
	      ...nextState,
    	  ships: {
    	    ...nextState.ships,
    	    entities: newShipEntities,
      	  },
    	};
  	}

  	return nextState;
}
