import type { GameState } from '../../types/gameState';

export function processAiBuildPlanning(currentState: GameState, orgId: number): GameState {
	let newOrgs = { ...currentState.orgs.entities };
	let thinkingOrg = { ...currentState.orgs.entities[orgId]};
	
	if(!thinkingOrg){
		return currentState;
	}
	
	let newBuildPlan =  [...thinkingOrg.contextHistory.buildPlan];
	
	if(thinkingOrg.contextHistory.previousIncome.rocks < 300){
		newBuildPlan.push('mine');
	}
	
	
	newOrgs[orgId] = { ...thinkingOrg, contextHistory: { ...thinkingOrg.contextHistory, buildPlan: newBuildPlan }};
	
	return {
		...currentState,
		orgs: {
			...currentState.orgs,
			entities: newOrgs,
		},
	};
	
}