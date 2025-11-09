import type { System } from '../types/gameState';

//TODO: create additional sizes that can be adaptively chosen based on the number of systems we need to fit
const WIDTH_DEFAULT = 5000;
const HEIGHT_DEFAULT = 1500;


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
			//TODO: establish adjacencies
			adjacentSystems: [],
			ownerNationId: null,

			//TODO: populate with planetoids
			planetoids: [],
		};

		newGalaxy.push(nextSystem);
	}

	return newGalaxy;
}