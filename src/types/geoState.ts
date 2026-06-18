//state for locations

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
  structures: {
      habitats: number;
  }
  ownerNationId: number | null;
  population?: {
    total: number;
    progress: number;
    popIds: number[];
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

export interface Deposit {
  id: number;
  type: string;
  amount: number;
  isVisible: boolean;
  difficulty: number; //an org needs to beat difficulty with a dice roll to reveal the Deposit. Some will be generated with a number higher than can be rolled - can be beaten with tech bonuses later.
}


//lanes
export type LaneStatus = 'stable' | 'fading' | 'immaterial' | 'anchored';

export interface Lane {
  readonly id: number;
  status: LaneStatus;

  anchorOrigin: number | null;

  //the systems the lane connects
  systemIdA: number;
  systemIdB: number;
}
