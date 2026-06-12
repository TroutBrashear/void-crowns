import type { GameState, Resources, Process, GameEvent, EngineResult, Character, Pop } from '../types/gameState';
import { BUILDING_CATALOG } from '../data/buildings';
import { RESEARCH_CATALOG } from '../data/research';
import type { ResearchDefinition } from '../data/research';
import { generateCharacter } from './character';
import { popIncreaseSpeciesRoll, pushPopEvent } from './population';
import { shuffle } from '../utils/shuffle';

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

export function resolveCharacterSpawns(currentState: GameState, spawnedCharacters: number[]): EngineResult {
	//resolve character spawns
	let newCharacters = { ...currentState.characters.entities };
	let newCharacterIds = [ ...currentState.characters.ids ];
	let nextId =  currentState.meta.lastCharacterId;
	let newOrgs = { ...currentState.orgs.entities };

	let events: GameEvent[] = [];

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
		},
		characters: {
			...currentState.characters,
			ids: newCharacterIds,
			entities: newCharacters,
		},
		orgs: {
			...currentState.orgs,
			entities: newOrgs,
		}
	}

	return {
		newState: nextState,
		events: events,
	};
}

export function applyProcess(currentState: GameState, process: Process, targetOrg: number): GameState {
	const target = currentState.orgs.entities[targetOrg];
	if(!target){
		return currentState;
	}
	const processResult = {
			credits: target.resources.credits,
			rocks: target.resources.rocks,
			gas: target.resources.gas,
	};


	if(process.input){
		processResult.credits -= process.input?.credits ?? 0;
		processResult.rocks -= process.input?.rocks ?? 0;
		processResult.gas -= process.input?.gas ?? 0;
	}

	if(process.output){
		processResult.credits += process.output?.credits ?? 0;
		processResult.rocks += process.output?.rocks ?? 0;
		processResult.gas += process.input?.gas ?? 0;
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
						gas: processResult.gas,
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

	let newIntel = { ...currentState.intelligence };

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
					gas: 0,
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
						gas: 0,
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
								locationId: currentPlanetoid.id,
								feelings: {
									happiness: 50,
									fear: 0,
									recentEvents: []
								}
							}

							newPops[newPop.id] = newPop;
							newPopIds.push(newPop.id);
							currentPlanetoid.population = {
								total: currentPlanetoid.population.total + 1,
								progress: 0,
								popIds: [...currentPlanetoid.population.popIds, newPop.id]
							}
						}
					}

					//satisfy pop needs
					let shortNeeds = 0;
					let goodsStockpiles = { ...currentPlanetoid.resources.goodsStockpiles };
					if(currentPlanetoid.resources.goodsStockpiles){
						let allNeeds: Record<string, number> = {};

						//collect total pop needs on the planetoid
						for(const popId of currentPlanetoid.population.popIds){
							let pop = { ...currentState.pops.entities[popId] }
							const species = currentState.species.entities[pop.species];

							for(const [need, quantity] of Object.entries(species.baseNeeds)){
								if(allNeeds[need]){
									allNeeds[need] += Number(quantity);
								}
								else{
									allNeeds[need] = Number(quantity);
								}
							}
						}

						let orgKeys = shuffle(Object.keys(currentPlanetoid.resources.goodsStockpiles));
						for(const orgId of orgKeys){
							for(const need of Object.keys(allNeeds)){
								if(allNeeds[need] <= 0){
									continue;
								}

								let targetNeed = Object.keys(goodsStockpiles[Number(orgId)]).find(id => currentState.goods.entities[Number(id)].type === need);
								if(targetNeed){
									let value = Math.min(goodsStockpiles[Number(orgId)][Number(targetNeed)], allNeeds[need]);
									allNeeds[need] -= value;
									goodsStockpiles[Number(orgId)][Number(targetNeed)] -= value;

									if(goodsStockpiles[Number(orgId)][Number(targetNeed)] === 0 || value === 0){
										[ ...newIntel.planetoidIntel[Number(orgId)].shortGoods[currentPlanetoid.id], targetNeed];
									}

									//the org that owns the stockpile gets paid
									if(roundIncome[Number(orgId)]){
										const pay = (value/2);
										if(Number(orgId) === currentPlanetoid.ownerNationId){
											roundIncome[Number(orgId)].credits += pay;
										}
										else if(currentPlanetoid.ownerNationId){
											roundIncome[Number(orgId)].credits += pay * .9;
											if(roundIncome[currentPlanetoid.ownerNationId]){
												roundIncome[currentPlanetoid.ownerNationId].credits += pay *.1;
											}
											else{
												roundIncome[currentPlanetoid.ownerNationId].credits = pay *.1;
											}
										}

									}
									else{
										roundIncome[Number(orgId)] = {
											credits: (value/2),
											rocks: 0,
											gas: 0,
										};
									}
								}
								else{
									[ ...newIntel.planetoidIntel[Number(orgId)].shortGoods[currentPlanetoid.id], targetNeed];
								}
							}
						}

						for(const need of Object.keys(allNeeds)){
							if(allNeeds[need] > 0){
								shortNeeds += 1;
							}
						}
					}

					currentPlanetoid = {
						...currentPlanetoid,
						resources: {
							...currentPlanetoid.resources,
							goodsStockpiles: goodsStockpiles,
						}
					};
					if(shortNeeds > 0){
						for(let pop of Object.values(newPops)){
							let happRoll = Math.random();
							if(happRoll < (0.5 * shortNeeds)){
								newPops[pop.id] = {
									...newPops[pop.id],
									feelings: {
										...newPops[pop.id].feelings,
										happiness: newPops[pop.id].feelings.happiness - 5,
										recentEvents: pushPopEvent(newPops[pop.id].feelings.recentEvents, "Needs went unmet"),
									}
								};
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
							gas: 0,
						};
					}

					//processes now have Partial<Resources>, so any of these may be undefined
					//input processing

					if(newOrgs[buildingOwner].resources.credits >= (bDefinition.process.input?.credits ?? 0) && newOrgs[buildingOwner].resources.rocks >= (bDefinition.process.input?.rocks ?? 0 )){
						roundIncome[buildingOwner].credits -= bDefinition.process.input?.credits ?? 0;
						roundIncome[buildingOwner].rocks -= bDefinition.process.input?.rocks ?? 0;
						roundIncome[buildingOwner].gas -= bDefinition.process.input?.gas ?? 0;
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

					//goods output
					if(bDefinition.process.goodsOutput && currentPlanetoid.resources.goodsStockpiles){
						let stockpile = { ...currentPlanetoid.resources.goodsStockpiles };

						for(const [goodId, amount] of Object.entries(bDefinition.process.goodsOutput)){
							let orgStockpile= { ...stockpile[building.ownerNationId] || {}};
							const currentAmount = orgStockpile[Number(goodId)] || 0;;

							orgStockpile = {
								...orgStockpile,
								[Number(goodId)]: currentAmount + amount
							}

							stockpile[building.ownerNationId] = { ... orgStockpile};
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
			}
		};
	}

	//RESOLUTION AND WRAP-UP
	let events: GameEvent[] = [];

	let nextState = {
		...currentState,
		meta: {
			...currentState.meta,
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
		pops: {
			ids: newPopIds,
			entities: newPops
		}
	};

	let characterResult = resolveCharacterSpawns(nextState, spawnedCharacters);
	nextState = characterResult.newState;
	events = characterResult.events;

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
