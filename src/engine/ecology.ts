import type { GameState } from '../types/gameState';

export function shiftLanes (currentState: GameState): GameState {
    let lanes = { ...currentState.lanes.entities };
    const laneIds = currentState.lanes.ids;

    for(const laneId of laneIds){
        let lane = lanes[laneId];

        if(lane.status === 'fading'){
            lanes[laneId] = {
                ...lanes[laneId],
                status: 'immaterial',
            };
        }
        else if(lane.status === 'stable'){
            let randomRoll = Math.random() * 100;
            if(randomRoll > 98){
                lanes[laneId] = {
                    ...lanes[laneId],
                    status: 'fading',
                };
            };
        }
        else{
            let randomRoll = Math.random() * 50;
            if(randomRoll > 48){
                lanes[laneId] = {
                    ...lanes[laneId],
                    status: 'stable',
                };
            }
        }
    }

    return {
        ...currentState,
        lanes: {
            ...currentState.lanes,
            entities: lanes,
        }
    };
}
