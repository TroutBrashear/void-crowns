import type { GameState } from '../../types/gameState';
import { engineBuildFleet, engineBuildShip, engineBuildBuilding } from '../building';

export function processAiConstruction(currentState: GameState, orgId: number): GameState {

	let nextState = currentState;

	let thinkingOrg = nextState.orgs.entities[orgId];
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
		
		const buildSystemId = ownedSystems[Math.floor(Math.random() * ownedSystems.length)].id;
		const buildSystem = currentState.systems.entities[buildSystemId];
		
		const buildPlanet = buildSystem.planetoids[Math.floor(Math.random() * buildSystem.planetoids.length)];
		
		const buildResult = engineBuildBuilding(nextState, buildPlanet, 'mine', orgId);
		
		nextState = buildResult.newState;
		thinkingOrg = nextState.orgs.entities[orgId];
	}

	return nextState;
}
