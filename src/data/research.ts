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
        difficulty = 1,
        cost: 120,

        prerequisites: [],
        category: "mining".

        onComplete: (currentState, orgId) => {

            return currentState;
        }
    }
}
