export interface System {
  id: number;
  name: string;
  position: { x: number; y: number };
  adjacentSystemIds: number[];
  ownerNationId: number | null;
  planetoids: number[]; //the ids of all planetoids in this system
}

export type PlanetoidClassification = 'gravWell' | 'planet' | 'moon' | 'asteroid' | 'station';

export interface Planetoid {
  id: number;
  name: string;
  parentPlanetoidId: number | null;
  locationSystemId: number;
  classification: PlanetoidClassification;
  environment: string;
  size: number;
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

//defines what users are allowed to select on the map.
export type SelectableEntityType = 'fleet' | 'system';

//the object for map selection state
export interface Selection {
  type: SelectableEntityType;
  id: number;
}


export interface MoveOrderPayload {
  fleetId: number;
  targetSystemId: number;
}

export interface GameState {
  meta: {
    turn: number;
    activeOrgId: number;
    isPaused: boolean;
  };
  systems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
  planetoids: EntitiesState<Planetoid>;
}

export interface GameActions {
  issueMoveOrder: (payload: MoveOrderPayload) => void;
  tick: () => void;
  playPause: () => void;
}

export type GameStoreState = GameState & GameActions;