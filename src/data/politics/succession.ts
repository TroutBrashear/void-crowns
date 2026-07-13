import type { Character } from "../../types/charState";
import type { GameState } from "../../types/gameState";



export interface SuccessionDefinition {
    successionId: string;

    category: string;
    onComplete: (currentState: GameState, orgId: number) => number; //actually just returning a character id here
}

export interface Candidacy  {
    score: number;
    character: Character;
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
    },
    "democratic": {
        successionId: "democratic",
        category: "democratic",
        onComplete: (currentState, orgId) => {
            let functionOrg = { ...currentState.orgs.entities[orgId]};

            //get candidates (TODO: political parties should exist...)
            let potentialCandidates = [ ...functionOrg.characters.characterPool ];

            let candidateScore: Record<number, Candidacy> = {};

            for(let i = 0; i < 3; i++){
                let addedCandidate = false;

                while(true){
                    const candidateRoll = Math.floor(Math.random() * potentialCandidates.length);

                    if(!Object.keys(candidateScore).includes(String(candidateRoll))){
                        candidateScore[candidateRoll] = { score: 0, character: { ...currentState.characters.entities[candidateRoll]}};
                        addedCandidate = true;
                    }

                    if(addedCandidate){
                        break;
                    }
                }
            }

            //score candidates


            return 0;
        }
    }
}
