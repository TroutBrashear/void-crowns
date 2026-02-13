import type { BuildingClass } from './gameState';


export interface buildingIntent {
    location: number; //the ID of a planetoid
    buildingType: BuildingClass;
}
