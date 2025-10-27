import { create } from 'zustand';

import type { GameStoreState, MoveOrderPayload } from '../types/gameState';
import type { Fleet } from '../types/gameState'; 

//engine imports
import { processTick } from '../engine/tick';
import { findPath } from '../engine/pathfinding';
import { processEconomy } from '../engine/economy';
import { processCombat } from '../engine/combat';

import { normalize } from '../utils/normalize';
import { initialOrgs, initialSystems, initialFleets, initialPlanetoids} from '../data/scenarios/demo';

const FLEET_COST = 10000;

export const useGameStore = create<GameStoreState>((set, get) => ({


  meta: {
    turn: 1, 
    activeOrgId: 1,
    isPaused: false,
    lastFleetId: 2,
  },
  systems: normalize(initialSystems),
  fleets: normalize(initialFleets),
  orgs: normalize(initialOrgs),
  planetoids: normalize(initialPlanetoids),


  tick: () => {
    const currentState = get();
    let nextState = processTick(currentState);

    if(currentState.meta.turn % 10 === 0){
      nextState = processEconomy(nextState);
    }

    nextState = processCombat(nextState);

    nextState = {
      ...nextState,
      meta: {
        ...nextState.meta,
        turn: nextState.meta.turn + 1,
      },
    }
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

  buildFleet: (locationId: number) => {
    set((state) => {
      const buildSystem = state.systems.entities[locationId];

      if(!buildSystem || buildSystem.ownerNationId === null)
      {
        return state;
      }
      const newId = state.meta.lastFleetId + 1;
      const ownerOrg = state.orgs.entities[buildSystem.ownerNationId];

      
      //if the org can't afford the fleet, do nothing.
      if(ownerOrg.resources.credits < FLEET_COST) {
        return state; 
      }

      const newFleet = {
        id: newId,
        fleet: "new Fleet",
        ownerNationId: buildSystem.ownerNationId,
        locationSystemId: locationId,
        movementPath: [],
        movesRemaining: 3,
      };

      const updatedOrg = {
        ...ownerOrg,
        resources: {
          ...ownerOrg.resources,
          credits: ownerOrg.resources.credits - FLEET_COST,
        }
      };

      return {
        fleets: {
          ...state.fleets,
          entities: {
            ...state.fleets.entities,
            [newId]: newFleet,
          },
          ids: [...state.fleets.ids, newId],
        },
        orgs: {
          ...state.orgs,
          entities: {
            ...state.orgs.entities,
            [ownerOrg.id]: updatedOrg,
          }
        },
        meta: {
          ...state.meta,
          lastFleetId: newId,
        },
      };
    });
  },



  //getters
  getFleetById: (id: number) => get().fleets.entities[id],
  getFleetsBySystem: (id: number) => { //good candidate for future optimization.
    const allFleets = Object.values(get().fleets.entities);
    return allFleets.filter(fleet => fleet.locationSystemId === id);
  },
  getSystemById: (id: number) => get().systems.entities[id],
  getPlanetoidById: (id: number) => get().planetoids.entities[id],

  //create
}));