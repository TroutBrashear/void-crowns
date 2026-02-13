import type { GameState } from '../../types/gameState';
import { engineBuildFleet, engineBuildShip, engineBuildBuilding } from '../building';
import { BUILDING_CATALOG } from '../../data/buildings';

export function processAiConstruction(currentState: GameState, orgId: number): GameState {

	let nextState = currentState;

	let thinkingOrg = nextState.orgs.entities[orgId];
	let buildPlan = [...thinkingOrg.contextHistory.buildPlan];
	const ownedSystems = currentState.systems.ids.map(id => currentState.systems.entities[id]).filter(system => system && system.ownerNationId === orgId);
	const ownedFleets = currentState.fleets.ids.map(id => currentState.fleets.entities[id]).filter(fleet => fleet && fleet.ownerNationId === orgId);

	//thinkingBlock
	let militaryPriority = false;
	//let colonyPriority = false;
	
	if(ownedFleets.length < (ownedSystems.length / 5)){
		militaryPriority = true;
	}
	
	//ships
	if(thinkingOrg.resources.credits > 16000){
		//build a colony ship
		const buildLocation = ownedSystems[Math.floor(Math.random() * ownedSystems.length)].id;

		nextState = engineBuildShip(nextState, buildLocation, 'colony_ship');
		thinkingOrg = nextState.orgs.entities[orgId];
	}
	
	//fleets
	if(thinkingOrg.resources.credits > 10000 && militaryPriority){
		//build a fleet
		const buildLocation = ownedSystems[Math.floor(Math.random() * ownedSystems.length)].id;

		nextState = engineBuildFleet(nextState, buildLocation);
		thinkingOrg = nextState.orgs.entities[orgId];
	}
	
	//buildings
	if(thinkingOrg.resources.credits > 5000){
		//build... something.

		const buildIntent = buildPlan.shift();
		if (!buildIntent || thinkingOrg.resources.credits < BUILDING_CATALOG[buildIntent.buildingType].cost.credits || thinkingOrg.resources.rocks < BUILDING_CATALOG[buildIntent.buildingType].cost.rocks ){
			return nextState;
		}

		nextState = {
			...nextState,
			orgs: {
				...nextState.orgs,
				entities: {
					...nextState.orgs.entities,
					[orgId]: {
						...nextState.orgs.entities[orgId],

						contextHistory: {
							...nextState.orgs.entities[orgId].contextHistory,
							buildPlan: buildPlan,
						},
					},
				},
			},
		};

		const buildResult = engineBuildBuilding(nextState, buildIntent.location, buildIntent.buildingType, orgId);
		

		nextState = buildResult.newState;
		thinkingOrg = nextState.orgs.entities[orgId];
	}

	return nextState;
}
