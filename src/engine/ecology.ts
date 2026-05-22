import type { GameState } from '../types/gameState';

export function shiftLanes (currentState: GameState): GameState {
    const lanes = { ...currentState.lanes.entities };
    const laneIds = currentState.lanes.ids;

    for(const laneId of laneIds){
        const lane = lanes[laneId];

        if(lane.status === 'fading'){
            lanes[laneId] = {
                ...lanes[laneId],
                status: 'immaterial',
            };
        }
        else if(lane.status === 'stable'){
            const randomRoll = Math.random() * 100;
            if(randomRoll > 98){
                lanes[laneId] = {
                    ...lanes[laneId],
                    status: 'fading',
                };
            };
        }
        else{
            const randomRoll = Math.random() * 50;
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
