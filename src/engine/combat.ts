import type { GameState, Fleet, GameEvent, EngineResult } from '../types/gameState';
import { getRelationship } from './diplomacy';

function getFleetsInSystem (currentState: GameState, systemId: number): Fleet[] {
	const allFleets = Object.values(currentState.fleets.entities);
    return allFleets.filter(fleet => fleet.locationSystemId === systemId);
}


function resolveBattle(currentState: GameState, fleetsInSystem: Fleet[]): EngineResult {
	let fleetScore = new Map<number, number>();


	for(const fleet of fleetsInSystem){
		if (!fleet) {
			continue;
		}

		const currentScore = fleetScore.get(fleet.ownerNationId) || 0;

		let updateScore = currentScore + Math.floor(Math.random() * 20);

		fleetScore.set(fleet.ownerNationId, updateScore);
	}

	let winnerId = -1;
	let winnerScore = 0;
	//determine winner
	for(const [factionId, score] of fleetScore) {
		if(score > winnerScore) {
			winnerId = factionId;
			winnerScore = score; 
		}
	}
	
	const remainingFleetIds = fleetsInSystem.filter(fleet => fleet.ownerNationId === winnerId).map(fleet => fleet.id);

	const fleetEntities = { ...currentState.fleets.entities };
	const fleetIds = [...currentState.fleets.ids];
	for(const fleet of fleetsInSystem){
		if(!remainingFleetIds.includes(fleet.id)){
			delete fleetEntities[fleet.id];
			fleetIds.splice(fleetIds.indexOf(fleet.id), 1)
		}
	}

	//newState to be returned
	const newState = {
		...currentState,
		fleets: {
			entities: fleetEntities,
			ids: fleetIds,
		}
	};
	
	//collect info to build result event
    const participatingFactions = Array.from(fleetScore.keys());
    const winnerOrg = currentState.orgs.entities[winnerId];
	const events: GameEvent[] = [];

	const battleResultEvent: GameEvent = {
    	type: 'battle_result',
    	message: `Battle concluded! The ${winnerOrg.name} forces are victorious.`,
    	locationId: fleetsInSystem[0]?.locationSystemId, 
    	involvedOrgIds: participatingFactions,
    	isPlayerVisible: participatingFactions.includes(1),
 	};

  	events.push(battleResultEvent);
  	return { 
  		newState: newState,
  		events: events,
  	};
}

export function processCombat(currentState: GameState): EngineResult {

	let nextState = currentState;
	const allCombatEvents: GameEvent[] = [];


	for(const systemId of currentState.systems.ids) {
		const fleetsInSystem = getFleetsInSystem(currentState, systemId);

		if(fleetsInSystem.length < 1) {
			continue;
		}

		//pare it down to unique orgs in system
		const uniqueOwnerIds = new Set(fleetsInSystem.map(f => f.ownerNationId));

		if(uniqueOwnerIds.size > 1) {
			//Check diplomatic status
			const orgsInSystem = [...uniqueOwnerIds];
			let isBattle = false;

			for(let i = 0; i < orgsInSystem.length; i++) {
				for(let j = i + 1; j < orgsInSystem.length; j++) {
					const firstOrgId = orgsInSystem[i];
					const secondOrgId = orgsInSystem[j];

					const relationship = getRelationship(nextState, firstOrgId, secondOrgId);

					if(relationship.status === 'war'){
						isBattle = true;
						break;
					}
				}

				if (isBattle) {
					break;
				}
			}
			//resolve the battle in this system
			if(isBattle){
				const battleResult = resolveBattle(nextState, fleetsInSystem);
				nextState = battleResult.newState;
				allCombatEvents.push(...battleResult.events);
			}
		}
	}

	return {
    	newState: nextState,
    	events: allCombatEvents,
    };
}