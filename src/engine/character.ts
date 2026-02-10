import type { GameState, Character, SkillName, CharProcess } from '../types/gameState';
import { NAME_LISTS } from '../data/names';
import { CHARACTER_EVENTS } from '../data/events';


export function engineApplyCharacterProcess(currentState: GameState, charId: number, process: CharProcess): GameState {
	let currentCharacter = { ...currentState.characters.entities[charId] };
	let nextSkills = { ...currentCharacter.skills };
	
	
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
	
	let newCharacters = { ...currentState.characters.entities };
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
	let eventDefinition = CHARACTER_EVENTS[eventId];
	
	if(!eventDefinition){
		return currentState;
	}
	
	//automatically apply initial process
	let nextState =  engineApplyCharacterProcess(currentState, charId, eventDefinition.effect as CharProcess);
	
	
	//handle potential choices
	if(eventDefinition.choices){
		//todo choice weighting
		let decision = Math.floor(Math.random()*eventDefinition.choices.length);
		
		nextState = engineApplyCharacterProcess(currentState, charId, eventDefinition.choices[decision].effect as CharProcess);
	}

	return nextState;
}


export function engineAssignCharacter(currentState: GameState, charId: number, assignmentTargetId: number, assignmentType: string): GameState {
	
	let functionState = engineUnassignCharacter(currentState, charId);


	//address character first
	let newCharacters = { ...functionState.characters.entities };
	
	if(!newCharacters[charId]){
		return functionState;
	}
	
	newCharacters[charId] = { ...newCharacters[charId], assignment: { type: assignmentType, id: assignmentTargetId }};


	//then the other way from target
	let newFleets = { ...functionState.fleets.entities };
	let newSystems = { ...functionState.systems.entities };
	let newOrgs = { ...functionState.orgs.entities };
	if(assignmentType === 'admiral'){
		newFleets[assignmentTargetId] = { ...newFleets[assignmentTargetId], assignedCharacter: charId };
	}
	else if(assignmentType === 'governor'){
		newSystems[assignmentTargetId] = { ...newSystems[assignmentTargetId], assignedCharacter: charId };
	}
	else if(assignmentType === 'leader'){
		newOrgs[assignmentTargetId] = { ...newOrgs[assignmentTargetId], characters: { ...newOrgs[assignmentTargetId], leaderId: charId }};
	}
	else{
		return functionState;
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
	};
}

//unassign Character, mirroring assign Character...
export function engineUnassignCharacter(currentState: GameState, charId: number): GameState {
	let newCharacters = { ...currentState.characters.entities };
	
	if(!newCharacters[charId] || !newCharacters[charId].assignment){
		return currentState;
	}
	
	let newFleets = { ...currentState.fleets.entities };
	let newSystems = { ...currentState.systems.entities };
	let newOrgs = { ...currentState.orgs.entities };
	if(newCharacters[charId].assignment.type === 'admiral'){
		newFleets[newCharacters[charId].assignment.id] = { ...newFleets[newCharacters[charId].assignment.id], assignedCharacter: null };
	}
	else if(newCharacters[charId].assignment.type === 'governor'){
		newSystems[newCharacters[charId].assignment.id] = { ...newSystems[newCharacters[charId].assignment.id], assignedCharacter: null };
	}
	else if(newCharacters[charId].assignment.type === 'leader'){
		newOrgs[newCharacters[charId].assignment.id] = { ...newOrgs[newCharacters[charId].assignment.id], characters: { ...newOrgs[newCharacters[charId].assignment.id], leaderId: null }};
	}
	else{
		return currentState;
	}
	
	
	//do this last, as we needed to reference assignment above
	
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
			...functionState.orgs,
			entities: newOrgs,
		},
	};
}

export function generateCharacter(nextId: number, nameListId: string): Character {
	
	const nameList = NAME_LISTS[nameListId];
	
	let firstName = nameList.firstNames[Math.floor(Math.random()* nameList.firstNames.length)];
	let lastName = nameList.lastNames[Math.floor(Math.random()* nameList.lastNames.length)];
	
	let newCharacter = {
		id: nextId,
		name: `${firstName} ${lastName}`,
		age: 25,
		traits: [],
		assignment: null,
		skills: {
			administration: Math.floor(Math.random()*6),
			navalCombat: Math.floor(Math.random()*6),
		},
	};
	
	return newCharacter; 
}
 
//processCharacterCycles will be a function handling: ensuring that orgs have pools of eligible characters, and that characters age and die.
export function processCharacterCycles(currentState: GameState): GameState {
	let functionState = { ...currentState };
	
	let newCharacters = { ...functionState.characters.entities };
	const characterIds = functionState.characters.ids;
	const newIds: number[] = [];
	
	const newOrgs = { ...functionState.orgs.entities };
	const orgIds = functionState.orgs.ids;
	
	let nextCId = functionState.meta.lastCharacterId ;
	
	//step 1: process each character, advancing age, evaluating deaths
	for(const charId of characterIds){
		let currentCharacter = { ...newCharacters[charId] };
		if(currentCharacter){

			let newAge = currentCharacter.age;
			if(functionState.meta.turn % 50 === 0) {
				newAge +=1;
			}
			if(newAge >= 100){
				functionState = engineUnassignCharacter(functionState, charId);
				
				newCharacters = { ...functionState.characters.entities };
				
				delete newCharacters[charId];
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
				let eventId = 1; //todo: actually random
				
				functionState = engineRunCharacterEvent(functionState, charId, eventId);
			}
			
			newCharacters = { ...functionState.characters.entities };
		}
	}
	
	//step 2: process each org character pool, making sure they have enough options for orgs to employ
	for(const orgId of orgIds){
		let currentOrg = { ...newOrgs[orgId]};
		
		if(currentOrg){
			
			
			while(currentOrg.characters.characterPool.length < 4){
				nextCId++;
				let newCharacter = generateCharacter(nextCId, currentOrg.flavor.nameList);
				console.log(newCharacter.name);
				newIds.push(nextCId);
				let newPool = [...currentOrg.characters.characterPool];
				newPool.push(nextCId);
				currentOrg = { ...currentOrg, characters: { ...currentOrg.characters, characterPool: newPool } };
				newCharacters[nextCId] = newCharacter;
			}
			console.log(currentOrg.characters.characterPool);
			newOrgs[orgId] = currentOrg;
		}
	}
	
	
	return {
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
}
