import type { GameState, GameEvent, EngineResult } from '../types/gameState';
import type { Planetoid } from '../types/geoState';
import type { Fleet } from '../types/shipTypes';

import { getRelationship } from './diplomacy';

function getFleetsInSystem (currentState: GameState, systemId: number): Fleet[] {
	const allFleets = Object.values(currentState.fleets.entities);
    return allFleets.filter(fleet => fleet.locationSystemId === systemId);
}


export function calculateFleetPower(currentState: GameState, fleetId: number): number {
	let fleetStrength = 0;

	const fleet = currentState.fleets.entities[fleetId];

	if(!fleet || fleet.ships.length === 0){
		return 0;
	}

	for(const shipId of fleet.ships){
		const ship = currentState.milShips.entities[shipId];

		if(ship){
			if(ship.status === 'active'){
				fleetStrength += ship.stats.strength;
			}
		}


	}

	return fleetStrength;
}

function calculateFleetCombatScore(currentState: GameState, fleetId: number): number {
	let combatScore = 0;

	const fleet = currentState.fleets.entities[fleetId];

	if(!fleet || fleet.ships.length === 0){
		return 0;
	}

	for(const shipId of fleet.ships){
		const ship = currentState.milShips.entities[shipId];

		let combatRoll = Math.floor(Math.random() * 10);

		if(ship.assignedCharacter){
			const captain = currentState.characters.entities[ship.assignedCharacter];

			if(captain){
				combatRoll += captain.skills.navalCombat;
			}
		}

		combatScore += combatRoll;
	}

	const techBonus = currentState.orgs.entities[fleet.ownerNationId].research.researchBonuses.fleetCombat;
	combatScore += techBonus;

	if(fleet.assignedCharacter){
		const admiral = currentState.characters.entities[fleet.assignedCharacter];
		if(admiral){
			combatScore = combatScore * (1 + (admiral.skills.navalCombat / 10));
		}
	}

	return combatScore;
}

export function createDebris(currentState: GameState, invShipIds: number[], locationId: number): GameState {
	let shipIds = [ ...currentState.milShips.ids ];
	const ships = { ...currentState.milShips.entities };

	const debrisIds: number[] = [];
	const dropIds: number[] = [];

	//for each ship, swap status to wreck and add it to our array
	for(const shipId of invShipIds){
		const newShip = { ...ships[shipId]};

		const coinFlip = Math.random() * 5;

		if(!newShip || coinFlip < 2){
			dropIds.push(shipId);
			continue;
		}

		ships[shipId] = {
			...ships[shipId],
			status: 'wreck',
			parentFleet: null
		}

		debrisIds.push(shipId);
	}

	for(const shipId of dropIds){
		shipIds = shipIds.filter(id => id !== shipId);
		delete ships[shipId];
	}
	//create the new Planetoid entity for the debris field
	let planId = currentState.meta.lastPlanetoidId;
	planId++;
	let locationSystem = { ...currentState.systems.entities[locationId]};

	const newDebrisField: Planetoid = {
		id: planId,
		name: 'Debris Field',
		parentPlanetoidId: locationSystem.planetoids[0],
		locationSystemId: locationId,
		classification: 'debris',
		environment: 'debris',
		ownerNationId: null,
		size: debrisIds.length,
		buildings: [],
		structures: {
			habitats: 0
		},
		tags: [],
		deposits: [],
		resources: {},
		construct:{
			shipDebris: debrisIds
		}
	};

	locationSystem = { ...locationSystem, planetoids: [ ...locationSystem.planetoids, planId]};

	return {
		...currentState,
		meta: {
			...currentState.meta,
			lastPlanetoidId: planId
		},
		milShips: {
			...currentState.milShips,
			ids: shipIds,
			entities: ships
		},
		planetoids: {
			...currentState.planetoids,
			entities: { ...currentState.planetoids.entities, [planId]: newDebrisField},
			ids: [ ...currentState.planetoids.ids, planId],
		},
		systems: {
			...currentState.systems,
			entities: {
				...currentState.systems.entities,
				[locationId]: locationSystem
			}
		}
	};
}


function resolveBattle(currentState: GameState, fleetsInSystemFactionA: Fleet[], fleetsInSystemFactionB: Fleet[]): EngineResult {
	let fleetScoreA = 0;
	let fleetScoreB = 0;

	for(const fleet of fleetsInSystemFactionA){
		if (!fleet) {
			continue;
		}
		fleetScoreA += calculateFleetCombatScore(currentState, fleet.id);
	}
	for(const fleet of fleetsInSystemFactionB){
		if (!fleet) {
			continue;
		}
		fleetScoreB += calculateFleetCombatScore(currentState, fleet.id);
	}
	
	const fleetEntities = { ...currentState.fleets.entities };
	let fleetIds = [...currentState.fleets.ids];
	const participatingFactions = [fleetsInSystemFactionA[0].ownerNationId, fleetsInSystemFactionB[0].ownerNationId];

	let winnerId = -1;

	//determine winner
	let nextState = { ...currentState };
	if(fleetScoreA > fleetScoreB){
		winnerId = fleetsInSystemFactionA[0].ownerNationId;
		for(const fleet of fleetsInSystemFactionB){
			nextState = createDebris(nextState, fleet.ships, fleet.locationSystemId);

			delete fleetEntities[fleet.id];
			fleetIds = fleetIds.filter(id => id !== fleet.id);
		}
	}
	else{
		winnerId = fleetsInSystemFactionB[0].ownerNationId;
		for(const fleet of fleetsInSystemFactionA){	
			nextState = createDebris(nextState, fleet.ships, fleet.locationSystemId);

			delete fleetEntities[fleet.id];
			fleetIds = fleetIds.filter(id => id !== fleet.id);
		}
	}

	nextState = {
		...nextState,
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
  		newState: nextState,
  		events: events,
  	};
}

export function processCombat(currentState: GameState): EngineResult {

	let nextState = currentState;
	const allCombatEvents: GameEvent[] = [];


	for(const systemId of currentState.systems.ids) {
		const noBattle = false;

		while(!noBattle){
			const fleetsInSystem = getFleetsInSystem(nextState, systemId);


			//no chance for combat if there aren't multiple fleets
			if(fleetsInSystem.length < 2) {
				break;
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

				if(!isBattle){
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
