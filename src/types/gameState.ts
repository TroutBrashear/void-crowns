export interface System {
  id: number;
  name: string;
  position: { x: number; y: number };
  adjacentSystemIds: number[];
  ownerNationId: number | null;
  //planetoids: Planetoid[];
}

export type PlanetoidClassification = 'gravWell' | 'planet' | 'moon' | 'asteroid' | 'station';

export interface Planetoid {
  id: number;
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
}

export interface GameActions {
  issueMoveOrder: (payload: MoveOrderPayload) => void;
  tick: () => void;
  playPause: () => void;
}

export type GameStoreState = GameState & GameActions;