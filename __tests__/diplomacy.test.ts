import { describe, it, expect } from 'vitest';

import { GameState } from '../src/types/gameState';
import { initialOrgs } from '../src/data/scenarios/diploTest';
import { getRelationship } from '../src/engine/diplomacy';

import { normalize } from '../src/utils/normalize';

describe('getRelationship', () => {

    const getNormalizedScenarioState = (): GameState => {
        return {
            orgs: normalize(initialOrgs),
        } as unknown as GameState; //unknown maintains type safety while shedding requirement for complete GameState
    };


    it('should return a valid result for a reciprocal relationship', () => {

        const testState = getNormalizedScenarioState();

        const result = getRelationship(testState, 1, 2);

         expect(result.status).toBe('war');
         expect(result.opinion).toBe(-100);
    })
})
