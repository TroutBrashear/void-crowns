import type { GameState, Character, BuildingClass, Planetoid, CharacterAssignment } from '../../types/gameState';
import { evaluatePlanetoidValue, getHabitablesInSystem } from '../colonization';
import { engineAssignCharacter } from '../character';
import { RESEARCH_CATALOG } from '../../data/research';
import { getAllResearchOptions, engineAssignResearch } from '../economy';




export function evaluateResearchOptions(currentState: GameState, orgId: number): string {
	let researchOptions = getAllResearchOptions(currentState, orgId);
	let bestOption = "";
	let currentScore = -1;

	if(researchOptions.length === 0){
		return bestOption;
	}

	const planetoidIntel = currentState.intelligence.planetoidIntel[orgId];
	//const thinkingOrg = currentState.orgs.entities[orgId];

	for(const res of researchOptions){
		const researchOption = RESEARCH_CATALOG[res];
		let researchScore = 0;

		if(researchOption.category === 'mining'){
			if(planetoidIntel.noProspects.length > 5){
				researchScore += 5;
			}
			else if(planetoidIntel.noProspects.length > 10){
				researchScore += 15;
			}
		}


		if(researchScore > currentScore){
			currentScore = researchScore;
			bestOption = res;
		}
	}


	return bestOption;
}




export function evaluateBestCandidate(assignmentType: CharacterAssignment, characters: Character[]): number {
	let bestCandidate = -1;
	let winningScore = 0;

	for(const character of characters){
		let characterScore = 0;

		if(assignmentType === 'leader'){
			characterScore += character.skills.navalCombat + character.skills.administration*2;
		}
		else if(assignmentType === 'admiral'){
			characterScore += character.skills.navalCombat;
		}
		else if(assignmentType === 'governor'){
			characterScore += character.skills.administration;
		}
		else if(assignmentType === 'surveyor'){
			characterScore += character.skills.exploration*2 + character.skills.academics;
		}
		else if(assignmentType === 'scientist'){
			characterScore += character.skills.academics;
		}

		if(character.assignment){
			characterScore -= 4;
			if(character.assignment.type === 'leader'){
				characterScore = -20; //never reassign leader.
			}
			else if(character.assignment.type === assignmentType){
				characterScore -= 5; //already doing this somewhere else.
			}
		}

		if(characterScore > winningScore){
			bestCandidate = character.id;
			winningScore = characterScore;
		}
	}

	return bestCandidate;
}

export function processAiCharacterManagement(currentState: GameState, orgId: number): GameState {
	let thinkingOrg = { ...currentState.orgs.entities[orgId]};

	let characterPool = thinkingOrg.characters.characterPool.map(characterId => currentState.characters.entities[characterId]);

	let nextState = { ...currentState };

	if(!thinkingOrg){
		return currentState;
	}

	//Priority 1 - does the org have a leader?
	if(!thinkingOrg.characters.leaderId){
		let bestCandidateId = evaluateBestCandidate('leader', characterPool);
		if(bestCandidateId > -1) {
			nextState = engineAssignCharacter(nextState, bestCandidateId, orgId, 'leader');
		}
	}

	//Priority 2 - do fleets have leaders?
	let leaderlessFleets = Object.values(currentState.fleets.entities).filter(fleet => (fleet.ownerNationId === orgId && !fleet.assignedCharacter));
	for(const fleet of leaderlessFleets){
		let bestCandidateId = evaluateBestCandidate('admiral', characterPool);
		if(bestCandidateId > -1) {
			nextState = engineAssignCharacter(nextState, bestCandidateId, fleet.id, 'admiral');
		}
	}

	//Priority 3 - do labs have scientists?
	let emptyLabs = Object.values(currentState.buildings.entities).filter(building => (building.type === 'researchLab' && building.ownerNationId === orgId && !building.assignedCharacter));
	for(const lab of emptyLabs){
		let bestCandidateId = evaluateBestCandidate('scientist', characterPool);
		if(bestCandidateId > -1) {
			nextState = engineAssignCharacter(nextState, bestCandidateId, lab.id, 'scientist');
		}

		//also... do they have research?
		if(!lab.research.project){
			let researchOption = evaluateResearchOptions(nextState, orgId);
			if(researchOption){
				nextState = engineAssignResearch(nextState, lab.id, researchOption);
			}
		}
	}


	return {
		...nextState
	}
}

export function evaluateBuildLocation(buildingType: BuildingClass, locations: Planetoid[]): Planetoid | null {
	if (locations.length === 0){
		return null;
	}

	let bestLocation = locations[0];
	let winningScore = -1;

	for(const location of locations){
		let locationScore = 0;

		locationScore += (location.size / 2) - (location.buildings.length);

		if(buildingType === 'mine'){
			for(const deposit of location.deposits){
				if(deposit.type === 'rocks' && deposit.isVisible){
					locationScore += 1;
				}
			}
		}

		if(buildingType === 'researchLab'){
			locationScore += 1; //placeholder, I'm sure there's some reason to prefer one planetoid over another. (research category bonuses!)
		}

		if(buildingType === 'consumerCenter'){
			locationScore += (location.population/200000000);
		}


		if(locationScore > winningScore){
			bestLocation = location;
			winningScore = locationScore;
		}
	}

	return bestLocation;
}

function processAiBuildPlanningCorporation(currentState: GameState, orgId: number): GameState {
	let thinkingOrg = { ...currentState.orgs.entities[orgId]};

	if(!thinkingOrg){
		return currentState;
	}

	let newBuildPlan =  [...thinkingOrg.contextHistory.buildPlan];


	//do we need a mine?
	if(thinkingOrg.contextHistory.previousIncome.rocks < 300){
		let orgPlanetoids = Object.values(currentState.planetoids.entities).filter(planetoid => {
			if(planetoid.ownerNationId === orgId) {
				return true;
			}
			if(thinkingOrg.parentId){
				if(planetoid.ownerNationId === thinkingOrg.parentId){
					return true;
				}
			}
		});
		if(!newBuildPlan.some(intent => intent.type === 'building' && intent.buildingType === 'mine')){
			let targetPlanetoid = evaluateBuildLocation('mine', orgPlanetoids);
			if(targetPlanetoid){
				newBuildPlan.push({type: "building", buildingType: 'mine', location: targetPlanetoid.id });
			}
		}
	}

	//do we need a consumerFactory?
	if(thinkingOrg.contextHistory.previousIncome.consumerGoods < 200){
		let orgPlanetoids = Object.values(currentState.planetoids.entities).filter(planetoid => {
			if(planetoid.ownerNationId === orgId) {
				return true;
			}
			if(thinkingOrg.parentId){
				if(planetoid.ownerNationId === thinkingOrg.parentId){
					return true;
				}
			}
		});
		if(!newBuildPlan.some(intent => intent.type === 'building' && intent.buildingType === 'consumerFactory')){
			let targetPlanetoid = evaluateBuildLocation('consumerFactory', orgPlanetoids);
			if(targetPlanetoid){
				newBuildPlan.push({type: "building", buildingType: 'consumerFactory', location: targetPlanetoid.id });
			}
		}
	}

	//do we need a consumerCenter?
	if(thinkingOrg.resources.consumerGoods > thinkingOrg.resources.rocks){
		let orgPlanetoids = Object.values(currentState.planetoids.entities).filter(planetoid => {
			if(planetoid.ownerNationId === orgId) {
				return true;
			}
			if(thinkingOrg.parentId){
				if(planetoid.ownerNationId === thinkingOrg.parentId){
					return true;
				}
			}
		});
		if(!newBuildPlan.some(intent => intent.type === 'building' && intent.buildingType === 'consumerCenter')){
			let targetPlanetoid = evaluateBuildLocation('consumerCenter', orgPlanetoids);
			if(targetPlanetoid){
				newBuildPlan.push({type: "building", buildingType: 'consumerCenter', location: targetPlanetoid.id });
			}
		}
	}

	thinkingOrg = {
		...thinkingOrg,
		contextHistory: {
			...thinkingOrg.contextHistory,
			buildPlan: newBuildPlan,
		}
	};

	return{
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: {
				...currentState.orgs.entities,
				[orgId]: thinkingOrg,
			},
		},
	};
}

export function processAiBuildPlanning(currentState: GameState, orgId: number): GameState {
	let newOrgs = { ...currentState.orgs.entities };
	let thinkingOrg = { ...currentState.orgs.entities[orgId]};
	
	if(!thinkingOrg){
		return currentState;
	}

	if(thinkingOrg.category === 'corporation'){
		return processAiBuildPlanningCorporation(currentState, orgId);
	}

	//Update org's targeted system goals
	const orgSystems = Object.values(currentState.systems.entities).filter(system => system.ownerNationId === orgId);
	const neighborIds = new Set<number>();
	orgSystems.forEach(system => {
		system.adjacentLanes.forEach(lane => {
			const currentLane = currentState.lanes.entities[lane];
			if(currentLane.status === 'stable'){
				const nextNeighborId =  currentLane.systemIdA === system.id ? currentLane.systemIdB : currentLane.systemIdA;
				neighborIds.add(nextNeighborId);
			}
		})
	});
	const frontierSystems = Array.from(neighborIds).filter(id => currentState.systems.entities[id].ownerNationId !== orgId);

	const considerSystems = [...orgSystems.map(system => system.id), ...frontierSystems];

	//const weightedSystems = frontierSystems.map(system => ({system, valueScore: evaluateSystemValue(currentState, system)})).sort((a,b) => b.valueScore - a.valueScore);

	const candidatePlanetoids = considerSystems.flatMap(systemId => getHabitablesInSystem(currentState, systemId));

	const weightedPlanetoids = candidatePlanetoids.map(planetoid => ({planetoid, valueScore: evaluatePlanetoidValue(planetoid)})).sort((a,b) => b.valueScore - a.valueScore);

	const finalTargets = weightedPlanetoids.slice(0,3).map(object => object.planetoid.id);

	let newBuildPlan =  [...thinkingOrg.contextHistory.buildPlan];
	
	//do we need a mine?
	if(thinkingOrg.contextHistory.previousIncome.rocks < 300){
		let orgPlanetoids = Object.values(currentState.planetoids.entities).filter(planetoid => {
			if(planetoid.ownerNationId === orgId) {
				return true;
			}
			if(thinkingOrg.parentId){
				if(planetoid.ownerNationId === thinkingOrg.parentId){
					return true;
				}
			}
		});
		if(!newBuildPlan.some(intent => intent.type === 'building' && intent.buildingType === 'mine')){
			let targetPlanetoid = evaluateBuildLocation('mine', orgPlanetoids);
			if(targetPlanetoid){
				newBuildPlan.push({type: "building", buildingType: 'mine', location: targetPlanetoid.id });
			}
		}
	}

	if(thinkingOrg.resources.credits > 20000){
		let orgPlanetoids = Object.values(currentState.planetoids.entities).filter(planetoid => planetoid.ownerNationId === orgId);
		if(!newBuildPlan.some(intent => intent.type === 'building' && intent.buildingType === 'researchLab')){
			let targetPlanetoid = evaluateBuildLocation('researchLab', orgPlanetoids);
			if(targetPlanetoid){
				newBuildPlan.push({type: "building", buildingType: 'researchLab', location: targetPlanetoid.id });
			}
		}
	}
	
	//ship building logic
	const orgShips = Object.values(currentState.ships.entities).filter(ship => ship.ownerNationId === orgId);

	//do we need a survey ship?
	if(orgShips.length < orgSystems.length){
		if(!newBuildPlan.some(intent => intent.type === 'ship' && intent.shipType === 'survey_ship')){
			let targetSystem = orgSystems[Math.floor(Math.random() * orgSystems.length)].id;
			newBuildPlan.push({type: "ship", shipType: 'survey_ship', location: targetSystem });
		}
	}

	//do we need a colony ship?
	if(candidatePlanetoids.length > 0){
		if(!newBuildPlan.some(intent => intent.type === 'ship' && intent.shipType === 'colony_ship')){
			let targetSystem = orgSystems[Math.floor(Math.random() * orgSystems.length)].id;
			newBuildPlan.push({type: "ship", shipType: 'colony_ship', location: targetSystem });
		}
	}

	newOrgs[orgId] = { ...thinkingOrg, contextHistory: { ...thinkingOrg.contextHistory, buildPlan: newBuildPlan, targetSystems: finalTargets }};
	
	return {
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: newOrgs,
		},
	};
}
