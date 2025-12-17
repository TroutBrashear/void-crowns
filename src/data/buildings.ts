//definitions for all buildings in the game

import type { BuildingClass, Resources, Process } from '../types/gameState';

export interface BuildingDefinition {
  type: BuildingClass;
  cost: Resources;
  process: Process[]; // What it does (inputs/outputs)
}

export const BUILDING_CATALOG: Record<BuildingClass, BuildingDefinition> = {
	
  mine: {
	type: 'mine',
	cost: { credits: 500, rocks: 0 },
	process: [
		{ input: [], output: [{ credits: 0, rocks: 100 }] } 
	]
  },
  powerPlant: {
    type: 'powerPlant',
    cost: { credits: 300, rocks: 0 },
    process: [
      { input: [], output: [{ credits: 50, rocks: 0 }] }
    ]
  },
  militaryBase: {
    type: 'militaryBase',
    cost: { credits: 1000, rocks: 0 },
    process: [] 
  }
}