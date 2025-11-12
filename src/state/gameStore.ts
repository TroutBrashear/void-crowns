import { create } from 'zustand';
import { useUiStore } from '../state/uiStore';

import type { GameStoreState, MoveOrderPayload, ShipMoveOrderPayload, GameEvent, ColonizePayload } from '../types/gameState';
import type { Fleet } from '../types/gameState'; 

//engine imports
import { processTick } from '../engine/tick';
import { findPath } from '../engine/pathfinding';
import { processEconomy } from '../engine/economy';
import { processCombat } from '../engine/combat';
import { processAiTurn } from '../engine/ai';
import { generateGalaxy } from '../engine/galaxyGeneration';

import { normalize } from '../utils/normalize';
import { initialOrgs, initialSystems, initialFleets, initialPlanetoids, initialShips } from '../data/scenarios/demo';

const FLEET_COST = 10000;
const COL_SHIP_COST = 15000;

export const useGameStore = create<GameStoreState>((set, get) => {
  //initial setup


  const updateBilateralRelation = (firstOrgId: number, secondOrgId: number, newStatus: 'war' | 'peace') => {
    set((state) => {
        const firstOrg = state.orgs.entities[firstOrgId];
        const secondOrg = state.orgs.entities[secondOrgId];

        if (!firstOrg || !secondOrg){
          return state;
        }

        const firstUpdatedRel = firstOrg.relations.map(rel => 
          rel.targetOrgId === secondOrgId ? { ...rel, status: newStatus } : rel
        ); 

        const secondUpdatedRel = secondOrg.relations.map(rel => 
          rel.targetOrgId === firstOrgId ? { ...rel, status: newStatus } : rel
        );

        const updatedFirstOrg = { ...firstOrg, relations: firstUpdatedRel };
        const updatedSecondOrg = { ...secondOrg, relations: secondUpdatedRel };

        console.log(updatedFirstOrg);
        return {
          orgs: {
            ...state.orgs,
            entities: {
              ...state.orgs.entities,
              [firstOrgId]: updatedFirstOrg,
              [secondOrgId]: updatedSecondOrg,
          },
        },
      };
    });
  };

  return {
    //this is now initialized empty because we start on the main menu.
    meta: {
     turn: 0,
     activeOrgId: 0,
     isPaused: true,
     lastFleetId: 0,
     lastShipId: 0,
    },
    systems: { entities: {}, ids: [] }, 
    fleets: { entities: {}, ids: [] },   
    orgs: normalize(initialOrgs),       
    planetoids: { entities: {}, ids: [] },
    fleetLocationIndex: {},   


  tick: () => {
    const currentState = get();
    let nextState = processTick(currentState);
    let tickEvents: GameEvent[] = [];

    if(currentState.meta.turn % 10 === 0){
      nextState = processEconomy(nextState);
    }

    const combatResults = processCombat(nextState);
    nextState = combatResults.newState;
    tickEvents.push(...combatResults.events);

    for(const orgId of nextState.orgs.ids){
      if(orgId !== 1){
        nextState = processAiTurn(nextState, orgId);
      }
    }
    console.log(tickEvents);

    const playerEvents = tickEvents.filter(event => { 
        console.log(`Filtering event. Message: "${event.message}". isPlayerVisible: ${event.isPlayerVisible}. Type: ${typeof event.isPlayerVisible}`);

        return event.isPlayerVisible});
    console.log(playerEvents);
    //display some notifications based on things that occured this tick
    if(playerEvents.length > 0) {
      const { showNotification } = useUiStore.getState();
      console.log("notification triggered!");
      showNotification({
        type: 'info',
        message: playerEvents[0].message,
      })

    }


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

  issueShipMoveOrder: (payload: ShipMoveOrderPayload) => {
    const currentState = get();
    const { shipId, targetSystemId } = payload;
    const shipToUpdate = currentState.ships.entities[shipId];
    const newPath = findPath(shipToUpdate.locationSystemId , targetSystemId, currentState.systems);
    set((state) => {
      const updatedShip: Ship = {
        ...shipToUpdate,
        movementPath: newPath,
      };

      return {
        ships: {
          ...state.ships,
          entities: {
            ...state.ships.entities,
            [shipId]: updatedShip,
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
        name: "new Fleet",
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

  buildShip: (payload: { locationId: number, shipType: ShipType }) => {
    set((state) => {
      const buildSystem = state.systems.entities[payload.locationId];

      if(!buildSystem || buildSystem.ownerNationId === null)
      {
        return state;
      }
      const newId = state.meta.lastShipId + 1;
      const ownerOrg = state.orgs.entities[buildSystem.ownerNationId];

      let cost: number = 0;

      switch(payload.shipType){
        case 'colony_ship':
          cost = COL_SHIP_COST;
          break;
      }


      //if the org can't afford the fleet, do nothing.
      if(ownerOrg.resources.credits < cost) {
        return state; 
      }

      const newShip = {
        id: newId,
        name: "new Ship",
        type: payload.shipType,
        ownerNationId: buildSystem.ownerNationId,
        locationSystemId: payload.locationId,
        movementPath: [],
        };

      const updatedOrg = {
        ...ownerOrg,
        resources: {
          ...ownerOrg.resources,
          credits: ownerOrg.resources.credits - cost,
        }
      };

      return {
        ships: {
          ...state.ships,
          entities: {
            ...state.ships.entities,
            [newId]: newShip,
          },
          ids: [...state.ships.ids, newId],
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
          lastShipId: newId,
        },
      };
    });
  },

   declareWar: ({ actorId, targetId }) => {
    updateBilateralRelation(actorId, targetId, 'war');
  },

  declarePeace: ({ actorId, targetId }) => {
    updateBilateralRelation(actorId, targetId, 'peace');
  },

  colonizePlanetoid: (payload: ColonizePayload) => {
    set((state) => {
      const planetoid = state.planetoids.entities[payload.planetoidId]; //the target planetoid (will receive population update - for now, an onwed system disables colonization within that system.)
      const ship = state.ships.entities[payload.shipId]; //the colony ship will be used up and removed from the game
      const system = state.systems.entities[planetoid.locationSystemId]; //we may return the system with a new onwer

      if(!planetoid) {
        return state;
      }

      const updatedSystem = {
        ...system,
        ownerNationId: ship.ownerNationId,
      }; 

      const updatedPlanetoid = {
        ...planetoid,
        population: 200000,
      };

      const shipEntities = { ...state.ships.entities };
      const shipIds = [...state.ships.ids];
      delete shipEntities[ship.id];
      shipIds.splice(shipIds.indexOf(ship.id), 1);

      return  {
        planetoids: {
          ...state.planetoids,
          entities: {
            ...state.planetoids.entities,
            [payload.planetoidId]: updatedPlanetoid,
          },
        },
        systems: {
          ...state.systems,
          entities: {
            ...state.systems.entities,
            [planetoid.locationSystemId]: updatedSystem,
          },
        },
        ships: {
          entities: shipEntities,
          ids: shipIds,
        }
      };     
    });
  },

  initializeNewGame: () => {
    const systems = generateGalaxy(2000);

    systems[0].ownerNationId = 1;


    set({
      meta: {
        turn: 1,
        activeOrgId: 1,
        isPaused: false, 
        lastFleetId: initialFleets.length,
        lastShipId: 0,
      },
      systems: normalize(systems),
      fleets: { entities: {}, ids: [] },   
      ships: { entities: {}, ids: [] },
      planetoids: { entities: {}, ids: [] },
      //TODO: planetoids generation
      //TODO: org generation
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
  getOrgById: (id: number) => get().orgs.entities[id],
  getShipById: (id: number) => get().ships.entities[id],

  getHabitablesInSystem: (id: number) => {
    const state = get();
    const system = state.systems.entities[id];
    console.log(system);
    if(!system) {
      return [];
    }

     if (system.ownerNationId !== null) {
      return [];
    }

    return system.planetoids.map(planetoidId => state.planetoids.entities[planetoidId]).filter(planetoid => {
      if(planetoid.environment !== 'Barren'){
        return planetoid;
      }
    })
  },


  //removers

  };
});