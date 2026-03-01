import type { AiIntent } from './aiState';

export interface System {
  readonly id: number;
  name: string;
  position: { x: number; y: number };
  adjacentSystemIds: number[];
  adjacentLanes: number[];
  ownerNationId: number | null;
  planetoids: number[]; //the ids of all planetoids in this system
  assignedCharacter: number | null;
  tags: string[];
}

export interface Process {
  input?: Partial<Resources>;
  output?: Partial<Resources>;
}

export interface CharProcess {
	addSkill?: Record<SkillName, number>;
	reduceSkill?: Record<SkillName, number>;
	addTrait?: string[];
	removeTrait?: string[];
    killCharacter?: boolean;
}

export type BuildingClass = 'mine' | 'powerPlant' | 'militaryBase' | 'researchLab';

export interface Building {
  readonly id: number;
  type: BuildingClass;
  ownerNationId: number;
  locationId: number; //a planetoid's ID
  //todo: likely have flags for abilities enabled on a planet - ie: fleet building.

  assignedCharacter: number | null;

  research:{
    progress: number;
    project: string | null; //the id of a research object
  }
}

export type PlanetoidClassification = 'gravWell' | 'planet' | 'moon' | 'asteroid' | 'station';

export interface Planetoid {
  readonly id: number;
  name: string;
  parentPlanetoidId: number | null;
  locationSystemId: number;
  classification: PlanetoidClassification;
  environment: string;
  size: number;
  population: number;
  buildings: number[];
  ownerNationId: number | null;
  tags: string[];
  deposits: Deposit[];
}

export interface Fleet {
  readonly id: number;
  name: string;
  ownerNationId: number;
  locationSystemId: number;
  movementPath: number[]; //ids of systems in order of movement
  movesRemaining: number;
  assignedCharacter: number | null;
}

export type ShipType = 'colony_ship' | 'survey_ship';

export interface Ship {
  readonly id: number;
  name: string;
  type: ShipType;
  ownerNationId: number;
  locationSystemId: number;

  movementPath: number[];

  //some ShipTypes have the potential for an assignedCharacter. - survey_ship
  assignedCharacter: number | null;

  //survey_ship has an assignmentTargetId pointing to the Planetoid it is surveying
  assignmentTargetId: number | null;

  contextHistory: {
    assignmentProgress: number;
  }
}

export interface Resources {
  credits: number;
  rocks: number;
}

export interface Deposit {
  id: number;
  type: string;
  amount: number;
  isVisible: boolean;
  difficulty: number; //an org needs to beat difficulty with a dice roll to reveal the Deposit. Some will be generated with a number higher than can be rolled - can be beaten with tech bonuses later.
}

export interface OrgRelation {
  targetOrgId: number;
  status: 'peace' | 'war';
  opinion: number;
}

export interface Org {
  readonly id: number;
  flavor:{
	name: string;
	color: string;
	nameList: string;
  }
  resources: Resources;

  research: {
    researched: string[];
    researchBonuses: {
      depositSurvey: number;
    }
  }
  characters: {
	characterPool: number[]; //ids in a pool for character recruitment

	leaderId: number | null; //id for leader character
  }

  parentId: number | null;
  childIds: number[];

  diplomacy: {
    relations: OrgRelation[];
    incomingRequests: DiploRequest[];
  }

  contextHistory: {
	previousIncome: Resources;
	buildPlan: AiIntent[];
    targetSystems: number[];
  }

}

export type CharacterAssignment = 'leader' | 'admiral' | 'governor' | 'surveyor' | 'scientist';

//a helper that holds information about what a character is currently doing
export interface charAssignment {
  type: CharacterAssignment;
  id: number;
}

export type SkillName = 'navalCombat' | 'administration' | 'exploration' | 'academics';

export interface Character {
  readonly id: number;
  name: string;
  age: number; 
  traits: string[];
  skills: Record<SkillName, number>;
  assignment: charAssignment | null;
}

//types related to intelligence, fog of war, stength calculations
export interface IntelStatus {
  militaryStrength: number;
}

export interface PlanetoidIntel {
  noProspects: number[];
}

export interface IntelOverall {
  trueStatus: Record<number, IntelStatus>; //number - the target orgId
  planetoidIntel: Record<number, PlanetoidIntel>; //number- the originating orgId and their PERCEPTION of planetoids
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

export type LaneStatus = 'stable' | 'fading' | 'immaterial';

export interface Lane {
  readonly id: number;
  status: LaneStatus;

  //the systems the lane connects
  systemIdA: number;
  systemIdB: number;
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


export type DiploType = 'war' | 'peace';

export interface DiploRequest {
  id: number;
  type: DiploType;
  originOrgId: number;
}

//definitions for game events 
export type GameEventType = 'battle_result' | 'construction_complete' | 'insufficient_resources' | 'diplo_result';

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
    lastDiploId: number;
  };
  systems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
  planetoids: EntitiesState<Planetoid>;
  ships: EntitiesState<Ship>;
  characters: EntitiesState<Character>;
  lanes: EntitiesState<Lane>;
  buildings: EntitiesState<Building>;

  getFleetById: (id: number) => Fleet | undefined;
  getFleetsBySystem: (id: number) => Fleet[] | undefined;
  getSystemById: (id: number) => System | undefined;
  getSystemsByOrg: (id: number) => System[] | undefined;
  getHabitablesInSystem: (id: number) => Planetoid[];
  getPlanetoidsBySystem: (id: number) => Planetoid[];
  getPlanetoidById: (id: number) => Planetoid | undefined;
  getOrgById: (id: number) => Org | undefined;
  getShipById: (id: number) => Ship | undefined;
  getCharacterById: (id: number) => Character | undefined;
  getBuildingById: (id: number) => Building | undefined;

  intelligence: IntelOverall;
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
  processPlayerDiplo: (payload: { requestId: number, accepted: boolean }) => void;
  sendDiploRequest: (payload: {targetOrgId: number, originOrgId: number, requestType: DiploType }) => void;
  colonizePlanetoid: (payload: ColonizePayload) => void;
  beginPlanetoidSurvey: (payload: ColonizePayload) => void;
  initializeNewGame: (payload: {playerOrgName: string, playerOrgColor: string} ) => void;
  assignCharacter: (payload: {charId: number, assignmentTargetId: number, assignmentType: CharacterAssignment}) => void;
  assignResearch: (payload: {buildingId: number, researchId: string }) => void;
  getOrgResearchOptions: (orgId: number) => string[];
}

export type GameStoreState = GameState & GameActions;
