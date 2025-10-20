import type { System } from '../types/gameState';

export function findPath(startingSystemId: number, endingSystemId: number, systems: EntitiesState<System>): number[] {
	let finalPath: number[] = [];

	//set up for BFS
	const queue: number[] = [];
	const cameFrom: { [key: number]: number | null } = {};
	queue.push(startingSystemId);
	cameFrom[startingSystemId] = null;

	while(queue.length > 0){

		const currentSystemId = queue.shift()!; 
		const currentSystem = systems.entities[currentSystemId];
		if(currentSystemId === endingSystemId){
			break;
		}
		
		for(const adjacentId of currentSystem.adjacentSystemIds){
			if(!(adjacentId in cameFrom)){
				queue.push(adjacentId);
				cameFrom[adjacentId] = currentSystemId;
			}
		}
	}

	if (!(endingSystemId in cameFrom)) {
    	return []; // No path exists
  	}

  	let currentSystemId = endingSystemId;

  	while(currentSystemId !== null){
  		finalPath.push(currentSystemId);
  		currentSystemId = cameFrom[currentSystemId];
  	}

  	finalPath.reverse();

	return finalPath.slice(1);
}