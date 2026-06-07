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
  goodsOutput?: Record<number, number>; //Good.id and amount produced
}

export interface CharProcess {
	addSkill?: Record<SkillName, number>;
	reduceSkill?: Record<SkillName, number>;
	addTrait?: string[];
	removeTrait?: string[];
    killCharacter?: boolean;
}

export type BuildingClass = 'mine' | 'gasWell' |  'powerPlant' | 'militaryBase' | 'researchLab' | 'farm' | 'consumerFactory' | 'navalAcademy' | 'scienceAcademy';

export interface Building {
  readonly id: number;
  type: BuildingClass;
  ownerNationId: number;
  locationId: number; //a planetoid's ID
  tags: string[];

  assignedCharacter: number | null;

  research:{
    progress: number;
    project: string | null; //the id of a research object
  }
}

export type PlanetoidClassification = 'gravWell' | 'planet' | 'moon' | 'asteroid' | 'station' | 'anchor' | 'debris';

export interface Planetoid {
  readonly id: number;
  name: string;
  parentPlanetoidId: number | null;
  locationSystemId: number;
  classification: PlanetoidClassification;
  environment: string;
  size: number;
  buildings: number[];
  ownerNationId: number | null;
  population?: {
    total: number;
    progress: number;
  }
  tags: string[];
  deposits: Deposit[];
  resources: {
    goodsStockpiles?: Record< number, Record<number, number>>; //number #1 is a Good.id, number #2 is the amount stored
  }
  construct?: {
    anchorTarget?: number; //a Lane id
    shipDebris?: number[]; //array of ships contained in a debris field
  }
}

export type LaneStatus = 'stable' | 'fading' | 'immaterial' | 'anchored';

export interface Lane {
  readonly id: number;
  status: LaneStatus;

  anchorOrigin: number | null;

  //the systems the lane connects
  systemIdA: number;
  systemIdB: number;
}

//---------------SHIPS AND FLEETS---------------------
export interface Fleet {
  readonly id: number;
  name: string;
  ownerNationId: number;
  locationSystemId: number;
  movementPath: number[]; //ids of systems in order of movement
  movesRemaining: number;
  assignedCharacter: number | null;

  ships: number[]; //ids of MilShips assigned to this fleet

  contextHistory: {
    previousSystemId: number;
  }
}

export type MilShipType = 'destroyer' | 'cruiser' | 'battleship';
export type MilShipStatus = 'active' | 'mothball' | 'wreck';

export interface MilShip {
  readonly id: number;
  flavor: {
    name: string;
    traits: string[];
    type: MilShipType;
  }

  stats: {
    size: number;
    speed: number;
    strength: number;
  }

  ownerNationId: number;
  parentFleet: number | null;
  status: MilShipStatus;

  assignedCharacter: number | null;

  history: {
    events: string[];
    statusChange: number; //documents the turn the last status change occurred, mostly to prevent new traits from developing too quickly
  }
}

export type ShipType = 'colony_ship' | 'survey_ship' | 'construction_ship';

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


//------------ECONOMY------------------
export interface Resources {
  credits: number;
  rocks: number;
  gas: number;
}

export interface Deposit {
  id: number;
  type: string;
  amount: number;
  isVisible: boolean;
  difficulty: number; //an org needs to beat difficulty with a dice roll to reveal the Deposit. Some will be generated with a number higher than can be rolled - can be beaten with tech bonuses later.
}

export type GoodCategory = 'food' | 'homeGoods';

export interface Good {
  readonly id: number;
  name: string;
  type: GoodCategory;
  traits: string[];
}

//-----------POPULATION AND SPECIES-------------------
export interface Species {
  readonly id: number;
  name: string;
  traits: string[];
  baseNeeds: Record<GoodCategory, number>;
}

export interface Pop {
  readonly id: number;
  species: number; //a species id
  locationId: number; //a planetoid id
}

//-----------ORGS (NATIONS, CORPORATIONS, FACTIONS, ETC)------------------
export type OrgCategory = 'nationState' | 'corporation';

export interface OrgRelation {
  targetOrgId: number;
  status: 'peace' | 'war';
  opinion: number;
}


export interface Org {
  readonly id: number;
  category: OrgCategory;

  flavor:{
	name: string;
	color: string;
	nameList: string;
  }
  government: {
    succession: string;
  }


  resources: Resources;

  research: {
    researched: string[];
    researchBonuses: {
      depositSurvey: number;
      fleetCombat: number;
    }
  }
  characters: {
	characterPool: number[]; //ids in a pool for character recruitment

	leaderId: number | null; //id for leader character
  }

  parentId: number | null;
  childIds: number[];

  diplomacy: {
    relations: Record<number, OrgRelation>;
    incomingRequests: DiploRequest[];
    residentDiplomats: number[];
  }

  contextHistory: {
	previousIncome: Resources;
	buildPlan: AiIntent[];
    targetSystems: number[];
  }

}

export type CharacterAssignment = 'leader' | 'admiral' | 'governor' | 'surveyor' | 'scientist' | 'academyPresident' | 'diplomat';


//a helper that holds information about what a character is currently doing
export interface charAssignment {
  type: CharacterAssignment;
  id: number;
  duration?: number; //turn that the character's assignment will end - used for Mission-based Assignments
}

export type SkillName = 'navalCombat' | 'administration' | 'exploration' | 'academics' | 'diplomacy';

export type Ideology = 'monarchist' | 'authoritarian' | 'republican' | 'corporate';

export type CharacterStatus = 'alive' | 'dead';

export interface Character {
  readonly id: number;

  status: CharacterStatus;

  name: {
    firstName: string;
    lastName: string;
  }
  age: number; 
  traits: string[];
  skills: Record<SkillName, number>;
  assignment: charAssignment | null;

  citizenOrg: number | null; //refers to the Org this character is a part of

  politics: {
    leaning: Ideology;
  }

  history: {
    events: string[];
    parentId?: number;
    childrenIds: number[];
  }
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
export type SelectableEntityType = 'fleet' | 'system' | 'org' | 'ship' | 'planetoid' | 'building';

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


export type DiploType = 'war' | 'peace' | 'trade';

export interface DiploRequest {
  id: number;
  type: DiploType;
  originOrgId: number;
  targetOrgId: number;
  trade?: {
    senderProcess: Process;
    targetProcess: Process;
  }
}

//definitions for game events 
export type GameEventType = 'battle_result' | 'construction_complete' | 'research_complete' | 'insufficient_resources' | 'diplo_result' | 'char_result';

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
    lastMilShipId: number;
	lastBuildingId: number;
	lastCharacterId: number;
    lastDiploId: number;
    lastPlanetoidId: number;
    lastOrgId: number;
    lastSpeciesId: number;
    lastPopId: number;
  };
  systems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
  planetoids: EntitiesState<Planetoid>;
  ships: EntitiesState<Ship>;
  milShips: EntitiesState<MilShip>;
  characters: EntitiesState<Character>;
  lanes: EntitiesState<Lane>;
  buildings: EntitiesState<Building>;
  species: EntitiesState<Species>;
  pops: EntitiesState<Pop>;
  goods: EntitiesState<Good>;

  getFleetById: (id: number) => Fleet | undefined;
  getFleetsBySystem: (id: number) => Fleet[] | undefined;
  getSystemById: (id: number) => System | undefined;
  getSystemsByOrg: (id: number) => System[] | undefined;
  getHabitablesInSystem: (id: number) => Planetoid[];
  getPlanetoidsBySystem: (id: number) => Planetoid[];
  getPlanetoidById: (id: number) => Planetoid | undefined;
  getOrgById: (id: number) => Org | undefined;
  getShipById: (id: number) => Ship | undefined;
  getMilShipById: (id: number) => MilShip | undefined;
  getCharacterById: (id: number) => Character | undefined;
  getBuildingById: (id: number) => Building | undefined;

  intelligence: IntelOverall;
}

export interface GameActions {
  issueMoveOrder: (payload: MoveOrderPayload) => void;
  issueShipMoveOrder: (payload: ShipMoveOrderPayload) => void;
  tick: () => void;
  playPause: () => void;
  buildShip: (payload: { locationId: number, shipType: ShipType }) => void;
  buildMilShip: (payload: { locationId: number, shipType: MilShipType }) => void;
  constructBuilding: (payload: { planetoidId: number, buildingType: BuildingClass, orgId: number }) => void;
  constructPlanetoid: (payload: { parentPlanetoidId: number, newType: PlanetoidClassification } ) => void;
  constructAnchor: (payload: { parentPlanetoidId: number, targetLaneId: number }) => void;
  declareWar: (payload: DiploStatusPayload) => void;
  declarePeace: (payload: DiploStatusPayload) => void;
  processPlayerDiplo: (payload: { requestId: number, accepted: boolean }) => void;
  sendDiploRequest: (payload: {targetOrgId: number, originOrgId: number, requestType: DiploType, trade?: { send: Resources, receive: Resources } }) => void;
  colonizePlanetoid: (payload: ColonizePayload) => void;
  beginPlanetoidSurvey: (payload: ColonizePayload) => void;
  initializeNewGame: (payload: {playerOrgName: string, playerOrgColor: string, playerSpecies: string} ) => void;
  assignCharacter: (payload: {charId: number, assignmentTargetId: number, assignmentType: CharacterAssignment}) => void;
  assignResearch: (payload: {buildingId: number, researchId: string }) => void;
  getOrgResearchOptions: (orgId: number) => string[];
}

export type GameStoreState = GameState & GameActions;
