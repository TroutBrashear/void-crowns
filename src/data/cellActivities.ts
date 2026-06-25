import type { GameState } from '../types/gameState';
import { killCharacter } from '../engine/character';

export interface CellAssignmentDefinition {
    assignmentId: string;
    duration: number;

    onComplete: (currentState: GameState, targetId: number) => GameState;
}

export const CASSIGNMENT_CATALOG: Record<string, CellAssignmentDefinition> = {
    "assassinateGovernor": {
        assignmentId: "assassinateGovernor",
        duration: 5,

       onComplete: (currentState, targetId) => {
            const governorId = currentState.systems.entities[currentState.planetoids.entities[targetId].locationSystemId].assignedCharacter;
            if(governorId === null){
                return currentState;
            }
            return killCharacter(currentState, governorId);
       }
    }
}
