import type { GameState, Planetoid, Resources } from '../types/gameState';
import { BUILDING_CATALOG } from '../data/buildings';
import { RESEARCH_CATALOG } from '../data/research';
import type { ResearchDefinition } from '../data/research';

//------RESARCH FUNCTIONS------

export function getAllResearchOptions(currentState: GameState, orgId: number): string[] {

	const org = currentState.orgs.entities[orgId];

	const allResearch = (Object.values(RESEARCH_CATALOG) as ResearchDefinition[]);

	let filteredOptions = allResearch.filter(researchItem => {
		if(org.research.researched.includes(researchItem.researchId)){
			return false;
		}

		for(const prereq of researchItem.prerequisites){
			if(!org.research.researched.includes(prereq)){
				return false;
			}
		}

		return true;
	});


	return filteredOptions.map(researchItem => researchItem.researchId);
}

export function engineAssignResearch(currentState: GameState, buildingId: number, researchId: string): GameState {

	return{
		...currentState,
		buildings: {
			...currentState.buildings,
			entities: {
				...currentState.buildings.entities,
				[buildingId]: {
					...currentState.buildings.entities[buildingId],
					research: {
						...currentState.buildings.entities[buildingId].research,
						progress: 0,
						project: researchId,
					}
				}
			}
		},
	};
}

function calcPopulationGrowth(targetPlanetoid: Planetoid): number {
	//TODO: can add modifiers based on planet environment, owning org, etc.
	let finalGrowth = targetPlanetoid.population * 0.001;
	return finalGrowth;
}

export function processEconomy(currentState: GameState): GameState {
	let newOrgs = { ...currentState.orgs.entities };
	let newBuildings = { ...currentState.buildings.entities };
  	let newPlanetoidEntities = { ...currentState.planetoids.entities };

	const roundIncome: Record<number, Resources> = {}; //number is an orgId

	const completedResearch: { orgId: number, researchId: string }[] = [];

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
			let planetoidDeposits = [...currentPlanetoid.deposits];

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

				}
			}

			//check buildings for processes
			if(currentPlanetoid.buildings.length > 0){
				for(const buildingId of currentPlanetoid.buildings){
					let building = { ...currentState.buildings.entities[buildingId]};
					//processes are in building definition
					const bDefinition = BUILDING_CATALOG[building.type];
					const buildingOwner = building.ownerNationId;

					//-------RESEARCH-----------
					if(building.type === 'researchLab'){
						//assigned character is REQUIRED to progress research
						if(building.assignedCharacter && building.research.project){
							const character = currentState.characters.entities[building.assignedCharacter];
							if(character){
								let researchRoll = building.research.progress + (10 + character.skills.academics);

								const researchProject = RESEARCH_CATALOG[building.research.project];


								//is the project complete?
								if(researchRoll > researchProject.cost){
									//TODO: swap processEconomy to return an EngineResult so we can inform player of completion!
									let orgResearches = [ ... newOrgs[building.ownerNationId].research.researched ];
									orgResearches.push(building.research.project);
									newOrgs[building.ownerNationId] = {
										...newOrgs[building.ownerNationId],
										research: {
											...newOrgs[building.ownerNationId].research,
											researched: orgResearches,
										}
									};
									newBuildings[buildingId] = {
										...newBuildings[buildingId],
										research: {
											...newBuildings[buildingId].research,
											project: null,
											progress: 0,
										}
									}

									completedResearch.push({ orgId: building.ownerNationId, researchId: building.research.project});
								}
								else{
									newBuildings[buildingId] = {
										...newBuildings[buildingId],
										research: {
											...newBuildings[buildingId].research,
											progress: researchRoll,
										}
									};
								}
							}
						}
					}


					//-------INCOME-----------
					if(!roundIncome[buildingOwner]){
						roundIncome[buildingOwner] = {
							credits: 0,
							rocks: 0,
						};
					}

					//processes now have Partial<Resources>, so any of these may be undefined
					//output processing
					roundIncome[buildingOwner].credits += bDefinition.process.output?.credits ?? 0;
					if(bDefinition.process.output?.rocks){
						let depositIndex = planetoidDeposits.findIndex(deposit => deposit.isVisible && deposit.type === 'rocks' && deposit.amount > 0);

						if(planetoidDeposits[depositIndex]){
							let extractionAmount = Math.min(bDefinition.process.output.rocks, planetoidDeposits[depositIndex].amount);
							roundIncome[buildingOwner].rocks += extractionAmount;
							planetoidDeposits[depositIndex] = {
								...planetoidDeposits[depositIndex],
								amount: planetoidDeposits[depositIndex].amount - extractionAmount
							};
						}

					}


					//input processing
					roundIncome[buildingOwner].credits -= bDefinition.process.input?.credits ?? 0;
					roundIncome[buildingOwner].rocks -= bDefinition.process.input?.rocks ?? 0;
				}
			}

			currentPlanetoid.deposits = planetoidDeposits;
			newPlanetoidEntities[currentPlanetoid.id] = currentPlanetoid;
		}
	}

	const orgArray = Object.entries(roundIncome);
	for(const [id, income] of orgArray){
		const orgId = Number(id);

		newOrgs[orgId] = {
			...newOrgs[orgId],
			resources: {
				...newOrgs[orgId].resources,
				credits: newOrgs[orgId].resources.credits + income.credits,
				rocks: newOrgs[orgId].resources.rocks + income.rocks,
			}
		};
	}


	let nextState = {
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: newOrgs,
		},
		planetoids: {
			...currentState.planetoids,
			entities: newPlanetoidEntities,
		},
		buildings: {
			...currentState.buildings,
			entities: newBuildings,
		}
	};

	//resolve research effects
	for(const resObj of completedResearch){
		let research = RESEARCH_CATALOG[resObj.researchId];

		nextState = research.onComplete(nextState, resObj.orgId);
	}

	return nextState;
}
