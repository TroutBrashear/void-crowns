import type { GameState } from '../../types/gameState';

export function processAiBuildPlanning(currentState: GameState, orgId: number): GameState {
	let thinkingOrg = currentState.orgs.entities[orgId];
	
	if(!thinkingOrg){
		return currentState;
	}
	
	let newBuildPlan = thinkingOrg.contextHistory.buildPlan;
	
	if(thinkingOrg.contextHistory.previousIncome.rocks < 300){
		newBuildPlan.push('mine');
	}
	
	thinkingOrg.contextHistory.buildPlan = newBuildPlan;
	
	return {
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: {
				...currentState.orgs.entities,
				[thinkingOrg.id]: thinkingOrg,
			} 
		},
	};
	
}