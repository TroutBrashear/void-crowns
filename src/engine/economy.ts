import type { GameState, Planetoid, Resources } from '../types/gameState';
import { BUILDING_CATALOG } from '../data/buildings';

function calcPopulationGrowth(targetPlanetoid: Planetoid): number {
	//TODO: can add modifiers based on planet environment, owning org, etc.
	let finalGrowth = targetPlanetoid.population * 0.001;
	return finalGrowth;
}

export function processEconomy(currentState: GameState): GameState {
	const newOrgs = { ...currentState.orgs.entities };

  	const newPlanetoidEntities = { ...currentState.planetoids.entities };

	const roundIncome: Record<number, Resources> = {}; //number is an orgId


	for(const systemId of currentState.systems.ids) {
		const currentSystem = currentState.systems.entities[systemId];
		const systemOwner = currentSystem.ownerNationId;

		if(systemOwner){
			if(!roundIncome[systemOwner]){
				roundIncome[systemOwner] = {
					credits: 0,
					rocks: 0,
				};
			}

			if(currentSystem.assignedCharacter){
				let governor = currentState.characters.entities[currentSystem.assignedCharacter];
				if(governor){
					roundIncome[systemOwner].credits += 100 * governor.skills.administration;
				}
			}
		}



		for(const planetoidId of currentSystem.planetoids){
			let currentPlanetoid = { ...currentState.planetoids.entities[planetoidId]};
			let planetoidOwner = currentPlanetoid.ownerNationId;

			if(planetoidOwner){
				if(!roundIncome[planetoidOwner]){
					roundIncome[planetoidOwner] = {
						credits: 0,
						rocks: 0,
					};
				}

				//check population for credits income
				if(currentPlanetoid.population > 0){
					roundIncome[planetoidOwner].credits += Math.ceil(currentPlanetoid.population / 1000000);

					//update Planetoid population
					currentPlanetoid.population += calcPopulationGrowth(currentPlanetoid);
					newPlanetoidEntities[currentPlanetoid.id] = currentPlanetoid;
				}
			}

			//check buildings for processes
			if(currentPlanetoid.buildings.length > 0){
				for(const building of currentPlanetoid.buildings){
					//processes are in building definition
					const bDefinition = BUILDING_CATALOG[building.type];
					const buildingOwner = building.ownerNationId;

					if(!roundIncome[buildingOwner]){
						roundIncome[buildingOwner] = {
							credits: 0,
							rocks: 0,
						};
					}

					//processes now have Partial<Resources>, so any of these may be undefined
					//output processing
					roundIncome[buildingOwner].credits += bDefinition.process.output?.credits ?? 0;
					roundIncome[buildingOwner].rocks += bDefinition.process.output?.rocks ?? 0;

					//input processing
					roundIncome[buildingOwner].credits -= bDefinition.process.input?.credits ?? 0;
					roundIncome[buildingOwner].rocks -= bDefinition.process.input?.rocks ?? 0;
				}
			}
		}
	}

	const orgArray = Object.entries(roundIncome);

	for(const [id, income] of orgArray){
		newOrgs[id] = {
			...newOrgs[id],
			resources: {
				...newOrgs[id].resources,
				credits: newOrgs[id].resources.credits + income.credits,
				rocks: newOrgs[id].resources.rocks + income.rocks,
			}
		};
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
