export interface System {
  id: number;
  name: string;
  position: { x: number; y: number };
  adjacentSystemIds: number[];
  ownerNationId: number | null;
}

export interface Fleet {
  id: number;
  ownerNationId: number;
  locationSystemId: number;
  movementPath: number[];
  movesRemaining: number;
}

export interface Org {
  id: number;
  name: string;
  color: string;
}