import type { GameState, EngineResult, GameEvent } from '../../types/gameState';
import { averagePopHappiness, findMigrationTarget, migratePop } from '../population';
import { determinePotentialIdeology, spawnMovement } from './movements';
import { spawnCellRandomLeader, selectNewCellAssignment } from './cells';
import { CASSIGNMENT_CATALOG } from '../../data/cellActivities';

export function processPolitics(currentState: GameState ): EngineResult {
    const planetoids = Object.values(currentState.planetoids.entities);
    const allPoliticsEvents: GameEvent[] = [];

     let nextState = { ...currentState };


     //1 - spawning new movements
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

    //2 - spawning new Cells based on movements
    const movements = Object.values(currentState.movements.entities);

    for(const movement of movements){
        if(movement.fervor < 7){
            continue;
        }

        const cellRoll = (Math.random() * 50) + (movement.fervor/2);
        if(cellRoll > 48){
            nextState = spawnCellRandomLeader(nextState, movement.originLocation, 'rebel');
        }
    }

     for(const target of movementTargets){
         const targetIdeology = determinePotentialIdeology(nextState);

         let spawnResults = spawnMovement(nextState, target, targetIdeology);
         nextState = spawnResults.newState;
         allPoliticsEvents.push(spawnResults.event);
    }


    //3 - evaluate Cell assignments
    let incrementDuration: number[] = [];
    const cells = Object.values(currentState.cells.entities);

    for(const cell of cells){
        if(cell.assignment.type === 'idle'){
            //new assignment
            nextState = selectNewCellAssignment(nextState, cell.id);
        }
        else if(cell.assignment.progress === CASSIGNMENT_CATALOG[cell.assignment.type].duration){
            //complete assignment
            nextState = CASSIGNMENT_CATALOG[cell.assignment.type].onComplete(nextState, cell.assignment.target);
        }
        else{
            //progress assignment - deferred to later
            incrementDuration = [ ...incrementDuration, cell.id];
        }
    }

    //evaluation of incrementDurations
    let newCells = { ...nextState.cells.entities };
    for(const cellId of incrementDuration){
        newCells[cellId] = {
            ...newCells[cellId],
            assignment: {
                ...newCells[cellId].assignment,
                progress: newCells[cellId].assignment.progress + 1
            }
        };
    }

    nextState = {
        ...nextState,
        cells: {
            ...nextState.cells,
            entities: newCells
        }
    };

    return { newState: nextState, events: allPoliticsEvents };
}
