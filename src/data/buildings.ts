//definitions for all buildings in the game

import type { BuildingClass, Resources, Process } from '../types/gameState';

export interface BuildingDefinition {
  type: BuildingClass;
  cost: Partial<Resources>;
  process: Process; // What it does (inputs/outputs)
  tags: string[];
}

export const BUILDING_CATALOG: Record<BuildingClass, BuildingDefinition> = {
	
  mine: {
	type: 'mine',
	cost: { credits: 500 },
	process: 
		{ output: { rocks: 100 } },
    tags: [],
  },
  gasWell: {
    type: 'gasWell',
    cost: { credits: 800 },
    process:
      { output: { gas: 100 } },
      tags: [],
  },
  powerPlant: {
    type: 'powerPlant',
    cost: { credits: 300 },
    process: 
      { output: { credits: 50 } },
    tags: [],
  },
  militaryBase: {
    type: 'militaryBase',
    cost: { credits: 1000},
    process: 
      { },
    tags: [],
  },
  researchLab: {
    type: 'researchLab',
    cost: { credits: 20000 },
    process:
      { },
    tags: [],
  },
  consumerCenter: {
    type: 'consumerCenter',
    cost: { credits: 1000},
    process:
      { output: { credits: 400 } },
    tags: [],
  },
  consumerFactory: {
    type: 'consumerFactory',
    cost: { credits: 1000 },
    process:
      { input: { rocks: 50 }, goodsOutput: { 2: 100 } },
    tags: [],
  },
  navalAcademy: {
    type: 'navalAcademy',
    cost: { credits: 20000 },
    process:
      { input: { credits: 100 } },
    tags: ["academy"],
  },
  scienceAcademy: {
    type: 'scienceAcademy',
    cost: { credits: 20000 },
    process:
    { input: { credits: 100 } },
    tags: ["academy"],
  },
}
