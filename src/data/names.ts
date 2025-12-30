//definitions for NameLists

export interface NameList {
  firstNames: string[];
  lastNames: string[];
  fleetNames: string[];
}

export const NAME_LISTS: Record<string, NameList> = {
	
	default: {
		firstNames: ['Dan', 'Maria', 'Horatio', 'Johnny', 'Clarissa'],
		lastNames: ['Smith', 'Baker', 'Ferrerrarri', 'Orono', 'Regist'],
		fleetNames: ['Task Force 2', 'Local Defense Fleet'],
	}
}