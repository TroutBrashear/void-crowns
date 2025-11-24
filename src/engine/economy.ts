import type { GameState } from '../types/gameState';

function calcPopulationGrowth(targetPlanetoid: Planetoid): number {
	//TODO: can add modifiers based on planet environment, owning org, etc.
	let finalGrowth = targetPlanetoid.population * 0.001;
	return finalGrowth;
}

export function processEconomy(currentState: GameState): GameState {
	const newOrgs = { ...currentState.orgs.entities };

  	const newPlanetoidEntities = { ...currentState.planetoids.entities };

	for(const systemId of currentState.systems.ids) {
		const currentSystem = currentState.systems.entities[systemId];
		const systemOwner = currentSystem.ownerNationId;

		if(systemOwner) {
			let systemIncome = 0;

			for(const planetoidId of currentSystem.planetoids){
				let currentPlanetoid = currentState.planetoids.entities[planetoidId];

				if(currentPlanetoid.population > 0)
				{
					systemIncome += Math.ceil(currentPlanetoid.population / 1000000);
					console.log(currentPlanetoid.population);

					//update Planetoid population
					currentPlanetoid.population += calcPopulationGrowth(currentPlanetoid);
					newPlanetoidEntities[currentPlanetoid.id] = currentPlanetoid;
				}
			}

			if(systemIncome > 0){
				const currentOrg = newOrgs[systemOwner];
				newOrgs[systemOwner] = {
					...currentOrg,
					resources: {
						...currentOrg.resources,
						credits: currentOrg.resources.credits + systemIncome,
					}
				};
			}
		}

	}

	return {
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: newOrgs,
		},
		planetoids: {
			...currentState.planetoids,
			entities: newPlanetoidEntities
		}
	};
}