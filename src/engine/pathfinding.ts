import type { EntitiesState, System, Lane, GameState } from '../types/gameState';

export function findPath(startingSystemId: number, endingSystemId: number, systems: EntitiesState<System>, lanes: EntitiesState<Lane>): number[] {
	let finalPath: number[] = [];

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


export function reevaluateCurrentPaths(currentState: GameState): GameState {
	let ships = { ...currentState.ships.entities };
	let fleets = { ...currentState.fleets.entities };

	for(const fleetId of currentState.fleets.ids){
		const fleet = fleets[fleetId];
		if(!fleet.movementPath){
			continue;
		}

		for(let i = 0; i < fleet.movementPath.length; i++){
			const system = currentState.systems.entities[fleet.movementPath[i]];
			let prevSystemId: number;
			if(i > 0){
				prevSystemId = fleet.movementPath[i-1];
			}
			else{
				prevSystemId = fleet.locationSystemId;
			}

			const currentLane = system.adjacentLanes.find(laneId => {
				const lane = currentState.lanes.entities[laneId];
				const systemIdA = Math.min(system.id, prevSystemId);
				const systemIdB = Math.max(system.id, prevSystemId);

				if(lane.systemIdA === systemIdA && lane.systemIdB === systemIdB){
					return true;
				}
			});

			if(currentLane){
				const laneEntity = currentState.lanes.entities[currentLane];

				if(laneEntity && laneEntity.status === 'immaterial'){
					fleets[fleetId] = {
						...fleets[fleetId],
						movementPath: findPath(fleet.locationSystemId, fleet.movementPath[fleet.movementPath.length - 1], currentState.systems, currentState.lanes),
					};
					break;
				}
			}
			else{
				fleets[fleetId] = {
					...fleets[fleetId],
					movementPath: [],
				};
				break;
			}
		}
	}

	for(const shipId of currentState.ships.ids){
		const ship = ships[shipId];
		if(!ship.movementPath){
			continue;
		}

		for(let i = 0; i < ship.movementPath.length; i++){
			const system = currentState.systems.entities[ship.movementPath[i]];
			let prevSystemId: number;
			if(i > 0){
				prevSystemId = ship.movementPath[i-1];
			}
			else{
				prevSystemId = ship.locationSystemId;
			}

			const currentLane = system.adjacentLanes.find(laneId => {
				const lane = currentState.lanes.entities[laneId];
				const systemIdA = Math.min(system.id, prevSystemId);
				const systemIdB = Math.max(system.id, prevSystemId);

				if(lane.systemIdA === systemIdA && lane.systemIdB === systemIdB){
					return true;
				}
			});

			if(currentLane){
				const laneEntity = currentState.lanes.entities[currentLane];

				if(laneEntity && laneEntity.status === 'immaterial'){
					ships[shipId] = {
						...ships[shipId],
						movementPath: findPath(ship.locationSystemId, ship.movementPath[ship.movementPath.length - 1], currentState.systems, currentState.lanes),
					};
					break;
				}

			}
			else{
				ships[shipId] = {
					...ships[shipId],
					movementPath: [],
				};
				break;
			}
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
