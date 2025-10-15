import type { System, Fleet, Org } from '../../types/gameState';

export const initialOrgs: Org[] = [
  { id: 1, name: 'Human Republic', color: '#3498db' },
  { id: 2, name: 'Alien Imperium', color: '#e74c3c' },
];

export const initialSystems: System[] = [
  { id: 1, name: 'Sol', position: { x: 100, y: 300 }, adjacentSystemIds: [2], ownerNationId: 1 },
  { id: 2, name: 'Alpha Centauri', position: { x: 250, y: 350 }, adjacentSystemIds: [1, 3], ownerNationId: null },
  { id: 3, name: 'Sirius', position: { x: 400, y: 300 }, adjacentSystemIds: [2, 4], ownerNationId: null },
  { id: 4, name: 'Procyon', position: { x: 550, y: 350 }, adjacentSystemIds: [3], ownerNationId: 2 },
  ];

export const initialFleets: Fleet[] = [
  { id: 1, ownerNationId: 1, locationSystemId: 1, movementPath: [], movesRemaining: 3 },
  { id: 2, ownerNationId: 2, locationSystemId: 4, movementPath: [], movesRemaining: 3 },
];