import type { GameState, OrgRelation, EngineResult, GameEvent } from '../types/gameState';
import { evaluateDiploRequest } from './ai/diplomacy';

export function getRelationship(gameState: GameState, firstOrgId: number, secondOrgId: number): OrgRelation {
	const firstOrg = gameState.orgs.entities[firstOrgId];

	if(firstOrg){
		const relations = firstOrg.diplomacy.relations.find(rel => rel.targetOrgId === secondOrgId);

		if(relations){
			return relations;
		}
	}


	//fallback
	return{
		targetOrgId: secondOrgId,
		status: 'peace',
		opinion: 10,
	};
}

export function engineUpdateRelationship(currentState: GameState, firstOrgId: number, secondOrgId: number, newStatus: 'war' | 'peace'): GameState {
	let nextState = { ...currentState };

	const firstOrg = nextState.orgs.entities[firstOrgId];
	const secondOrg = nextState.orgs.entities[secondOrgId];

	if (!firstOrg || !secondOrg){
		return nextState;
	}

	const firstUpdatedRel = firstOrg.diplomacy.relations.map(rel =>
		rel.targetOrgId === secondOrgId ? { ...rel, status: newStatus } : rel
	);

	const secondUpdatedRel = secondOrg.diplomacy.relations.map(rel =>
		rel.targetOrgId === firstOrgId ? { ...rel, status: newStatus } : rel
	);

	const updatedFirstOrg = { ...firstOrg, diplomacy: { ...firstOrg.diplomacy, relations: firstUpdatedRel }};
	const updatedSecondOrg = { ...secondOrg, diplomacy: { ...secondOrg.diplomacy, relations: secondUpdatedRel }};

	return {
		...nextState,
		orgs: {
			...nextState.orgs,
			entities: {
				...nextState.orgs.entities,
				[firstOrgId]: updatedFirstOrg,
				[secondOrgId]: updatedSecondOrg,
			},
		},
	};
};


export function processDiplomacy(currentState: GameState): EngineResult {
	let nextState = { ...currentState };

	let allDiploEvents: GameEvent[] = [];

	let updatedOrgs = { ...nextState.orgs.entities };
	//iterate through orgs. Iterate through their incoming diplomacy requests for evaluation
	for(const orgId of nextState.orgs.ids){
		if(orgId == 1){
			continue;
		}


		let currentOrg = nextState.orgs.entities[orgId];


		for(const request of currentOrg.diplomacy.incomingRequests){
			if(request.type == 'war' || request.type == 'peace'){
				if(evaluateDiploRequest(nextState, orgId, request)){
					nextState = engineUpdateRelationship(nextState, orgId, request.originOrgId, request.type);
				}
				const evaluatePlayerVisible = (orgId == 1 || request.originOrgId == 1);
				const diploEvent: GameEvent = {
					type: 'diplo_result',
					message: `${request.type} between ${currentOrg.flavor.name} and ${nextState.orgs.entities[request.originOrgId].flavor.name}`,
					involvedOrgIds: [orgId, request.originOrgId],
					isPlayerVisible: evaluatePlayerVisible,
				};

				allDiploEvents.push(diploEvent);
			}
		}

		let updatedOrg = { ...nextState.orgs.entities[orgId], diplomacy: {...nextState.orgs.entities[orgId].diplomacy, incomingRequests: [] }};
		updatedOrgs[orgId] = { ...updatedOrg };
	}

	nextState = {
		...nextState,
		orgs:{
			...nextState.orgs,
			entities: updatedOrgs,
		}
	};
	return {
		newState: nextState,
		events: allDiploEvents,
	};
}
