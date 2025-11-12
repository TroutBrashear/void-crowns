import type { System } from '../types/gameState';
import { shuffle } from '../utils/shuffle';


//TODO: create additional sizes that can be adaptively chosen based on the number of systems we need to fit
const WIDTH_DEFAULT = 5000;
const HEIGHT_DEFAULT = 1500;


function calcDistance(systemA: System, systemB: System): number {
  const dx = systemA.position.x - systemB.position.x;
  const dy = systemA.position.y - systemB.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function generateGalaxy (numSystems: number ): System[] {
	let newGalaxy: System[] = [];


	for(let i = 0; i < numSystems; i++){
		const nextSystem: System = {
			id: i + 1,
			//TODO: choose random names from a bank of premade names.
			name:`System ${i+1}`,

			position: {
				x: Math.random() * WIDTH_DEFAULT,
				y: Math.random() * HEIGHT_DEFAULT,
			},

			adjacentSystemIds: [],
			ownerNationId: null,

			//TODO: populate with planetoids
			planetoids: [],
		};

		newGalaxy.push(nextSystem);
	}

	//set initial adjacencies
	for(const focusSystem of newGalaxy) {
		const systemDistances = newGalaxy.filter(system => system.id !== focusSystem.id).map(adjSystem => ({id: adjSystem.id, distance: calcDistance(focusSystem, adjSystem)}));

		let neighbors = systemDistances.filter(sysDis => sysDis.distance < 200);

		neighbors = shuffle(neighbors);

		neighbors = neighbors.slice(0, 2);

		focusSystem.adjacentSystemIds = neighbors.map(nSystem => nSystem.id);
	}

	//make sure adjacencies reciprocate
	for(const focusSystem of newGalaxy) {
		for(const neighborId of focusSystem.adjacentSystemIds) {
			let neighborSystem = newGalaxy.find(system => system.id === neighborId);
			if(neighborSystem && !neighborSystem.adjacentSystemIds.includes(focusSystem.id)) {
				neighborSystem.adjacentSystemIds.push(focusSystem.id);
			}
		}
	}

	return newGalaxy;
}