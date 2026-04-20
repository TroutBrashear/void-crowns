import type { BuildingClass, ShipType, MilShipType } from './gameState';


export type AiIntent = BuildingIntent | ShipConstructIntent | MilShipConstructIntent;

export interface BuildingIntent {
    type: "building";
    location: number; //the ID of a planetoid
    buildingType: BuildingClass;
}

export interface ShipConstructIntent {
    type: "ship";
    location: number; //the ID of a system
    shipType: ShipType;
}

export interface MilShipConstructIntent {
    type: "milShip";
    location: number;
    shipType: MilShipType;
}
