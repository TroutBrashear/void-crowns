import type { System, Fleet, Org, Planetoid, Ship } from '../../types/gameState';

export const initialOrgs: Org[] = [
  { id: 1,  flavor: { name: 'Human Republic', color: '#3498db', nameList: 'default'}, resources: { credits: 100, rocks: 0 }, characters: {characterPool: []}, parentId: null, childIds: [], relations: [{ targetOrgId: 2, status: 'war', opinion: -100 }], contextHistory: {previousIncome: { credits: 100, rocks: 0 }, buildPlan: [],} },
  { id: 2, flavor: { name: 'Alien Imperium', color: '#e74c3c', nameList: 'default'}, resources: { credits: 100, rocks: 0 }, characters: {characterPool: []}, parentId: null, childIds: [], relations: [{ targetOrgId: 1, status: 'war', opinion: -100 }], contextHistory: {previousIncome: { credits: 100, rocks: 0 }, buildPlan: [],}},
];

export const initialSystems: System[] = [
  { id: 1, name: 'Sol', position: { x: 100, y: 300 }, adjacentSystemIds: [2], ownerNationId: 1, planetoids: [101, 102, 103, 104, 105], assignedCharacter: null },
  { id: 2, name: 'Alpha Centauri', position: { x: 250, y: 350 }, adjacentSystemIds: [1, 3], ownerNationId: null, planetoids: [201, 202, 203, 204], assignedCharacter: null },
  { id: 3, name: 'Sirius', position: { x: 400, y: 300 }, adjacentSystemIds: [2, 4], ownerNationId: null, planetoids: [301, 302, 303, 304], assignedCharacter: null },
  { id: 4, name: 'Procyon', position: { x: 550, y: 350 }, adjacentSystemIds: [3], ownerNationId: 2, planetoids: [401, 402, 403], assignedCharacter: null },
];

export const initialPlanetoids: Planetoid[] = [
  // === Sol System (ID: 1) ===
  { id: 101, name: 'Sol', parentPlanetoidId: null, locationSystemId: 1, classification: 'gravWell', environment: 'Star', size: 100, population: 0, buildings: []},
  { id: 102, name: 'Earth', parentPlanetoidId: 101, locationSystemId: 1, classification: 'planet', environment: 'Terran', size: 5, population: 8000000000, buildings: [] },
  { id: 103, name: 'Luna', parentPlanetoidId: 102, locationSystemId: 1, classification: 'moon', environment: 'Barren', size: 1, population: 0, buildings: [] },
  { id: 104, name: 'Mars', parentPlanetoidId: 101, locationSystemId: 1, classification: 'planet', environment: 'Arid', size: 4, population: 0, buildings: [] },
  { id: 105, name: 'Gagarin Station', parentPlanetoidId: 102, locationSystemId: 1, classification: 'station', environment: 'Orbital', size: 2, population: 0, buildings: [] },
  
  // === Alpha Centauri System (ID: 2) ===
  { id: 201, name: 'Alpha Centauri', parentPlanetoidId: null, locationSystemId: 2, classification: 'gravWell', environment: 'Star', size: 90, population: 0, buildings: [] },
  { id: 202, name: 'Proxima b', parentPlanetoidId: 201, locationSystemId: 2, classification: 'planet', environment: 'Volcanic', size: 6, population: 0, buildings: [] },
  { id: 203, name: 'Mining Outpost Delta', parentPlanetoidId: 202, locationSystemId: 2, classification: 'station', environment: 'Orbital', size: 1, population: 0, buildings: [] },
  { id: 204, name: 'The Void', parentPlanetoidId: 201, locationSystemId: 2, classification: 'asteroid', environment: 'Asteroid Belt', size: 3, population: 0, buildings: [] },
  
  // === Sirius System (ID: 3) ===
  { id: 301, name: 'Sirius', parentPlanetoidId: null, locationSystemId: 3, classification: 'gravWell', environment: 'Star', size: 120, population: 0, buildings: [] },
  { id: 302, name: 'Aethel', parentPlanetoidId: 301, locationSystemId: 3, classification: 'planet', environment: 'Gas Giant', size: 20, population: 0, buildings: [] },
  { id: 303, name: 'Aethel I', parentPlanetoidId: 302, locationSystemId: 3, classification: 'moon', environment: 'Frozen', size: 2, population: 0, buildings: [] },
  { id: 304, name: 'Aethel II', parentPlanetoidId: 302, locationSystemId: 3, classification: 'moon', environment: 'Frozen', size: 2, population: 0, buildings: [] },

  // === Procyon System (ID: 4) ===
  { id: 401, name: 'Procyon', parentPlanetoidId: null, locationSystemId: 4, classification: 'gravWell', environment: 'Star', size: 80, population: 10000000000, buildings: [] },
  { id: 402, name: 'Xylos', parentPlanetoidId: 401, locationSystemId: 4, classification: 'planet', environment: 'Jungle', size: 7, population: 0, buildings: [] },
  { id: 403, name: 'Imperial Citadel', parentPlanetoidId: 402, locationSystemId: 4, classification: 'station', environment: 'Orbital Citadel', size: 5, population: 0, buildings: [] },
];

export const initialFleets: Fleet[] = [
  { id: 1, name: "human fleet", ownerNationId: 1, locationSystemId: 1, movementPath: [], movesRemaining: 3, assignedCharacter: null },
  { id: 2, name: "alien fleet", ownerNationId: 2, locationSystemId: 4, movementPath: [], movesRemaining: 3, assignedCharacter: null },
];

export const initialShips: Ship[] = [];