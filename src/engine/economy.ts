import type { GameState, Resources, Process, GameEvent, EngineResult, Character, Pop } from '../types/gameState';
import { BUILDING_CATALOG } from '../data/buildings';
import { RESEARCH_CATALOG } from '../data/research';
import type { ResearchDefinition } from '../data/research';
import { generateCharacter } from './character';
import { popIncreaseSpeciesRoll } from './population';

import { CYCLE_CONFIG } from '../constants/cycle_config';
import { PLANET_ENVIRONMENTS } from '../data/planets';

//------RESARCH FUNCTIONS------

export function getAllResearchOptions(currentState: GameState, orgId: number): string[] {

	const org = currentState.orgs.entities[orgId];

	const allResearch = (Object.values(RESEARCH_CATALOG) as ResearchDefinition[]);

	const filteredOptions = allResearch.filter(researchItem => {
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

export function evaluateAcademySpawnChance(currentState: GameState, buildingId: number): boolean {
	const building = currentState.buildings.entities[buildingId];
	const org = currentState.orgs.entities[building.ownerNationId];

	let baseChance = 1 + org.characters.characterPool.length;

	if(building.assignedCharacter){
		const char = currentState.characters.entities[building.assignedCharacter];
		baseChance = baseChance - char.skills.administration;

	}

	if(baseChance < CYCLE_CONFIG.CHARACTER.ACADEMY_SPAWN_FLOOR){
		baseChance = CYCLE_CONFIG.CHARACTER.ACADEMY_SPAWN_FLOOR;
	}

	if((Math.random() * baseChance) < CYCLE_CONFIG.CHARACTER.ACADEMY_SPAWN_CHANCE){
		return true;
	}

	return false;
}

export function spawnAcademyCharacter(currentState: GameState, buildingId: number, nextId: number): Character {
	const building = currentState.buildings.entities[buildingId];
	const org = currentState.orgs.entities[building.ownerNationId];

	let newCharacter = generateCharacter(nextId, org.flavor.nameList);

	switch (building.type){
		case "navalAcademy":
			newCharacter = {
				...newCharacter,
				citizenOrg: building.ownerNationId,
				skills: {
					...newCharacter.skills,
					navalCombat: newCharacter.skills.navalCombat + 2
				}
			}
			break;
		case "scienceAcademy":
			newCharacter = {
				...newCharacter,
				citizenOrg: building.ownerNationId,
				skills: {
					...newCharacter.skills,
					navalCombat: newCharacter.skills.academics + 2
				}
			}
			break;
	}

	return newCharacter;
}


export function applyProcess(currentState: GameState, process: Process, targetOrg: number): GameState {
	const target = currentState.orgs.entities[targetOrg];
	if(!target){
		return currentState;
	}
	const processResult = {
			credits: target.resources.credits,
			rocks: target.resources.rocks,
			consumerGoods: target.resources.consumerGoods,
			gas: target.resources.gas,
			food: target.resources.food,
	};


	if(process.input){
		processResult.credits -= process.input?.credits ?? 0;
		processResult.rocks -= process.input?.rocks ?? 0;
		processResult.consumerGoods -= process.input?.consumerGoods ?? 0;
		processResult.gas -= process.input?.gas ?? 0;
		processResult.food -= process.input?.food ?? 0;
	}

	if(process.output){
		processResult.credits += process.output?.credits ?? 0;
		processResult.rocks += process.output?.rocks ?? 0;
		processResult.consumerGoods += process.output?.consumerGoods ?? 0;
		processResult.gas += process.input?.gas ?? 0;
		processResult.food += process.input?.food ?? 0;
	}


	return{
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: {
				...currentState.orgs.entities,
				[targetOrg]: {
					...currentState.orgs.entities[targetOrg],
					resources: {
						credits: processResult.credits,
						rocks: processResult.rocks,
						consumerGoods: processResult.consumerGoods,
						gas: processResult.gas,
						food: processResult.food
					},
				},
			},
		},
	};
}


export function processEconomy(currentState: GameState): EngineResult {
	const newOrgs = { ...currentState.orgs.entities };
	const newBuildings = { ...currentState.buildings.entities };
  	const newPlanetoidEntities = { ...currentState.planetoids.entities };

	let lastPopId = currentState.meta.lastPopId;
	let newPops = { ...currentState.pops.entities };
	let newPopIds = [ ...currentState.pops.ids ];

	const roundIncome: Record<number, Resources> = {}; //number is an orgId

	const completedResearch: { orgId: number, researchId: string, labLocationId: number }[] = [];
	const spawnedCharacters: number[] = [];

	for(const systemId of currentState.systems.ids) {
		const currentSystem = currentState.systems.entities[systemId];
		const systemOwner = currentSystem.ownerNationId;

		if(systemOwner){
			if(!roundIncome[systemOwner]){
				roundIncome[systemOwner] = {
					credits: 0,
					rocks: 0,
					consumerGoods: 0,
					gas: 0,
					food: 0
				};
			}

			if(currentSystem.assignedCharacter){
				const governor = currentState.characters.entities[currentSystem.assignedCharacter];
				if(governor){
					roundIncome[systemOwner].credits += CYCLE_CONFIG.ECONOMY.GOVERNOR_TAX_BONUS * governor.skills.administration;
				}
			}
		}

		for(const planetoidId of currentSystem.planetoids){
			let currentPlanetoid = { ...currentState.planetoids.entities[planetoidId]};
			const planetoidOwner = currentPlanetoid.ownerNationId;
			const planetoidDeposits = [...currentPlanetoid.deposits];

			if(planetoidOwner){
				if(!roundIncome[planetoidOwner]){
					roundIncome[planetoidOwner] = {
						credits: 0,
						rocks: 0,
						consumerGoods: 0,
						gas: 0,
						food: 0
					};
				}



				//population calculations
				if(currentPlanetoid.population){
					//check population for credits income
					if(currentPlanetoid.ownerNationId){
						roundIncome[planetoidOwner].credits += CYCLE_CONFIG.ECONOMY.DEFAULT_POP_TAX  * currentPlanetoid.population.total;
					}

					const popProgress = currentPlanetoid.population.progress + 1 * PLANET_ENVIRONMENTS[currentPlanetoid.environment].popGrowthModifier;

					//trigger new Pop if needed
					if(popProgress > CYCLE_CONFIG.ECONOMY.POP_PROGRESS_GOAL){
						let  speciesRoll = popIncreaseSpeciesRoll(currentState, currentPlanetoid.id);

						if(speciesRoll){
							const newPop: Pop = {
								id: lastPopId++,
								species: speciesRoll,
								locationId: currentPlanetoid.id
							}

							newPops[newPop.id] = newPop;
							newPopIds.push(newPop.id);
							currentPlanetoid.population = {
								total: currentPlanetoid.population.total + 1,
								progress: 0
							}
						}
					}
				}

			}

			//check buildings for processes
			if(currentPlanetoid.buildings.length > 0){
				for(const buildingId of currentPlanetoid.buildings){
					const building = { ...currentState.buildings.entities[buildingId]};
					//processes are in building definition
					const bDefinition = BUILDING_CATALOG[building.type];
					const buildingOwner = building.ownerNationId;

					//-------RESEARCH-----------
					if(building.type === 'researchLab'){
						//assigned character is REQUIRED to progress research
						if(building.assignedCharacter && building.research.project){
							const character = currentState.characters.entities[building.assignedCharacter];
							if(character){
								const researchRoll = building.research.progress + (10 + character.skills.academics);

								const researchProject = RESEARCH_CATALOG[building.research.project];

								//is the project complete?
								if(researchRoll > researchProject.cost){
									const orgResearches = [ ... newOrgs[building.ownerNationId].research.researched ];
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

									completedResearch.push({ orgId: building.ownerNationId, researchId: building.research.project, labLocationId: building.locationId});
								}
								else{
									console.log(researchRoll);
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

					//--------ACADEMY-----------
					if(bDefinition.tags.includes("academy")){
						const spawnRoll = evaluateAcademySpawnChance(currentState, buildingId);
						if(spawnRoll){
							spawnedCharacters.push(buildingId);
						}
					}

					//-------INCOME-----------
					if(!roundIncome[buildingOwner]){
						roundIncome[buildingOwner] = {
							credits: 0,
							rocks: 0,
							consumerGoods: 0,
							gas: 0,
							food: 0
						};
					}

					//processes now have Partial<Resources>, so any of these may be undefined
					//input processing

					if(newOrgs[buildingOwner].resources.credits >= (bDefinition.process.input?.credits ?? 0) && newOrgs[buildingOwner].resources.rocks >= (bDefinition.process.input?.rocks ?? 0 ) && newOrgs[buildingOwner].resources.consumerGoods >= (bDefinition.process.input?.consumerGoods ?? 0)){
						roundIncome[buildingOwner].credits -= bDefinition.process.input?.credits ?? 0;
						roundIncome[buildingOwner].rocks -= bDefinition.process.input?.rocks ?? 0;
						roundIncome[buildingOwner].consumerGoods -= bDefinition.process.input?.consumerGoods ?? 0;
						roundIncome[buildingOwner].gas -= bDefinition.process.input?.gas ?? 0;
						roundIncome[buildingOwner].food -= bDefinition.process.input?.food ?? 0;
					}
					else{
						continue;
					}

					//output processing
					roundIncome[buildingOwner].credits += bDefinition.process.output?.credits ?? 0;
					if(bDefinition.process.output?.rocks){
						const depositIndex = planetoidDeposits.findIndex(deposit => deposit.isVisible && deposit.type === 'rocks' && deposit.amount > 0);

						if(planetoidDeposits[depositIndex]){
							const extractionAmount = Math.min(bDefinition.process.output.rocks, planetoidDeposits[depositIndex].amount);
							roundIncome[buildingOwner].rocks += extractionAmount;
							planetoidDeposits[depositIndex] = {
								...planetoidDeposits[depositIndex],
								amount: planetoidDeposits[depositIndex].amount - extractionAmount
							};
						}
					}
					if(bDefinition.process.output?.gas){
						const depositIndex = planetoidDeposits.findIndex(deposit => deposit.isVisible && deposit.type === 'gas' && deposit.amount > 0);

						if(planetoidDeposits[depositIndex]){
							const extractionAmount = Math.min(bDefinition.process.output.gas, planetoidDeposits[depositIndex].amount);
							roundIncome[buildingOwner].gas += extractionAmount;
							planetoidDeposits[depositIndex] = {
								...planetoidDeposits[depositIndex],
								amount: planetoidDeposits[depositIndex].amount - extractionAmount
							};
						}
					}

					roundIncome[buildingOwner].consumerGoods += bDefinition.process.output?.consumerGoods ?? 0;
					roundIncome[buildingOwner].food += bDefinition.process.output?.food ?? 0;

					//goods output
					if(bDefinition.process.goodsOutput && currentPlanetoid.resources.goodsStockpiles){
						let stockpile = { ...currentPlanetoid.resources.goodsStockpiles };

						for(const [goodId, amount] of Object.entries(bDefinition.process.goodsOutput)){
							const currentAmount = stockpile[Number(goodId)] || 0;;

							stockpile[Number(goodId)] = currentAmount + amount;
						}

						currentPlanetoid = {
							...currentPlanetoid,
							resources: {
								...currentPlanetoid.resources,
								goodsStockpiles: stockpile
							}
						}
					}


					//tax processing
					//TODO: planetoid owner should set a tax rate on the planetoid, to be charged here instead of flat 100
					if(planetoidOwner && planetoidOwner !== buildingOwner){
						roundIncome[buildingOwner].credits -= 60;
						roundIncome[planetoidOwner].credits += 60;
					}

				}
			}

			currentPlanetoid.deposits = planetoidDeposits;
			newPlanetoidEntities[currentPlanetoid.id] = currentPlanetoid;
		}
	}

	// add income to the orgs
	const orgArray = Object.entries(roundIncome);
	for(const [id, income] of orgArray){
		const orgId = Number(id);

		newOrgs[orgId] = {
			...newOrgs[orgId],
			resources: {
				...newOrgs[orgId].resources,
				credits: newOrgs[orgId].resources.credits + income.credits,
				rocks: newOrgs[orgId].resources.rocks + income.rocks,
				consumerGoods: newOrgs[orgId].resources.consumerGoods + income.consumerGoods,
			}
		};
	}

	const events: GameEvent[] = [];

	//resolve character spawns
	let newCharacters = { ...currentState.characters.entities };
	let newCharacterIds = [ ...currentState.characters.ids ];
	let nextId =  currentState.meta.lastCharacterId;
	for(const buildingId of spawnedCharacters){
		const building = currentState.buildings.entities[buildingId];

		const genCharacter = spawnAcademyCharacter(currentState, buildingId, nextId);
		nextId++;
		newOrgs[building.ownerNationId] = {
			...newOrgs[building.ownerNationId],
			characters: {
				...newOrgs[building.ownerNationId].characters,
				characterPool: [...newOrgs[building.ownerNationId].characters.characterPool, genCharacter.id]
			}
		}
		newCharacterIds = [ ...newCharacterIds, genCharacter.id];
		newCharacters = {
			...newCharacters,
			[genCharacter.id]: genCharacter
		}

		const charGenEvent: GameEvent = {
			type: 'char_result',
			message: `Character Spawned! ${genCharacter.name} graduated from a ${building.type}.`,
			locationId: building.locationId,
			involvedOrgIds: [building.ownerNationId],
			isPlayerVisible: building.ownerNationId === 1,
		};

		events.push(charGenEvent);
	}


	let nextState = {
		...currentState,
		meta: {
			...currentState.meta,
			lastCharacterId: nextId,
			lastPopId: lastPopId,
		},
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
		},
		characters: {
			...currentState.characters,
			ids: newCharacterIds,
			entities: newCharacters,
		},
		pops: {
			ids: newPopIds,
			entities: newPops
		}
	};



	//resolve research effects
	for(const resObj of completedResearch){
		const research = RESEARCH_CATALOG[resObj.researchId];

		const planetoid = nextState.planetoids.entities[resObj.labLocationId];

		const researchCompleteEvent: GameEvent = {
			type: 'research_complete',
			message: `Research finished! ${research.researchId} was completed at ${planetoid.name}.`,
			locationId: resObj.labLocationId,
			involvedOrgIds: [resObj.orgId],
			isPlayerVisible: resObj.orgId === 1,
		};

		events.push(researchCompleteEvent);

		if (research && research.onComplete) {
			nextState = research.onComplete(nextState, resObj.orgId);
		}
	}



	return {
		newState: nextState,
		events: events,
	};
}
