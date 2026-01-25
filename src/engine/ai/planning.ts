import type { GameState, System } from '../../types/gameState';


export function processAiBuildPlanning(currentState: GameState, orgId: number): GameState {
	let newOrgs = { ...currentState.orgs.entities };
	let thinkingOrg = { ...currentState.orgs.entities[orgId]};
	
	if(!thinkingOrg){
		return currentState;
	}

	//Update org's targeted system goals
	const orgSystems = Object.values(currentState.systems.entities).filter(system => system.ownerNationId === orgId);
	const neighborIds = new Set<number>();
	orgSystems.forEach(system => {
		system.adjacentSystemIds.forEach(id => neighborIds.add(id));
	});
	const frontierSystems = Array.from(neighborIds).filter(id => currentState.systems.entities[id].ownerNationId !== orgId);



	let newBuildPlan =  [...thinkingOrg.contextHistory.buildPlan];
	
	if(thinkingOrg.contextHistory.previousIncome.rocks < 300){
		newBuildPlan.push('mine');
	}
	
	
	newOrgs[orgId] = { ...thinkingOrg, contextHistory: { ...thinkingOrg.contextHistory, buildPlan: newBuildPlan, targetSystems: frontierSystems }};
	
	return {
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: newOrgs,
		},
	};
}
