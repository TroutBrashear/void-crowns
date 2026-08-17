import type { EntitiesState, GameState } from '../types/gameState';
import type { System, Lane } from '../types/geoState';
import type { Fleet, Ship } from '../types/shipTypes';

export function findPath(startingSystemId: number, endingSystemId: number, systems: EntitiesState<System>, lanes: EntitiesState<Lane>): number[] {
	const finalPath: number[] = [];

	//set up for BFS
	const queue: number[] = [];
	const cameFrom: { [key: number]: number | null } = {};
	queue.push(startingSystemId);
	cameFrom[startingSystemId] = null;

	while(queue.length > 0){

		const currentSystemId = queue.shift()!;
		const currentSystem = systems.entities[currentSystemId];
		if (!currentSystem) continue;
		if(currentSystemId === endingSystemId){
			break;
		}
		
		for(const adjacentId of currentSystem.adjacentLanes){
			const currentLane = lanes.entities[adjacentId];
			if(currentLane.status !== 'immaterial'){

				const neighborId = currentLane.systemIdA === currentSystemId ? currentLane.systemIdB : currentLane.systemIdA;

				if(!(neighborId in cameFrom)){
					queue.push(neighborId);
					cameFrom[neighborId] = currentSystemId;
				}
			}
		}
	}

	if (!(endingSystemId in cameFrom)) {
    	return []; // No path exists
  	}

  	let current: number | null = endingSystemId;
	while (current !== null) {
  		finalPath.push(current);
  		current = cameFrom[current];
	}

  	finalPath.reverse();

	return finalPath.slice(1);
}

function checkPath(currentState: GameState, pathingEntity: (Ship | Fleet)): number[] {
	if(!pathingEntity.movementPath){
		return [];
	}

	for(let i = 0; i < pathingEntity.movementPath.length; i++){
		const system = currentState.systems.entities[pathingEntity.movementPath[i]];

		if(!system){
			return [];
		}

		let prevSystemId: number;
		if(i > 0){
			prevSystemId = pathingEntity.movementPath[i-1];
		}
		else{
			prevSystemId = pathingEntity.locationSystemId;
		}

		const currentLane = system.adjacentLanes.find(laneId => {
			const lane = currentState.lanes.entities[laneId];
			const systemIdA = Math.min(system.id, prevSystemId);
			const systemIdB = Math.max(system.id, prevSystemId);
			if(!lane){
				return false;
			}

			if(lane.systemIdA === systemIdA && lane.systemIdB === systemIdB){
				return true;
			}
		});

		if(currentLane){
			const laneEntity = currentState.lanes.entities[currentLane];

			if(laneEntity && laneEntity.status === 'immaterial'){
				return findPath(pathingEntity.locationSystemId, pathingEntity.movementPath[pathingEntity.movementPath.length - 1], currentState.systems, currentState.lanes);
			}
		}
		else{
			return [];
		}
	}

	return pathingEntity.movementPath;
}


export function reevaluateCurrentPaths(currentState: GameState): GameState {
	const ships = { ...currentState.ships.entities };
	const fleets = { ...currentState.fleets.entities };

	for(const fleetId of currentState.fleets.ids){
		const fleet = fleets[fleetId];
		fleets[fleetId] = {
			...fleets[fleetId],
			movementPath: checkPath(currentState, fleet),
		}
	}

	for(const shipId of currentState.ships.ids){
		const ship = ships[shipId];
		ships[shipId] = {
			...ships[shipId],
			movementPath: checkPath(currentState, ship)
		}
	}

	return {
		...currentState,
		ships: {
			...currentState.ships,
			entities: ships,
		},
		fleets: {
			...currentState.fleets,
			entities: fleets,
		},
	}
}
