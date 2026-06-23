import type { CellType, GameState, Cell } from '../../types/gameState';


export function spawnCell(currentState: GameState, planetoidId: number, cellType: CellType): {newState: GameState} {
    const originatingPlanetoid = currentState.planetoids.entities[planetoidId];

    if(!originatingPlanetoid){
        return {newState: currentState };
    }

    let nextId = currentState.meta.lastCellId + 1;

    let newCell: Cell = {
        id: nextId,
        type: cellType,

        strength: 1,

        locationId: planetoidId,

        leader: 0,

        assignment: {
            type: 'idle',
            progress: 0,
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

    return { newState: nextState };
}
