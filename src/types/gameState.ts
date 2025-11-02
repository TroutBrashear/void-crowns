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
  population: number;
}

export interface Fleet {
  id: number;
  name: string;
  ownerNationId: number;
  locationSystemId: number;
  movementPath: number[];
  movesRemaining: number;
}

export type ShipType = 'colony_ship';

export interface Ship {
  id: number;
  name: string;
  type: ShipType;
  ownerNationId: number;
  locationSystemId: number;
  movementPath: number[];
}

export interface Resources {
  credits: number;
}

export interface OrgRelation {
  targetOrgId: number;
  status: 'peace' | 'war';
  opinion: number;
}

export interface Org {
  id: number;
  name: string;
  color: string;
  resources: Resources;

  parentId: number | null;
  childIds: number[];

  relations: OrgRelation[];
}

//a helper that holds information about what a character is currently doing
export interface charAssignment {
  type: string;
  id: number;
}

export interface Character {
  id: number;
  name: string;
  bornTurn: number; //used to calculate age
  traits: string[];
  assignment: charAssignment;
}

export interface EntitiesState<T> {
  entities: { [id: number]: T };
  ids: number[];
}

//defines what users are allowed to select on the map.
export type SelectableEntityType = 'fleet' | 'system' | 'org' | 'ship';

//the object for map selection state
export interface Selection {
  type: SelectableEntityType;
  id: number;
}


export interface MoveOrderPayload {
  fleetId: number;
  targetSystemId: number;
}

export interface DiploStatusPayload {
  actorId: number; 
  targetId: number;
}


//definitions for game events 
export type GameEventType = 'battle_result' | 'construction_complete' | 'insufficient_resources';

export interface GameEvent {
  type: GameEventType;
  message: string;
  
  //WHO should get the message
  involvedOrgIds: number[];
  isPlayerVisible: boolean; 

  //supplementary info may be needed later
  locationId?: number;
}

//return from game engine functions - supports notification through GameEvent[]
export interface EngineResult {
  newState: GameState;
  events: GameEvent[];
}


export interface GameState {
  meta: {
    turn: number;
    activeOrgId: number;
    isPaused: boolean;
    lastFleetId: number;
    lastShipId: number;
  };
  systems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
  planetoids: EntitiesState<Planetoid>;
  ships: EntitiesState<Ship>;

  getFleetById: (id: number) => Fleet | undefined;
  getFleetsBySystem: (id: number) => Fleet[] | undefined;
  getSystemById: (id: number) => System | undefined;
  getPlanetoidById: (id: number) => Planetoid | undefined;
  getOrgById: (id: number) => Org | undefined;
}

export interface GameActions {
  issueMoveOrder: (payload: MoveOrderPayload) => void;
  tick: () => void;
  playPause: () => void;
  buildFleet: (locationId: number) => void;
  buildShip: (payload: { locationId: number, shipType: ShipType }) => void;
  declareWar: (payload: DiploStatusPayload) => void;
  declarePeace: (payload: DiploStatusPayload) => void;
}

export type GameStoreState = GameState & GameActions;