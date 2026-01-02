import type { GameState, Fleet, GameEvent, EngineResult } from '../types/gameState';
import { getRelationship } from './diplomacy';

function getFleetsInSystem (currentState: GameState, systemId: number): Fleet[] {
	const allFleets = Object.values(currentState.fleets.entities);
    return allFleets.filter(fleet => fleet.locationSystemId === systemId);
}


function resolveBattle(currentState: GameState, fleetsInSystemFactionA: Fleet[], fleetsInSystemFactionB: Fleet[]): EngineResult {
	let fleetScoreA = 0;
	let fleetScoreB = 0;

	for(const fleet of fleetsInSystemFactionA){
		if (!fleet) {
			continue;
		}
		fleetScoreA += Math.floor(Math.random() * 20);
	}
	for(const fleet of fleetsInSystemFactionB){
		if (!fleet) {
			continue;
		}
		fleetScoreB += Math.floor(Math.random() * 20);
	}
	
	const fleetEntities = { ...currentState.fleets.entities };
	const fleetIds = [...currentState.fleets.ids];
	 const participatingFactions = [fleetsInSystemFactionA[0].ownerNationId, fleetsInSystemFactionB[0].ownerNationId];

	let winnerId = -1;
	//let winnerScore = 0;
	//determine winner
	if(fleetScoreA > fleetScoreB){
		winnerId = fleetsInSystemFactionA[0].ownerNationId;
		for(const fleet of fleetsInSystemFactionB){	
			delete fleetEntities[fleet.id];
			fleetIds.splice(fleetIds.indexOf(fleet.id), 1);
		}
	}
	else{
		winnerId = fleetsInSystemFactionB[0].ownerNationId;
		for(const fleet of fleetsInSystemFactionA){	
			delete fleetEntities[fleet.id];
			fleetIds.splice(fleetIds.indexOf(fleet.id), 1);
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
    const winnerOrg = currentState.orgs.entities[winnerId];
	const events: GameEvent[] = [];

	const battleResultEvent: GameEvent = {
    	type: 'battle_result',
    	message: `Battle concluded! The ${winnerOrg.flavor.name} forces are victorious.`,
    	locationId: fleetsInSystemFactionA[0]?.locationSystemId, 
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


		//no chance for combat if there aren't multiple fleets
		if(fleetsInSystem.length < 2) {
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
						//set up battle and call resolveBattle
						const firstOrgFleets = fleetsInSystem.filter(fleet => fleet.ownerNationId === firstOrgId);
						const secondOrgFleets = fleetsInSystem.filter(fleet => fleet.ownerNationId === secondOrgId);
						
						const battleResult = resolveBattle(nextState, firstOrgFleets, secondOrgFleets);
						nextState = battleResult.newState;						
						allCombatEvents.push(...battleResult.events);
						isBattle=true;
						break;
					}
				}

				if (isBattle) {
					break;
				}
			}
		}
	}

	return {
    	newState: nextState,
    	events: allCombatEvents,
    };
}