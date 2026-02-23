import type { GameState, Character, BuildingClass, Planetoid, CharacterAssignment } from '../../types/gameState';
import { evaluateSystemValue } from '../colonization';
import { engineAssignCharacter } from '../character';

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

		if(character.assignment){
			characterScore -= 4;
			if(character.assignment.type === 'leader'){
				characterScore = -10; //never reassign leader.
			}
			else if(character.assignment.type === assignmentType){
				characterScore -= 4; //already doing this somewhere else.
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
		system.adjacentLanes.forEach(lane => {
			const currentLane = lanes.entities[lane];
			if(currentLane.status === 'stable'){
				const nextNeighborId =  currentLane.systemIdA === system.id ? currentLane.systemIdB : currentLane.systemIdA;
				neighborIds.add(nextNeighborId);
			}
		})
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
