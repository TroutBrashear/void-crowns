import type { GameState } from '../../types/gameState';
import { engineBuildFleet, engineBuildShip, engineBuildBuilding } from '../building';
import { BUILDING_CATALOG } from '../../data/buildings';
import { SHIP_CATALOG } from '../../data/ships';

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

	//fleets
	if(thinkingOrg.resources.credits > 10000 && militaryPriority){
		//build a fleet
		const buildLocation = ownedSystems[Math.floor(Math.random() * ownedSystems.length)].id;

		nextState = engineBuildFleet(nextState, buildLocation);
		thinkingOrg = nextState.orgs.entities[orgId];
	}
	
	//evaluate buildPlan

	const buildIntent = buildPlan.shift();
	if (!buildIntent ){
		return nextState;
	}

	if(buildIntent.type === 'building'){
		if(thinkingOrg.resources.credits < BUILDING_CATALOG[buildIntent.buildingType].cost.credits || thinkingOrg.resources.rocks < BUILDING_CATALOG[buildIntent.buildingType].cost.rocks){
			return nextState;
		}

		const buildResult = engineBuildBuilding(nextState, buildIntent.location, buildIntent.buildingType, orgId);

		nextState = buildResult.newState;
	}

	if(buildIntent.type === 'ship'){
		if(thinkingOrg.resources.credits < SHIP_CATALOG[buildIntent.shipType].cost.credits || thinkingOrg.resources.rocks < SHIP_CATALOG[buildIntent.shipType].cost.rocks) {
			return nextState;
		}

		nextState = engineBuildShip(nextState, buildIntent.location, buildIntent.shipType);
	}

		//update buildPlan.
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


	thinkingOrg = nextState.orgs.entities[orgId];

	return nextState;
}
