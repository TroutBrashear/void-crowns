import type { GameState } from '../types/gameState';

export interface ResearchDefinition {
    researchId: string;
    difficulty: number;
    cost: number;

    prerequisites: string[];
    category: string;
    onComplete?: (currentState: GameState, orgId: number) => GameState;
}


export const RESEARCH_CATALOG: Record<string, ResearchDefinition> = {
    "subsurface_scans": {
        researchId: "subsurface_scans",
        difficulty: 1,
        cost: 120,

        prerequisites: [],
        category: "mining",

        onComplete: (currentState, orgId) => {
            return {
                ...currentState,
                orgs: {
                    ...currentState.orgs,
                    entities: {
                        ...currentState.orgs.entities,
                        [orgId]: {
                            ...currentState.orgs.entities[orgId],
                            research: {
                                ...currentState.orgs.entities[orgId].research,
                                researchBonuses: {
                                    ...currentState.orgs.entities[orgId].research.researchBonuses,
                                    depositSurvey: currentState.orgs.entities[orgId].research.researchBonuses.depositSurvey + 2,
                                }
                            }
                        }
                    }
                },
                intelligence: {
                    ...currentState.intelligence,
                    planetoidIntel: {
                        ...currentState.intelligence.planetoidIntel,
                        [orgId]: {
                            ...currentState.intelligence.planetoidIntel[orgId],
                            noProspects: [],
                        }
                    }
                }
            };
        },
    }
}
