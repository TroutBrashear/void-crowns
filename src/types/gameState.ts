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

export interface EntitiesState<T> {
  entities: { [id: number]: T };
  ids: number[];
}

export interface MoveOrderPayload {
  fleetId: number;
  targetSystemId: number;
}

export interface GameState {
  meta: {
    turn: number;
    activeOrgId: number;
  };
  systems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
}

export interface GameActions {
  issueMoveOrder: (payload: MoveOrderPayload) => void;
  tick: () => void;
}

export type GameStoreState = GameState & GameActions;