//definitions for all events. currently, this is just CharacterEvents

import type { CharProcess, Process } from '../types/gameState';

export type EventType = 'character' | 'org';

export interface EventOption {
	optionText: string; //explain what the option IS if player facing.
	logText: string | null; //options may append additional logText to the main event's logText
	effect: CharProcess | Process;
}

export interface EventDefinition {
  id: number;
  type: EventType;
  
  effect: CharProcess | Process;
  logText: string | null; //options may append additional logText to the main event's logText
  choices?: EventOption[];
}


export const CHARACTER_EVENTS: Record<number, EventDefinition> = {
	1: { //add 1 navalCombat skill
		id: 1,
		type: 'character',
		
		effect: {
			addSkill: { navalCombat: 1 } ,
		} as CharProcess,
		logText: "attended naval training",
	},
	2: { //add 1 academics skill
		id: 2,
		type: 'character',

		effect: {
			addSkill: { academics: 1 } ,
		} as CharProcess,
		logText: "attended university schooling",
	},
	3: { //add 1 administration skill
		id: 3,
		type: 'character',

		effect: {
			addSkill: { administration: 1 },
		} as CharProcess,
		logText: "went to a managment seminar",
	},
	4: {
		id: 4,
		type: 'character',

		effect: {
			addSkill: { exploration: 1 },
		} as CharProcess,
		logText: "attended ranger training",
	},
	5: {
		id: 5,
		type: 'character',

		effect: {
			reduceSkill: { academics: 1 },
		} as CharProcess,
		logText: "failed to keep up with academic journals",
	},
}
