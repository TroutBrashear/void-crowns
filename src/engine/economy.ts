import type { GameState, Planetoid } from '../types/gameState';
import { BUILDING_CATALOG } from '../data/buildings';

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
			let systemCreditIncome = 0;
			let systemRockIncome = 0;

			if(currentSystem.assignedCharacter){
				let governor = currentState.characters.entities[currentSystem.assignedCharacter];
				if(governor){
					systemCreditIncome += 100 * governor.skills.administration;
				}
			}

			for(const planetoidId of currentSystem.planetoids){
				let currentPlanetoid = { ...currentState.planetoids.entities[planetoidId]};

				//check population for credits income
				if(currentPlanetoid.population > 0){
					systemCreditIncome += Math.ceil(currentPlanetoid.population / 1000000);
					console.log(currentPlanetoid.population);

					//update Planetoid population
					currentPlanetoid.population += calcPopulationGrowth(currentPlanetoid);
					newPlanetoidEntities[currentPlanetoid.id] = currentPlanetoid;
				}
				
				//check buildings for processes
				if(currentPlanetoid.buildings.length > 0){
					for(const building of currentPlanetoid.buildings){
						//processes are in building definition
						const bDefinition = BUILDING_CATALOG[building.type];
						
						if(bDefinition.process.output){
							systemCreditIncome = systemCreditIncome + bDefinition.process.output.credits;
							systemRockIncome = systemRockIncome + bDefinition.process.output.rocks;
						}
						if(bDefinition.process.input){
							systemCreditIncome = systemCreditIncome - bDefinition.process.input.credits;
							systemRockIncome = systemRockIncome - bDefinition.process.input.rocks;
						}
					}
				}
			}

			const currentOrg = newOrgs[systemOwner];
			newOrgs[systemOwner] = {
				...currentOrg,
				resources: {
					...currentOrg.resources,
					credits: currentOrg.resources.credits + systemCreditIncome,
					rocks: currentOrg.resources.rocks + systemRockIncome,
				}
			};
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
