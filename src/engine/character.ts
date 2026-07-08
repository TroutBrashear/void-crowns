import type { GameState, CharProcess, EngineResult, GameEvent } from '../types/gameState';
import type { Character, SkillName, CharacterAssignment } from '../types/charState';
import { NAME_LISTS } from '../data/names';
import { CHARACTER_EVENTS } from '../data/events';

//constants
import { CYCLE_CONFIG } from '../constants/cycle_config';
import { governmentSuccession } from './politics/politics';


export function engineApplyCharacterProcess(currentState: GameState, charId: number, process: CharProcess): GameState {
	const currentCharacter = { ...currentState.characters.entities[charId] };
	const nextSkills = { ...currentCharacter.skills };
	
	
	if(process.addSkill){
		for(const skillType of Object.keys(process.addSkill) as SkillName[]){
			nextSkills[skillType] = nextSkills[skillType] + process.addSkill[skillType];
		}
	}
	if(process.reduceSkill){
		for(const skillType of Object.keys(process.reduceSkill) as SkillName[]){
			nextSkills[skillType] = nextSkills[skillType] - process.reduceSkill[skillType];
		}
	}
	
	let nextTraits = [...currentCharacter.traits];
	
	if(process.addTrait){
		for(const trait of process.addTrait){
			nextTraits.push(trait);
		}
	}
	if(process.removeTrait){
		nextTraits = nextTraits.filter(trait => !process.removeTrait!.includes(trait));
	}
	
	const newCharacters = { ...currentState.characters.entities };
	newCharacters[charId] = { ...newCharacters[charId], skills: nextSkills, traits: nextTraits };
	
	
	return {
		...currentState,
		characters: {
			...currentState.characters,
			entities: newCharacters
		}
	}
}


export function engineRunCharacterEvent(currentState: GameState, charId: number, eventId: number): GameState {
	const eventDefinition = CHARACTER_EVENTS[eventId];
	
	if(!eventDefinition){
		return currentState;
	}
	
	//automatically apply initial process
	let nextState =  engineApplyCharacterProcess(currentState, charId, eventDefinition.effect as CharProcess);
	
	
	//handle potential choices
	if(eventDefinition.choices){
		//todo choice weighting
		const decision = Math.floor(Math.random()*eventDefinition.choices.length);
		
		nextState = engineApplyCharacterProcess(currentState, charId, eventDefinition.choices[decision].effect as CharProcess);
	}

	return nextState;
}


export function engineAssignCharacter(currentState: GameState, charId: number, assignmentTargetId: number, assignmentType: CharacterAssignment): GameState {
	
	const functionState = engineUnassignCharacter(currentState, charId);

	//address character first
	const newCharacters = { ...functionState.characters.entities };
	
	if(!newCharacters[charId]){
		return functionState;
	}

	let isMission = false;
	let missionDuration = 0;

	//then the other way from target
	const newFleets = { ...functionState.fleets.entities };
	const newSystems = { ...functionState.systems.entities };
	const newOrgs = { ...functionState.orgs.entities };
	const newShips = { ...functionState.ships.entities };
	const newBuildings = { ...functionState.buildings.entities };
	if(assignmentType === 'admiral'){
		newFleets[assignmentTargetId] = { ...newFleets[assignmentTargetId], assignedCharacter: charId };
	}
	else if(assignmentType === 'governor'){
		newSystems[assignmentTargetId] = { ...newSystems[assignmentTargetId], assignedCharacter: charId };
	}
	else if(assignmentType === 'leader'){
		newOrgs[assignmentTargetId] = { ...newOrgs[assignmentTargetId], characters: { ...newOrgs[assignmentTargetId].characters, leaderId: charId }};
	}
	else if(assignmentType === 'surveyor'){
		newShips[assignmentTargetId] = { ...newShips[assignmentTargetId], assignedCharacter: charId };
	}
	else if(assignmentType === 'scientist' || assignmentType === 'academyPresident'){
		newBuildings[assignmentTargetId] = { ...newBuildings[assignmentTargetId], assignedCharacter: charId };
	}
	else if(assignmentType === 'diplomat'){
		newOrgs[assignmentTargetId] = { ...newOrgs[assignmentTargetId], diplomacy: { ...newOrgs[assignmentTargetId].diplomacy, residentDiplomats: [...newOrgs[assignmentTargetId].diplomacy.residentDiplomats, charId] }};
		isMission = true;
		missionDuration = CYCLE_CONFIG.DIPLOMACY.DIPLO_MISSION_DURATION + functionState.meta.turn;
	}
	else{
		return functionState;
	}

	const newEvent = `${newCharacters[charId].name} was assigned as a ${assignmentType}`;

	if(isMission){
		newCharacters[charId] = { ...newCharacters[charId], assignment: { type: assignmentType, id: assignmentTargetId, duration: missionDuration }, history: { ...newCharacters[charId].history, events: [ ...newCharacters[charId].history.events, newEvent]}};
	}
	else{
		newCharacters[charId] = { ...newCharacters[charId], assignment: { type: assignmentType, id: assignmentTargetId }, history: { ...newCharacters[charId].history, events: [ ...newCharacters[charId].history.events, newEvent]}};
	}
	

	return {
		...functionState,
		characters: {
			...functionState.characters,
			entities: newCharacters,
		},
		fleets: {
			...functionState.fleets,
			entities: newFleets,
		},
		systems: {
			...functionState.systems,
			entities: newSystems,
		},
		orgs: {
			...functionState.orgs,
			entities: newOrgs,
		},
		ships: {
			...functionState.ships,
			entities: newShips,
		},
		buildings: {
			...functionState.buildings,
			entities: newBuildings,
		},
	};
}

//unassign Character, mirroring assign Character...
export function engineUnassignCharacter(currentState: GameState, charId: number): GameState {
	const newCharacters = { ...currentState.characters.entities };
	
	if(!newCharacters[charId] || !newCharacters[charId].assignment){
		return currentState;
	}
	const newFleets = { ...currentState.fleets.entities };
	const newSystems = { ...currentState.systems.entities };
	const newOrgs = { ...currentState.orgs.entities };
	const newShips = { ...currentState.ships.entities };
	const newBuildings = { ...currentState.buildings.entities };
	if(newCharacters[charId].assignment.type === 'admiral'){
		newFleets[newCharacters[charId].assignment.id] = { ...newFleets[newCharacters[charId].assignment.id], assignedCharacter: null };
	}
	else if(newCharacters[charId].assignment.type === 'governor'){
		newSystems[newCharacters[charId].assignment.id] = { ...newSystems[newCharacters[charId].assignment.id], assignedCharacter: null };
	}
	else if(newCharacters[charId].assignment.type === 'leader'){
		newOrgs[newCharacters[charId].assignment.id] = { ...newOrgs[newCharacters[charId].assignment.id], characters: { ...newOrgs[newCharacters[charId].assignment.id].characters, leaderId: null }};
	}
	else if(newCharacters[charId].assignment.type === 'surveyor'){
		newShips[newCharacters[charId].assignment.id] = { ...newShips[newCharacters[charId].assignment.id], assignedCharacter: null };
	}
	else if(newCharacters[charId].assignment.type === 'scientist' || newCharacters[charId].assignment.type === 'academyPresident'){
		newBuildings[newCharacters[charId].assignment.id] = { ...newBuildings[newCharacters[charId].assignment.id], assignedCharacter: null };
	}
	else if(newCharacters[charId].assignment.type === 'diplomat'){
		newOrgs[newCharacters[charId].assignment.id] = { ...newOrgs[newCharacters[charId].assignment.id], diplomacy: { ...newOrgs[newCharacters[charId].assignment.id].diplomacy, residentDiplomats: newOrgs[newCharacters[charId].assignment.id].diplomacy.residentDiplomats.filter(id => id !== charId) }};
	}
	else{
		return currentState;
	}
	
	
	//do this last, as we needed to reference the assignment above
	newCharacters[charId] = { ...newCharacters[charId], assignment: null} 
	
	return {
		...currentState,
		characters: {
			...currentState.characters,
			entities: newCharacters,
		},
		fleets: {
			...currentState.fleets,
			entities: newFleets,
		},
		systems: {
			...currentState.systems,
			entities: newSystems,
		},
		orgs: {
			...currentState.orgs,
			entities: newOrgs,
		},
		ships: {
			...currentState.ships,
			entities: newShips,
		},
		buildings: {
			...currentState.buildings,
			entities: newBuildings,
		},
	};
}


export function killCharacter(currentState: GameState, charId: number): GameState {
	let functionState = engineUnassignCharacter(currentState, charId);

	const currentCharacter = functionState.characters.entities[charId];

	if(!currentCharacter){
		return functionState;
	}

	if(currentCharacter.assignment && currentCharacter.assignment.type === 'leader' && currentCharacter.citizenOrg !== null){
		functionState = governmentSuccession(functionState, currentCharacter.citizenOrg);
	}

	const newCharacters = { ...functionState.characters.entities };
	let newCharacterIds = [ ...functionState.characters.ids ];
	const newOrgs = { ...functionState.orgs.entities };

	if(currentCharacter.citizenOrg){
		newOrgs[currentCharacter.citizenOrg] = {
			...newOrgs[currentCharacter.citizenOrg],
			characters: {
				...newOrgs[currentCharacter.citizenOrg].characters,
				characterPool: newOrgs[currentCharacter.citizenOrg].characters.characterPool.filter(id => charId !== id)
			}
		}
	}

	newCharacters[charId].status = 'dead';
	newCharacterIds = newCharacterIds.filter(id => charId !== id);

	return {
		...functionState,
		characters: {
			...functionState.characters,
			ids: newCharacterIds,
			entities: newCharacters
		},
		orgs: {
			...functionState.orgs,
			entities: newOrgs
		}
	};
}



export function generateCharacter(nextId: number, nameListId: string): Character {
	
	const nameList = NAME_LISTS[nameListId];
	
	const firstName = nameList.firstNames[Math.floor(Math.random()* nameList.firstNames.length)];
	const lastName = nameList.lastNames[Math.floor(Math.random()* nameList.lastNames.length)];
	
	const age = 22 + Math.floor((Math.random() * 5) + (Math.random() * 5) + (Math.random() * 5));

	const newCharacter: Character = {
		id: nextId,
		status: 'alive',
		name: {
			firstName:`${firstName}`,
			lastName: `${lastName}`,
		},
		age: age,
		traits: [],
		assignment: null,

		citizenOrg: null,

		skills: {
			administration: Math.floor(Math.random()*6),
			navalCombat: Math.floor(Math.random()*6),
			exploration: Math.floor(Math.random()*6),
			academics: Math.floor(Math.random()*6),
			diplomacy: Math.floor(Math.random()*6),
		},

		politics: {
			leaning: 'monarchist',
		},

		history: {
			events: [],
			childrenIds: [],
		},
	};
	
	return newCharacter; 
}

export function generateCharacterOffspring(nextId: number, nameListId: string, lastName: string, parentId: number ): Character {
	let newCharacter = generateCharacter(nextId, nameListId);
	newCharacter.name.lastName = lastName;
	newCharacter.history.parentId = parentId;

	return newCharacter;
}
 
//processCharacterCycles will be a function handling: ensuring that orgs have pools of eligible characters, and that characters age and die.
export function processCharacterCycles(currentState: GameState): EngineResult {
	let functionState = { ...currentState };
	const allCharEvents: GameEvent[] = [];
	
	let newCharacters = { ...functionState.characters.entities };
	const characterIds = functionState.characters.ids;
	const newIds: number[] = [];
	
	const newOrgs = { ...functionState.orgs.entities };
	const orgIds = functionState.orgs.ids;
	
	let nextCId = functionState.meta.lastCharacterId ;

	const deadCharacterIds: number[] = [];
	
	//step 1: process each character, advancing age, evaluating deaths
	for(const charId of characterIds){
		const currentCharacter = { ...newCharacters[charId] };
		if(currentCharacter && currentCharacter.status === 'alive'){

			//handle aging and death
			let newAge = currentCharacter.age;
			if(functionState.meta.turn % CYCLE_CONFIG.CHARACTER.AGING_INTERVAL === 0) {
				newAge +=1;
			}
			if(newAge >= 100){
				deadCharacterIds.push(charId);
				continue;
			}
			else{ 
				newIds.push(charId);
				newCharacters[charId] = {
					...currentCharacter,
					age: newAge,
				};
			}
			
			functionState = { ...functionState, characters: { ...functionState.characters, entities: newCharacters }};
			
			//does the character get a random event
			if(Math.floor(Math.random() * 5) > 3){
				const eventId = 1; //todo: actually random
				
				functionState = engineRunCharacterEvent(functionState, charId, eventId);
			}

			//character offspring check!
			if(currentCharacter.age > 45 && currentCharacter.citizenOrg){
				let offspringRoll = Math.random() * 100;

				offspringRoll -= (currentCharacter.history.childrenIds.length * 3);

				if(currentCharacter.assignment && currentCharacter.assignment.type === 'leader'){
					offspringRoll + 5;
				}

				if(offspringRoll > 95){
					nextCId++;
					let newCharacter = generateCharacterOffspring(nextCId, functionState.orgs.entities[currentCharacter.citizenOrg].flavor.nameList, currentCharacter.name.lastName, currentCharacter.id);
					newCharacter = {
						...newCharacter,
						citizenOrg: currentCharacter.citizenOrg
					};
					newIds.push(nextCId);
					const newPool = [...newOrgs[currentCharacter.citizenOrg].characters.characterPool];
					newPool.push(nextCId);
					newOrgs[currentCharacter.citizenOrg] = { ...newOrgs[currentCharacter.citizenOrg], characters: { ...newOrgs[currentCharacter.citizenOrg].characters, characterPool: newPool } };
					newCharacters[nextCId] = newCharacter;

					currentCharacter.history.childrenIds.push(nextCId);
				}
			}
			
			//is the character carrying out a Mission Assignment?
			if(currentCharacter.assignment && currentCharacter.assignment.duration){
				if(currentCharacter.assignment.duration >= functionState.meta.turn){
					functionState = engineUnassignCharacter(functionState, charId);
				}
			}
			newCharacters = { ...functionState.characters.entities };
		}
	}
	
	//step 2: process each org character pool, making sure they have enough options for orgs to employ
	for(const orgId of orgIds){
		let currentOrg = { ...newOrgs[orgId]};
		
		if(currentOrg){
			
			
			while(currentOrg.characters.characterPool.length < 6){
				nextCId++;
				let newCharacter = generateCharacter(nextCId, currentOrg.flavor.nameList);
				newCharacter = {
					...newCharacter,
					citizenOrg: orgId
				};
				newIds.push(nextCId);
				const newPool = [...currentOrg.characters.characterPool];
				newPool.push(nextCId);
				currentOrg = { ...currentOrg, characters: { ...currentOrg.characters, characterPool: newPool } };
				newCharacters[nextCId] = newCharacter;
			}
			newOrgs[orgId] = currentOrg;
		}
	}
	
	functionState = {
		...functionState,
		meta: {
			...functionState.meta,
			lastCharacterId: nextCId,
		},
		characters: {
			...functionState.characters,
			entities: newCharacters,
			ids: newIds,
		},
		orgs: {
			...functionState.orgs,
			entities: newOrgs,
		},
	};

	//resolve character deaths
	for(const id of deadCharacterIds){
		const char = functionState.characters.entities[id];
		if(char.citizenOrg){
			const charEvent: GameEvent = {
				type: 'char_result',
				message: `${char.name} died.`,
				involvedOrgIds: [char.citizenOrg],
				isPlayerVisible: char.citizenOrg === 1,
			};

			allCharEvents.push(charEvent);
		}
		functionState = killCharacter(functionState, id);
	}
	
	return {
		newState: functionState,
		events: allCharEvents,
	};
}
