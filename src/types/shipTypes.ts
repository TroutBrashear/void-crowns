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

export interface MilShipStats {
   size: number;
   speed: number;
   strength: number;
}

export interface MilShip {
    readonly id: number;
    flavor: {
        name: string;
        traits: number[];
        type: MilShipType;
    }

    stats: MilShipStats;

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
    //colony_ship has an assignmentTargetId pointing to the Species on board
    assignmentTargetId: number | null;

    contextHistory: {
        assignmentProgress: number;
    }
}
