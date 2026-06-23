import type { AiIntent } from './aiState';
import type { Fleet, Ship, MilShip, ShipType, MilShipType } from './shipTypes';
import type { Lane, System, Planetoid, PlanetoidClassification } from './geoState';
import type { Resources, Good, GoodCategory } from './ecoState';
import type { SkillName, Character, CharacterAssignment } from './charState';

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
  feelings: {
    happiness: number;
    fear: number;
    recentEvents: string[];
  }
  politics: {
    movement?: number; // the id of a Movement the pop supports
  }
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
    homeSystem: number; //a System.id
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

export type Ideology = 'monarchist' | 'authoritarian' | 'republican' | 'corporate';

export type CellType = 'rebel' | 'criminal' | 'corporate';
export type CellAssignmentType = 'idle' | 'sabotage';

export interface Cell {
  readonly id: number;
  type: CellType;

  strength: number;

  locationId: number; //a planetoidId with the Cell's location'

  leader: number; //a Character's id

  assignment: {
    type: CellAssignmentType;
    progress: number;
  }
}

export interface Movement {
  readonly id: number;
  ideology: Ideology;

  originLocation: number; //a planetoidId

  fervor: number; //a number from 0-10
}

//types related to intelligence, fog of war, stength calculations
export interface IntelStatus {
  militaryStrength: number;
}

export interface PlanetoidIntel {
  noProspects: number[];
  shortGoods: Record<number,string[]>;
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
export type GameEventType = 'battle_result' | 'construction_complete' | 'research_complete' | 'insufficient_resources' | 'diplo_result' | 'char_result' | 'pol_event';

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
    lastCellId: number;
    lastMovementId: number;
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
  cells: EntitiesState<Cell>;
  movements: EntitiesState<Movement>;

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
  getGoodById: (id: number) => Good | undefined;
  getPopById: (id:number) => Pop | undefined;

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
  constructHabitat: (payload: { targetPlanetoid: number }) => void;
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
