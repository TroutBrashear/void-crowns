import type { GameState } from '../types/gameState';

export function processEconomy(currentState: GameState): GameState {
	const newOrgs = { ...currentState.orgs.entities };

	for(const systemId of currentState.systems.ids) {
		const currentSystem = currentState.systems.entities[systemId];
		const systemOwner = currentSystem.ownerNationId;

		if(systemOwner) {
			let systemIncome = 0;

			for(const planetoidId of currentSystem.planetoids){
				const currentPlanetoid = currentState.planetoids.entities[planetoidId];

				if(currentPlanetoid.population > 0)
				{
					systemIncome += Math.ceil(currentPlanetoid.population / 1000000);
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
	};
}