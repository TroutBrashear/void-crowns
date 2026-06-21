import type { GameState, EngineResult, GameEvent } from '../../types/gameState';
import { averagePopHappiness, findMigrationTarget, migratePop } from '../population';
import { determinePotentialIdeology, spawnMovement } from './movements';

export function processPolitics(currentState: GameState ): EngineResult {
    const planetoids = Object.values(currentState.planetoids.entities);
    const allPoliticsEvents: GameEvent[] = [];

     let nextState = { ...currentState };

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

            for(const pop of planetoidPops){
                if(pop.feelings.happiness < 20){
                    const migrationRoll = Math.random() * 100;
                    if(migrationRoll > 98){
                        nextState = migratePop(nextState, pop.id, findMigrationTarget(nextState, pop.id))
                    }
                }
            }
        }
    }




     for(const target of movementTargets){
         const targetIdeology = determinePotentialIdeology(nextState);

         let spawnResults = spawnMovement(nextState, target, targetIdeology);
         nextState = spawnResults.newState;
         allPoliticsEvents.push(spawnResults.event);
    }


    return { newState: nextState, events: allPoliticsEvents };
}
