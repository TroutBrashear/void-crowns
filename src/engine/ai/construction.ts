import type { GameState } from '../../types/gameState';
import { engineBuildFleet } from '../building';



export function processAiConstruction(currentState: GameState, orgId: number): GameState {

	let nextState = currentState;

	const thinkingOrg = currentState.orgs.entities[orgId];
	const ownedSystems = currentState.systems.ids.map(id => currentState.systems.entities[id]).filter(system => system && system.ownerNationId === orgId);

	console.log(thinkingOrg.resources.credits);
	
	if(thinkingOrg.resources.credits > 20000){
		//build a colony ship
	}

	if(thinkingOrg.resources.credits > 10000){
		//build a fleet
		const buildLocation = ownedSystems[Math.floor(Math.random() * ownedSystems.length)].id;

		nextState = engineBuildFleet(nextState, buildLocation);
	}



	return nextState;
}