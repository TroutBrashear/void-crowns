import type { GameState } from "../../types/gameState";



export interface SuccessionDefinition {
    successionId: string;

    category: string;
    onComplete: (currentState: GameState, orgId: number) => number; //actually just returning a character id here
}




export const SUCCESSION_CATALOG: Record<string, SuccessionDefinition> = {
    "hereditary": {
        successionId: "hereditary",
        category: "autocratic",
        onComplete: (currentState, orgId) => {
            let functionOrg = { ...currentState.orgs.entities[orgId]};

            if(functionOrg.characters.leaderId){
                 const leader = currentState.characters.entities[functionOrg.characters.leaderId];

                 for(const characterId of leader.history.childrenIds){
                     if(characterId && currentState.characters.entities[characterId].status === 'alive'){
                        return characterId;
                     }
                 }
            }

            else{
                return 0;
            }

               return 0;
        }
    }
}
