import type { EntitiesState, System } from '../types/gameState';

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
