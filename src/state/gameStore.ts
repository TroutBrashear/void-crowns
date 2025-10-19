import { create } from 'zustand';

import type { GameStoreState, MoveOrderPayload } from '../types/gameState';
import type { Fleet } from '../types/gameState'; 

import { processTick } from '../engine/tick';

import { normalize } from '../utils/normalize';
import { initialOrgs, initialSystems, initialFleets } from '../data/scenarios/demo';


export const useGameStore = create<GameStoreState>((set, get) => ({


  meta: {
    turn: 1, 
    activeOrgId: 1,
  },
  systems: normalize(initialSystems),
  fleets: normalize(initialFleets),
  orgs: normalize(initialOrgs),

  tick: () => {
    const currentState = get();
    const nextState = processTick(currentState);
    
    set(nextState);
  },
  issueMoveOrder: (payload: MoveOrderPayload) => {
    const { fleetId, targetSystemId } = payload;

    const newPath = [targetSystemId];
    set((state) => {
      const fleetToUpdate = state.fleets.entities[fleetId];
      const updatedFleet: Fleet = {
        ...fleetToUpdate,
        movementPath: newPath,
      };

      console.log(fleetId);
      console.log(targetSystemId);

      return {
        fleets: {
          ...state.fleets,
          entities: {
            ...state.fleets.entities,
            [fleetId]: updatedFleet,
          },
        },
      };
    });
  },

}));