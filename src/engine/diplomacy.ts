import type { GameState, OrgRelation, EngineResult, GameEvent, DiploType, DiploRequest, Resources } from '../types/gameState';
import { evaluateDiploRequest, evaluateAiRelations, evaluateTradeDeal, evaluateAiTradeNeeds } from './ai/diplomacy';
import { applyProcess } from './economy';

//constants
import { CYCLE_CONFIG } from '../constants/cycle_config';

export function getRelationship(gameState: GameState, firstOrgId: number, secondOrgId: number): OrgRelation {
	const firstOrg = gameState.orgs.entities[firstOrgId];

	if(firstOrg){
		const relations = firstOrg.diplomacy.relations[secondOrgId];

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
	const nextState = { ...currentState };

	let firstOrg = nextState.orgs.entities[firstOrgId];
	let secondOrg = nextState.orgs.entities[secondOrgId];

	if (!firstOrg || !secondOrg){
		return nextState;
	}

	firstOrg = { ...firstOrg, diplomacy: { ...firstOrg.diplomacy, relations: { ...firstOrg.diplomacy.relations, [secondOrgId]: { ...firstOrg.diplomacy.relations[secondOrgId], status: newStatus }} }};
	secondOrg = { ...secondOrg, diplomacy: { ...secondOrg.diplomacy, relations: { ...secondOrg.diplomacy.relations, [firstOrgId]: { ...secondOrg.diplomacy.relations[firstOrgId], status: newStatus }} }};

	return {
		...nextState,
		orgs: {
			...nextState.orgs,
			entities: {
				...nextState.orgs.entities,
				[firstOrgId]: firstOrg,
				[secondOrgId]: secondOrg,
			},
		},
	};
}

export function resolveTrade(currentState: GameState, request: DiploRequest): GameState {
	let nextState = { ...currentState };

	if(!request.trade){
		return nextState;
	}

	const sender = currentState.orgs.entities[request.originOrgId];
	const receiver = currentState.orgs.entities[request.targetOrgId];

	if(!sender || !receiver){
		return nextState;
	}

	//can each org afford what it is sending?
	const senderValid = (sender.resources.credits >= (request.trade.senderProcess.input?.credits ?? 0)) && (sender.resources.rocks >= (request.trade.senderProcess.input?.rocks ?? 0));
	const receiverValid = (receiver.resources.credits >= (request.trade.targetProcess.input?.credits ?? 0)) && (receiver.resources.rocks >= (request.trade.targetProcess.input?.rocks ?? 0));

	if(senderValid && receiverValid){
		nextState = applyProcess(nextState, request.trade.senderProcess, request.originOrgId);
		nextState = applyProcess(nextState, request.trade.targetProcess, request.targetOrgId);
	}
	return nextState;
}

export function enginePlayerDiploResponse(currentState: GameState, requestId: number, accepted: boolean): GameState {
	let nextState = { ...currentState };

	const request = nextState.orgs.entities[1].diplomacy.incomingRequests.find(req => req.id === requestId);

	if(!request){
		return nextState;
	}

	if(accepted && (request.type === 'peace' || request.type === 'war')){
		nextState = engineUpdateRelationship(nextState, 1, request.originOrgId, request.type);
	}
	else if(accepted && (request.type === 'trade')){
		nextState = resolveTrade(nextState, request);
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

export function sendDiploRequest(currentState: GameState, targetOrgId: number, originOrgId: number, requestType: DiploType, trade?: { send: Resources, receive: Resources }): GameState {
	let targetOrg = currentState.orgs.entities[targetOrgId];
	if(!targetOrg){
		return currentState;
	}
	const nextDiploId = currentState.meta.lastDiploId + 1;
	const request: DiploRequest = {
		id: nextDiploId,
		type: requestType,
		originOrgId: originOrgId,
		targetOrgId: targetOrgId,
	};

	if(trade){
		request.trade = {
			senderProcess: {
				input: trade.send,
				output: trade.receive,
			},
			targetProcess: {
				input: trade.receive,
				output: trade.send,
			},
		}
	}

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

	const allDiploEvents: GameEvent[] = [];

	for(const orgId of nextState.orgs.ids){
		if(orgId == 1){
			continue;
		}

		nextState = evaluateAiTradeNeeds(nextState, orgId);

		let currentOrg = { ...nextState.orgs.entities[orgId]};

		if(nextState.meta.turn % CYCLE_CONFIG.DIPLOMACY.DIPLOMAT_INTERVAL === 0){
			//handle resident diplomats - loop through and update relations with originOrgId
			for(const diplomatId of currentOrg.diplomacy.residentDiplomats){

				const diplomat = nextState.characters.entities[diplomatId];

				if(!diplomat || !diplomat.citizenOrg){
					continue;
				}

				const diploRoll = Math.floor(Math.random() * diplomat.skills.diplomacy);

				const updatedRel = { ...currentOrg.diplomacy.relations[diplomat.citizenOrg], opinion: currentOrg.diplomacy.relations[diplomat.citizenOrg].opinion + diploRoll };

				currentOrg  = { ...currentOrg, diplomacy: { ...currentOrg.diplomacy, relations: { ...currentOrg.diplomacy.relations, [diplomat.citizenOrg]: updatedRel }}};

			}

			nextState = {
				...nextState,
				orgs: {
					...nextState.orgs,
					entities: {
						...nextState.orgs.entities,
						[orgId]: currentOrg
					}
				}
			}

		}

		//INCOMING REQUESTS. loop handles all incoming requests an org might have, giving each a response.
		for(const request of currentOrg.diplomacy.incomingRequests){
			const evaluatePlayerVisible = (orgId == 1 || request.originOrgId == 1);
			let success = false;
			if(request.type === 'war' || request.type === 'peace'){
				if(evaluateDiploRequest(nextState, orgId, request)){
					nextState = engineUpdateRelationship(nextState, orgId, request.originOrgId, request.type);
					success = true;
				}
			}
			else if(request.type === 'trade'){
				if(evaluateTradeDeal(nextState, orgId, request)){
					nextState = resolveTrade(nextState, request);
					success = true;
				}
			}

			if(success){
				const diploEvent: GameEvent = {
					type: 'diplo_result',
					message: `${request.type} between ${currentOrg.flavor.name} and ${nextState.orgs.entities[request.originOrgId].flavor.name}`,
					involvedOrgIds: [orgId, request.originOrgId],
					isPlayerVisible: evaluatePlayerVisible,
				};

				allDiploEvents.push(diploEvent);
			}
			else{
				const diploEvent: GameEvent = {
					type: 'diplo_result',
					message: `${request.type} DECLINED between ${currentOrg.flavor.name} and ${nextState.orgs.entities[request.originOrgId].flavor.name}`,
					involvedOrgIds: [orgId, request.originOrgId],
					isPlayerVisible: evaluatePlayerVisible,
				};

				allDiploEvents.push(diploEvent);
			}
		}

		nextState = {
			...nextState,
			orgs: {
				...nextState.orgs,
				entities: {
					...nextState.orgs.entities,
					[orgId]:{
						...nextState.orgs.entities[orgId],
						diplomacy: {
							...nextState.orgs.entities[orgId].diplomacy,
							incomingRequests: []
						},
					},
				},
			},
		};

	}


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
