import type { BuildingClass } from './gameState';


export interface BuildingIntent {
    location: number; //the ID of a planetoid
    buildingType: BuildingClass;
}
