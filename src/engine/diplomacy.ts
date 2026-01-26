import type { GameState, OrgRelation, EngineResult, GameEvent, DiploType } from '../types/gameState';
import { evaluateDiploRequest, evaluateAiRelations } from './ai/diplomacy';

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
}


export function enginePlayerDiploResponse(currentState: GameState, requestId: number, accepted: boolean): GameState {
	let nextState = { ...currentState };

	let request = nextState.orgs.entities[1].diplomacy.incomingRequests[requestId];

	if(!request){
		return nextState;
	}

	if(accepted){
		nextState = engineUpdateRelationship(nextState, 1, request.originOrgId, request.type);
	}


	let playerRequests = nextState.orgs.entities[1].diplomacy.incomingRequests;

	playerRequests = playerRequests.filter(req => req.id !== request.id);

	return {
		...nextState,
		orgs: {
			...nextState.orgs,
			entities: {
				...nextState.orgs.entities,
				[1]:{
					...nextState.orgs.entities[1],
					diplomacy: {
						...nextState.orgs.entities[1].diplomacy,
						incomingRequests: playerRequests,
					}
				}
			}
		}
	}
}

export function sendDiploRequest(currentState: GameState, targetOrgId: number, originOrgId: number, requestType: DiploType): GameState {
	let targetOrg = currentState.orgs.entities[targetOrgId];
	if(!targetOrg){
		return currentState;
	}
	const nextDiploId = currentState.meta.lastDiploId + 1;
	const request = {
		id: nextDiploId,
		type: requestType,
		originOrgId: originOrgId,
	};

	targetOrg = {
		...targetOrg,
		diplomacy: {
			...targetOrg.diplomacy,
			incomingRequests: [...targetOrg.diplomacy.incomingRequests, request],
		},
	};

	return {
		...currentState,
		meta: {
			...currentState.meta,
			lastDiploId: nextDiploId,
		},
		orgs: {
			...currentState.orgs,
			entities: {
				...currentState.orgs.entities,
				[targetOrgId]: targetOrg,
			}
		}
	};
}


export function processDiplomacy(currentState: GameState): EngineResult {
	let nextState = { ...currentState };

	let allDiploEvents: GameEvent[] = [];

	let updatedOrgs = { ...nextState.orgs.entities };

	for(const orgId of nextState.orgs.ids){
		if(orgId == 1){
			continue;
		}

		let currentOrg = nextState.orgs.entities[orgId];


		//INCOMING REQUESTS. loop handles all incoming requests an org might have, giving each a response.
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

	for(const orgId of nextState.orgs.ids){
		if(orgId == 1){
			continue;
		}

		//OUTBOUND REQUESTS. loop evaluates diplo status for every other org, determining if change is needed.
		for(const targetOrgId of nextState.orgs.ids){
			if(targetOrgId == orgId){
				continue;
			}

			const diploIntent = evaluateAiRelations(nextState, orgId, targetOrgId);
			if(!diploIntent){
				continue;
			}
			else if(diploIntent == 'war'){
				nextState = sendDiploRequest(nextState, targetOrgId, orgId, 'war');
			}
			else if(diploIntent == 'peace'){
				nextState = sendDiploRequest(nextState, targetOrgId, orgId, 'peace');
			}
		}
	}


	return {
		newState: nextState,
		events: allDiploEvents,
	};
}
