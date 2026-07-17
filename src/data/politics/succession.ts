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
            let currentLeader = (functionOrg.characters.leaderId) ? { ...currentState.characters.entities[functionOrg.characters?.leaderId]} : null;

            //get candidates (TODO: political parties should exist...)
            let potentialCandidates = [ ...functionOrg.characters.characterPool ];

            if(potentialCandidates.length < 1){
                return 0;
            }

            let candidateScore: Record<number, Candidacy> = {};

            if(currentLeader && currentLeader.status === 'alive'){
                candidateScore[currentLeader.id] = { score: 2, character: currentLeader };
            }

            for(let i = 0; i < 3; i++){
                let addedCandidate = false;

                for(let j = 0; j < 3; j++){
                    const candidateRoll = Math.floor(Math.random() * potentialCandidates.length);

                    if(!Object.keys(candidateScore).includes(String(potentialCandidates[candidateRoll]))){
                        candidateScore[potentialCandidates[candidateRoll]] = { score: 0, character: { ...currentState.characters.entities[potentialCandidates[candidateRoll]]}};
                        addedCandidate = true;
                    }

                    if(addedCandidate){
                        break;
                    }
                }
            }

            //score candidates
            for(const planetoidId of functionOrg.ownedPlanetoids){
                const planetoid = currentState.planetoids.entities[planetoidId];

                if(!planetoid.population){
                    continue;
                }
                for(const popId of planetoid.population.popIds){
                    let currentFavorite = 0;
                    let topScore = 0;

                    const pop = currentState.pops.entities[popId];

                    for(const key in candidateScore){
                        let voteScore = Math.random() * 4;

                        if(pop.feelings.happiness < 50){ //TODO: example modifier, should depend on candidate traits/ideology
                            voteScore += 1;
                        }

                        //TODO: Characters have homeworlds, get a slight boost here from it being the same as the pop's home'

                        if(voteScore > topScore){
                            currentFavorite = Number(key);
                            topScore = voteScore;
                        }

                    }

                    candidateScore[currentFavorite].score++;
                }
            }

            let winner = 0;
            let winnerScore = 0;

            for(const key in candidateScore){
                if(candidateScore[key].score > winnerScore){
                    winner = candidateScore[key].character.id;
                    winnerScore = candidateScore[key].score;
                }
            }

            return winner;
        }
    }
}
