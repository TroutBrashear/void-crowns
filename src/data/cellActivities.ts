import type { GameState } from '../types/gameState';


export interface CellAssignmentDefinition {
    assignmentId: string;
    duration: number;

    allowedCellTypes: string[];
    onComplete?: (currentState: GameState, targetId: number) => GameState;
}
