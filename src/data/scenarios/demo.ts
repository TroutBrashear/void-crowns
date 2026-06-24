import type { Species } from '../../types/gameState';
import type { Org } from '../../types/govState';
import type { Planetoid, Lane, System } from '../../types/geoState';
import type { Fleet, Ship, MilShip } from '../../types/shipTypes';

export const initialOrgs: Org[] = [
  { id: 1, category: 'nationState', flavor: { name: 'Human Republic', color: '#3498db', nameList: 'default'}, government: { succession: 'monarchy', homeSystem: 1 }, resources: { credits: 100, rocks: 0, gas: 0 }, characters: {characterPool: [], leaderId: null}, parentId: null, childIds: [], diplomacy: {relations: {2: { targetOrgId: 2, status: 'war', opinion: -100 }}, incomingRequests: [], residentDiplomats: []}, contextHistory: {previousIncome: { credits: 100, rocks: 0, gas: 0 }, buildPlan: [], targetSystems: [] }, research: { researched: [], researchBonuses: { depositSurvey: 0, fleetCombat: 0 }} },
  { id: 2, category: 'nationState', flavor: { name: 'Alien Imperium', color: '#e74c3c', nameList: 'default'}, government: { succession: 'monarchy', homeSystem: 4 }, resources: { credits: 100, rocks: 0, gas: 0 }, characters: {characterPool: [], leaderId: null}, parentId: null, childIds: [], diplomacy: {relations: {1: { targetOrgId: 1, status: 'war', opinion: -100 }}, incomingRequests: [], residentDiplomats: []}, contextHistory: {previousIncome: { credits: 100, rocks: 0, gas: 0 }, buildPlan: [], targetSystems: [] }, research: { researched: [], researchBonuses: { depositSurvey: 0, fleetCombat: 0 }} },
];

export const initialSystems: System[] = [
  { id: 1, name: 'Sol', position: { x: 100, y: 300 }, adjacentSystemIds: [2], adjacentLanes: [1], ownerNationId: 1, planetoids: [101, 102, 103, 104, 105], assignedCharacter: null, tags: []},
  { id: 2, name: 'Alpha Centauri', position: { x: 250, y: 350 }, adjacentSystemIds: [1, 3], adjacentLanes: [1, 2], ownerNationId: null, planetoids: [201, 202, 203, 204], assignedCharacter: null, tags: [] },
  { id: 3, name: 'Sirius', position: { x: 400, y: 300 }, adjacentSystemIds: [2, 4], adjacentLanes: [2, 3], ownerNationId: null, planetoids: [301, 302, 303, 304], assignedCharacter: null, tags: [] },
  { id: 4, name: 'Procyon', position: { x: 550, y: 350 }, adjacentSystemIds: [3], adjacentLanes: [3], ownerNationId: 2, planetoids: [401, 402, 403], assignedCharacter: null, tags: [] },
];

export const initialPlanetoids: Planetoid[] = [
  // === Sol System (ID: 1) ===
  { id: 101, name: 'Sol', parentPlanetoidId: null, locationSystemId: 1, classification: 'gravWell', environment: 'Star', size: 100, ownerNationId: 0, buildings: [], structures: {
    habitats: 0
  },tags: [], deposits: [], resources: {}},
{ id: 102, name: 'Earth', parentPlanetoidId: 101, locationSystemId: 1, classification: 'planet', environment: 'Terran', size: 5, ownerNationId: 1, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {}},
{ id: 103, name: 'Luna', parentPlanetoidId: 102, locationSystemId: 1, classification: 'moon', environment: 'Barren', size: 1, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 104, name: 'Mars', parentPlanetoidId: 101, locationSystemId: 1, classification: 'planet', environment: 'Arid', size: 4, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 105, name: 'Gagarin Station', parentPlanetoidId: 102, locationSystemId: 1, classification: 'station', environment: 'Orbital', size: 2,  ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
  
  // === Alpha Centauri System (ID: 2) ===
{ id: 201, name: 'Alpha Centauri', parentPlanetoidId: null, locationSystemId: 2, classification: 'gravWell', environment: 'Star', size: 90, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {}},
{ id: 202, name: 'Proxima b', parentPlanetoidId: 201, locationSystemId: 2, classification: 'planet', environment: 'Volcanic', size: 6,  ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 203, name: 'Mining Outpost Delta', parentPlanetoidId: 202, locationSystemId: 2, classification: 'station', environment: 'Orbital', size: 1, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 204, name: 'The Void', parentPlanetoidId: 201, locationSystemId: 2, classification: 'asteroid', environment: 'Asteroid Belt', size: 3, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [] ,  resources: {}},
  
  // === Sirius System (ID: 3) ===
{ id: 301, name: 'Sirius', parentPlanetoidId: null, locationSystemId: 3, classification: 'gravWell', environment: 'Star', size: 120,  ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 302, name: 'Aethel', parentPlanetoidId: 301, locationSystemId: 3, classification: 'planet', environment: 'Gas Giant', size: 20, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 303, name: 'Aethel I', parentPlanetoidId: 302, locationSystemId: 3, classification: 'moon', environment: 'Frozen', size: 2,  ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 304, name: 'Aethel II', parentPlanetoidId: 302, locationSystemId: 3, classification: 'moon', environment: 'Frozen', size: 2, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },

  // === Procyon System (ID: 4) ===
{ id: 401, name: 'Procyon', parentPlanetoidId: null, locationSystemId: 4, classification: 'gravWell', environment: 'Star', size: 80, ownerNationId: 2, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 402, name: 'Xylos', parentPlanetoidId: 401, locationSystemId: 4, classification: 'planet', environment: 'Jungle', size: 7, ownerNationId: 0, buildings: [], structures: {
  habitats: 0
},tags: [], deposits: [],  resources: {} },
{ id: 403, name: 'Imperial Citadel', parentPlanetoidId: 402, locationSystemId: 4, classification: 'station', environment: 'Orbital Citadel', size: 5, ownerNationId: 0, buildings: [],structures: {
  habitats: 0
}, tags: [], deposits: [],  resources: {} },
];

export const initialFleets: Fleet[] = [
  { id: 1, name: "human fleet", ownerNationId: 1, locationSystemId: 1, movementPath: [], movesRemaining: 3, assignedCharacter: null, contextHistory: { previousSystemId: 1 }, ships: [] },
  { id: 2, name: "alien fleet", ownerNationId: 2, locationSystemId: 4, movementPath: [], movesRemaining: 3, assignedCharacter: null, contextHistory: { previousSystemId: 4 }, ships: [] },
];

export const initialLanes: Lane[] = [
  { id: 1, status: "stable", anchorOrigin: null, systemIdA: 1, systemIdB: 2},
  { id: 2, status: "stable", anchorOrigin: null, systemIdA: 2, systemIdB: 3},
  { id: 3, status: "stable", anchorOrigin: null, systemIdA: 3, systemIdB: 4}
];

export const initialShips: Ship[] = [];

export const initialMilShips: MilShip[] = [];

export const initialSpecies: Species[] = [];
