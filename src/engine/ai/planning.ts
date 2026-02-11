import type { GameState, Character } from '../../types/gameState';
import { evaluateSystemValue } from '../colonization';

export function evaluateBestCandidate(assignmentType: string, characters: Character[]): Character {
	let bestCandidate = Character;

	for(character of characters){
		bestCandidate = character;
	}

	return bestCandidate;
}

export function processAiCharacterManagement(currentState: GameState, orgId: number): GameState {
	let newOrgs = { ...currentState.orgs.entities };
	let thinkingOrg = { ...currentState.orgs.entities[orgId]};

	let characterPool = thinkingOrg.characters.characterPool.map(characterId => currentState.characters.entities[characterId]);

	let nextState = { ...currentState };

	if(!thinkingOrg){
		return currentState;
	}

	if(!thinkingOrg.characters.leader){
		let bestCandidateId = evaluateBestCandidate('leader', characterPool).id;
		nextState = engineAssignCharacter(nextState, bestCandidateId, orgId, 'leader');
	}

	return {
		...currentState
	}
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
	
	if(thinkingOrg.contextHistory.previousIncome.rocks < 300){
		newBuildPlan.push('mine');
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
