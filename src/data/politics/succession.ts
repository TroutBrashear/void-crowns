import type { GameState } from "../../types/gameState";



export interface SuccessionDefinition {
    successionId: string;

    category: string;
    onComplete?: (currentState: GameState, orgId: number) => number; //actually just returning a character id here
}




export const SUCCESSION_CATALOG: Record<string, SuccessionDefinition> = {

}
