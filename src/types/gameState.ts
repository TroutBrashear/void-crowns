export interface System {
  id: number;
  name: string;
  position: { x: number; y: number };
  adjacentSystemIds: number[];
  ownerNationId: number | null;
  planetoids: number[]; //the ids of all planetoids in this system
  assignedCharacter: number | null;
}


export interface Process {
  input: Resources;
  output: Resources;
}

export interface CharProcess {
	addSkill?: Record<SkillName, number>;
	reduceSkill?: Record<SkillName, number>;
	addTrait?: string[];
	reduceTrait?: string[];
}

export type BuildingClass = 'mine' | 'powerPlant' | 'militaryBase';

export interface Building {
  id: number;
  type: BuildingClass;
  ownerNationId: number;
  //todo: likely have flags for abilities enabled on a planet - ie: fleet building.
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
  buildings: Building[];
}

export interface Fleet {
  id: number;
  name: string;
  ownerNationId: number;
  locationSystemId: number;
  movementPath: number[]; //ids of systems in order of movement
  movesRemaining: number;
  assignedCharacter: number | null;
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
  rocks: number;
}

export interface OrgRelation {
  targetOrgId: number;
  status: 'peace' | 'war';
  opinion: number;
}

export interface Org {
  id: number;
  flavor:{
	name: string;
	color: string;
	nameList: string;
  }
  resources: Resources;
  characters: {
	characterPool: number[]; //ids in a pool for character recruitment
  }

  parentId: number | null;
  childIds: number[];

  relations: OrgRelation[];
  
  contextHistory: {
	previousIncome: Resources;
	buildPlan: BuildingClass[];
  }
}

//a helper that holds information about what a character is currently doing
export interface charAssignment {
  type: string;
  id: number;
}

export type SkillName = 'navalCombat' | 'administration';

export interface Character {
  id: number;
  name: string;
  age: number; 
  traits: string[];
  skills: Record<SkillName, number>;
  assignment: charAssignment | null;
}

export interface EntitiesState<T> {
  entities: { [id: number]: T };
  ids: number[];
}

//defines what users are allowed to select on the map.
export type SelectableEntityType = 'fleet' | 'system' | 'org' | 'ship' | 'planetoid';

//the object for map selection state
export interface Selection {
  type: SelectableEntityType;
  id: number;
}


export interface MoveOrderPayload {
  fleetId: number;
  targetSystemId: number;
}

export interface ShipMoveOrderPayload {
  shipId: number;
  targetSystemId: number;
}

export interface DiploStatusPayload {
  actorId: number; 
  targetId: number;
}

export interface ColonizePayload {
  shipId: number;
  planetoidId: number;
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
	lastBuildingId: number;
	lastCharacterId: number;
  };
  systems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
  planetoids: EntitiesState<Planetoid>;
  ships: EntitiesState<Ship>;
  characters: EntitiesState<Character>;

  getFleetById: (id: number) => Fleet | undefined;
  getFleetsBySystem: (id: number) => Fleet[] | undefined;
  getSystemById: (id: number) => System | undefined;
  getHabitablesInSystem: (id: number) => Planetoid[];
  getPlanetoidById: (id: number) => Planetoid | undefined;
  getOrgById: (id: number) => Org | undefined;
  getShipById: (id: number) => Ship | undefined;
  getCharacterById: (id: number) => Character | undefined;
}

export interface GameActions {
  issueMoveOrder: (payload: MoveOrderPayload) => void;
  issueShipMoveOrder: (payload: ShipMoveOrderPayload) => void;
  tick: () => void;
  playPause: () => void;
  buildFleet: (locationId: number) => void;
  buildShip: (payload: { locationId: number, shipType: ShipType }) => void;
  constructBuilding: (payload: { planetoidId: number, buildingType: BuildingClass, orgId: number }) => void;
  declareWar: (payload: DiploStatusPayload) => void;
  declarePeace: (payload: DiploStatusPayload) => void;
  colonizePlanetoid: (payload: ColonizePayload) => void;
  initializeNewGame: () => void;
  assignCharacter: (payload: {charId: number, assignmentTargetId: number, assignmentType: string}) => void;
}

export type GameStoreState = GameState & GameActions;