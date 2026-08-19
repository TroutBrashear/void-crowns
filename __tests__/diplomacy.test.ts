import { describe, it, expect } from 'vitest';

import { GameState } from '../src/types/gameState';
import { initialOrgs } from '../src/data/scenarios/diploTest';
import { engineUpdateRelationship, getRelationship } from '../src/engine/diplomacy';

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
    }),

    it('should return a peace result if the target Org cannot be found.', () => {
        const testState = getNormalizedScenarioState();

        const result = getRelationship(testState, 1, 4);

        expect(result.status).toBe('peace');
    }),

    it('should return a war result if Org relations are mismatched and one is war', () => {
        const testState = getNormalizedScenarioState();

        const result = getRelationship(testState, 1, 3)
        const inverseResult = getRelationship(testState, 3, 1);

        expect(result.status).toBe('war');
        expect(inverseResult.status).toBe('war');
    })
})

describe('updateRelationship', () => {
    const getNormalizedScenarioState = (): GameState => {
        return {
            orgs: normalize(initialOrgs),
        } as unknown as GameState; //unknown maintains type safety while shedding requirement for complete GameState
    };

    it('should successfully update Org relationship when both Orgs exist', () => {
        let testState = getNormalizedScenarioState();

        testState = engineUpdateRelationship(testState, 1, 2, 'peace');

        expect(getRelationship(testState, 1, 2).status).toBe('peace');
    })
})
