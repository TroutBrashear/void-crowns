//definitions for all buildings in the game

import type { BuildingClass, Resources, Process } from '../types/gameState';

export interface BuildingDefinition {
  type: BuildingClass;
  cost: Resources;
  process: Process; // What it does (inputs/outputs)
}

export const BUILDING_CATALOG: Record<BuildingClass, BuildingDefinition> = {
	
  mine: {
	type: 'mine',
	cost: { credits: 500, rocks: 0, consumerGoods: 0 },
	process: 
		{ output: { rocks: 100 } }
  },
  powerPlant: {
    type: 'powerPlant',
    cost: { credits: 300, rocks: 0, consumerGoods: 0 },
    process: 
      { output: { credits: 50 } }
  },
  militaryBase: {
    type: 'militaryBase',
    cost: { credits: 1000, rocks: 0, consumerGoods: 0 },
    process: 
		{ }
  },
  researchLab: {
    type: 'researchLab',
    cost: { credits: 20000, rocks: 0, consumerGoods: 0 },
    process:
      { }
  },
  consumerCenter: {
    type: 'consumerCenter',
    cost: { credits: 1000, rocks: 0, consumerGoods: 0 },
    process:
      { input: { consumerGoods: 100 }, output: { credits: 400 } },
  },
  consumerFactory: {
    type: 'consumerFactory',
    cost: { credits: 1000, rocks: 0, consumerGoods: 0 },
    process:
      { input: { rocks: 50 }, output: { consumerGoods: 100 } },
  }
}
