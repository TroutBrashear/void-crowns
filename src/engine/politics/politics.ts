import type { GameState, EngineResult, GameEvent } from '../../types/gameState';
import { averagePopHappiness } from '../population';
import { determinePotentialIdeology, spawnMovement } from './movements';

export function processPolitics(currentState: GameState ): EngineResult {
    const planetoids = Object.values(currentState.planetoids.entities);
    const allPoliticsEvents: GameEvent[] = [];

    let movementTargets: number[] = [];

    for(const planetoid of planetoids){
        if(planetoid.population){
            const planetoidPopIds = planetoid.population.popIds;

            const planetoidPops = planetoidPopIds.map(popId => currentState.pops.entities[popId]);

            const planetoidHappiness = averagePopHappiness(planetoidPops);

            if(planetoidHappiness < 25){
                const movementRoll = Math.random() * 10;
                if(movementRoll > 8){
                    movementTargets.push(planetoid.id);
                }
            }
        }
    }

    let nextState = { ...currentState };


     for(const target of movementTargets){
         const targetIdeology = determinePotentialIdeology(nextState);

         let spawnResults = spawnMovement(nextState, target, targetIdeology);
         nextState = spawnResults.newState;
         allPoliticsEvents.push(spawnResults.event);
    }


    return { newState: nextState, events: allPoliticsEvents };
}
