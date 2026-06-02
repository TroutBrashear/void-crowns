import type { GameState } from '../types/gameState';

import { CYCLE_CONFIG } from '../constants/cycle_config';

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
            if(randomRoll > (100 - CYCLE_CONFIG.ECOLOGY.LANE_FADE_CHANCE)){
                lanes[laneId] = {
                    ...lanes[laneId],
                    status: 'fading',
                };
            };
        }
        else{
            const randomRoll = Math.random() * 100;
            if(randomRoll > (100 - CYCLE_CONFIG.ECOLOGY.LANE_STABLE_CHANCE)){
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
