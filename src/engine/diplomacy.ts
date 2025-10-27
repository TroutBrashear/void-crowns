import type { GameState, OrgRelation } from '../types/gameState';


export function getRelationship(gameState: GameState, firstOrgId: number, secondOrgId: number): OrgRelation {
	const firstOrg = gameState.orgs.entities[firstOrgId];

	if(firstOrg){
		const relations = firstOrg.relations.find(rel => rel.targetOrgId === secondOrgId);
		return relations;
	}

	//fallback
	return{
		targetOrgId: secondOrgId,
		status: 'peace',
		opinion: 10,
	};
}