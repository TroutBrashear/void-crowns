import { create } from 'zustand';
import { useUiStore } from '../state/uiStore';

import type { GameStoreState, MoveOrderPayload, ShipMoveOrderPayload, GameEvent, ColonizePayload, Ship, ShipType, BuildingClass } from '../types/gameState';
import type { Fleet } from '../types/gameState'; 

//engine imports
import { processTick } from '../engine/tick';
import { findPath } from '../engine/pathfinding';
import { processEconomy } from '../engine/economy';
import { processCombat } from '../engine/combat';
import { processAiTurn } from '../engine/ai';
import { generateGalaxy, generateStartingOrgs } from '../engine/galaxyGeneration';
import { engineBuildFleet, engineBuildShip, engineBuildBuilding } from '../engine/building';
import { colonizePlanetoid } from '../engine/colonization';

import { normalize } from '../utils/normalize';
import { initialOrgs, initialSystems, initialFleets, initialPlanetoids, initialShips } from '../data/scenarios/demo';


//global unit costs
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
	ships: { entities: {}, ids: [] },
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
    set(engineBuildFleet(get(), locationId));
  },

  buildShip: (payload: { locationId: number, shipType: ShipType }) => {
    set(engineBuildShip(get(), payload.locationId, payload.shipType));
  },
  
  constructBuilding: (payload: { planetoidId: number, buildingType: BuildingClass, orgId: number }) => {
	set(engineBuildBuilding(get(), payload.planetoidId, payload.buildingType, payload.orgId));
  },

   declareWar: ({ actorId, targetId }) => {
    updateBilateralRelation(actorId, targetId, 'war');
  },

  declarePeace: ({ actorId, targetId }) => {
    updateBilateralRelation(actorId, targetId, 'peace');
  },

  colonizePlanetoid: (payload: ColonizePayload) => {
    set(colonizePlanetoid(get(), payload));
  },

  initializeNewGame: () => {
    //currently, generate functions are using a set value. This will later be based on game settings.
    const { systems, planetoids } = generateGalaxy(500);
    const orgs = generateStartingOrgs(4);


    for(const currentOrg of orgs) {
      //temp solution, can randomize later
      systems[currentOrg.id].ownerNationId = currentOrg.id; 

      const homeId = systems[currentOrg.id].planetoids.find(p => {
       const planetoidCandidate = planetoids.find(planetoid => planetoid.id === p);
       return planetoidCandidate && planetoidCandidate.classification === 'planet' && planetoidCandidate.environment !== 'Barren';
      });
      const home = planetoids.find(p => {
        return p.id === homeId;
      });
      if(home){
        home.population = 8000000000;
      }
    }

    set({
      meta: {
        turn: 1,
        activeOrgId: 1,
        isPaused: false, 
        lastFleetId: initialFleets.length,
        lastShipId: 0,
		lastBuildingId: 0,
      },
      systems: normalize(systems),
      fleets: { entities: {}, ids: [] },   
      ships: { entities: {}, ids: [] },
      planetoids: normalize(planetoids),
      orgs: normalize(orgs),
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