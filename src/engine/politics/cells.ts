import type { GameState } from '../../types/gameState';
import type { CellType, Cell, CellAssignmentType } from '../../types/govState';
import { generateCharacter } from '../character';


export function selectNewCellAssignment(currentState: GameState, cellId: number): GameState {
    let cell = { ...currentState.cells.entities[cellId] };

    if(cell.type === 'rebel'){
       const possAssignments: CellAssignmentType[] = [ "assassinateGovernor", "gatherStrength"];
        const assignmentRoll = Math.random() * possAssignments.length;

        let assignmentTarget = cellId;

        if(possAssignments[assignmentRoll] === 'assassinateGovernor'){
            assignmentTarget = cell.locationId;
        }

        cell = {
            ...cell,
            assignment: {
                ...cell.assignment,
                type: possAssignments[assignmentRoll],
                progress: 0,
                target: assignmentTarget
            }
        };
    }

    return {
        ...currentState,
        cells: {
            ...currentState.cells,
            entities: {
                ...currentState.cells.entities,
                [cellId]: cell
            }
        }
    }

}

export function spawnCellRandomLeader(currentState: GameState, planetoidId: number, cellType: CellType): GameState {

    let nextId = currentState.meta.lastCharacterId + 1;

    let leader = generateCharacter(nextId, 'default');

    let nextState = {
        ...currentState,
        meta: {
            ...currentState.meta,
            lastCharacterId: nextId,
        },
        characters: {
            ids: [...currentState.characters.ids, leader.id],
            entities: {
                ...currentState.characters.entities,
                [leader.id]: leader
            }
        }
    };

    return spawnCell(nextState, planetoidId, cellType, leader.id);
}


export function spawnCell(currentState: GameState, planetoidId: number, cellType: CellType, leaderId: number): GameState {
    const originatingPlanetoid = currentState.planetoids.entities[planetoidId];

    if(!originatingPlanetoid){
        return currentState;
    }

    let nextId = currentState.meta.lastCellId + 1;

    let newCell: Cell = {
        id: nextId,
        type: cellType,

        strength: 1,

        locationId: planetoidId,

        leader: leaderId,

        assignment: {
            type: 'idle',
            progress: 0,
            target: nextId
        }
    }

    let nextState =  {
        ...currentState,
        meta: {
            ...currentState.meta,
            lastCellId: nextId,
        },
        cells: {
            ids: [...currentState.cells.ids, nextId],
            entities: {
                ...currentState.cells.entities,
                [nextId]: newCell
            }
        }
    };

    return nextState;
}
