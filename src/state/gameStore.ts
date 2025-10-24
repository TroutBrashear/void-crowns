import { create } from 'zustand';

import type { GameStoreState, MoveOrderPayload } from '../types/gameState';
import type { Fleet } from '../types/gameState'; 

import { processTick } from '../engine/tick';
import { findPath } from '../engine/pathfinding';

import { normalize } from '../utils/normalize';
import { initialOrgs, initialSystems, initialFleets, initialPlanetoids} from '../data/scenarios/demo';


export const useGameStore = create<GameStoreState>((set, get) => ({


  meta: {
    turn: 1, 
    activeOrgId: 1,
    isPaused: false,
  },
  systems: normalize(initialSystems),
  fleets: normalize(initialFleets),
  orgs: normalize(initialOrgs),
  planetoids: normalize(initialPlanetoids),


  tick: () => {
    const currentState = get();
    const nextState = processTick(currentState);
    set(nextState);
  },

  playPause: () => {
    set((state) => {
      const currentStatus = state.meta.isPaused; 

      return {
        meta: {
          ...state.meta,
          isPaused: !currentStatus,
        }
      };
    });
  },
  

  issueMoveOrder: (payload: MoveOrderPayload) => {
    const currentState = get();
    const { fleetId, targetSystemId } = payload;
    const fleetToUpdate = currentState.fleets.entities[fleetId];
    const newPath = findPath(fleetToUpdate.locationSystemId , targetSystemId, currentState.systems);
    set((state) => {
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


  getFleetById: (id: number) => get().fleets.entities[id],
  getSystemById: (id: number) => get().systems.entities[id],
  getPlanetoidById: (id: number) => get().planetoids.entities[id],
}));