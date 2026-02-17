import type { GameState, Character, BuildingClass, Planetoid } from '../../types/gameState';
import { evaluateSystemValue } from '../colonization';
import { engineAssignCharacter } from '../character';

export function evaluateBestCandidate(assignmentType: string, characters: Character[]): Character {
	let bestCandidate = characters[0];
	let winningScore = -1;

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

		if(characterScore > winningScore){
			bestCandidate = character;
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

	if(!thinkingOrg.characters.leaderId){
		let bestCandidateId = evaluateBestCandidate('leader', characterPool).id;
		nextState = engineAssignCharacter(nextState, bestCandidateId, orgId, 'leader');
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


		if(locationScore > winningScore){
			bestLocation = location;
			winningScore = locationScore;
		}
	}

	return bestLocation;
}

export function processAiBuildPlanning(currentState: GameState, orgId: number): GameState {
	let newOrgs = { ...currentState.orgs.entities };
	let thinkingOrg = { ...currentState.orgs.entities[orgId]};
	
	if(!thinkingOrg){
		return currentState;
	}

	//Update org's targeted system goals
	const orgSystems = Object.values(currentState.systems.entities).filter(system => system.ownerNationId === orgId);
	const neighborIds = new Set<number>();
	orgSystems.forEach(system => {
		system.adjacentSystemIds.forEach(id => neighborIds.add(id));
	});
	const frontierSystems = Array.from(neighborIds).filter(id => currentState.systems.entities[id].ownerNationId !== orgId);

	const weightedSystems = frontierSystems.map(system => ({system, valueScore: evaluateSystemValue(currentState, system)})).sort((a,b) => b.valueScore - a.valueScore);

	const finalTargets = weightedSystems.slice(0,3).map(object => object.system);

	let newBuildPlan =  [...thinkingOrg.contextHistory.buildPlan];
	
	//do we need a mine?
	if(thinkingOrg.contextHistory.previousIncome.rocks < 300){
		let orgPlanetoids = Object.values(currentState.planetoids.entities).filter(planetoid => planetoid.ownerNationId === orgId);
		if(!newBuildPlan.some(intent => intent.type === 'building' && intent.buildingType === 'mine')){
			let targetPlanetoid = evaluateBuildLocation('mine', orgPlanetoids);
			if(targetPlanetoid){
				newBuildPlan.push({type: "building", buildingType: 'mine', location: targetPlanetoid.id });
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
	if(frontierSystems.some(id => !currentState.systems.entities[id].ownerNationId)){
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
