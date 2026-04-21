import type { GameState } from '../../types/gameState';
import { engineBuildShip, engineBuildBuilding, engineBuildMilShip } from '../building';
import { BUILDING_CATALOG } from '../../data/buildings';
import { SHIP_CATALOG } from '../../data/ships';

export function processAiConstruction(currentState: GameState, orgId: number): GameState {

	let nextState = currentState;

	let thinkingOrg = nextState.orgs.entities[orgId];
	let buildPlan = [...thinkingOrg.contextHistory.buildPlan];

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

	if(buildIntent.type === 'milShip'){
		if(thinkingOrg.resources.credits < 4000) { //TODO: placeholder
			return nextState;
		}

		nextState = engineBuildMilShip(nextState, orgId, buildIntent.location, "destroyer"); //TODO: placeholder Ship Type
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
