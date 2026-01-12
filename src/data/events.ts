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
	}
}