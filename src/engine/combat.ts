import type { GameState, Fleet } from '../types/gameState';

function getFleetsInSystem (currentState: GameState, systemId: number): Fleet[] {
	const allFleets = Object.values(currentState.fleets.entities);
    return allFleets.filter(fleet => fleet.locationSystemId === systemId);
}


function resolveBattle(currentState: GameState, fleetsInSystem: Fleet[]): GameState {
	let fleetScore = new Map<number, number>();

	for(const fleet of fleetsInSystem){
		if (!fleet) continue;
		
		if(!fleetScore.has(fleet.ownerNationId)) {
			fleetScore.set(fleet.ownerNationId, 0);
		}

		let updateScore = fleetScore.get(fleet.ownerNationId) + Math.floor(Math.random() * 20);

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

	return {
		...currentState,
		fleets: {
			entities: fleetEntities,
			ids: fleetIds,
		}
	};
}

export function processCombat(currentState: GameState): GameState {

	let nextState = currentState;

	for(const systemId of currentState.systems.ids) {
		const fleetsInSystem = getFleetsInSystem(currentState, systemId);

		if(fleetsInSystem.length < 1) {
			continue;
		}

		//pare it down to unique orgs in system
		const uniqueOwnerIds = new Set(fleetsInSystem.map(f => f.ownerNationId));

		if(uniqueOwnerIds.size > 1) {
			nextState = resolveBattle(nextState, fleetsInSystem);
		}
	}

	return nextState;

}