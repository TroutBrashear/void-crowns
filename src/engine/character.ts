import type { GameState, Character } from '../types/gameState';
import { NAME_LISTS } from '../data/names';


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
	if(assignmentType === 'fleet'){
		newFleets[assignmentTargetId] = { ...newFleets[assignmentTargetId], assignedCharacter: charId };
	}
	else if(assignmentType === 'system'){
		newSystems[assignmentTargetId] = { ...newSystems[assignmentTargetId], assignedCharacter: charId };
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
	if(newCharacters[charId].assignment.type === 'fleet'){
		newFleets[newCharacters[charId].assignment.id] = { ...newFleets[newCharacters[charId].assignment.id], assignedCharacter: null };
	}
	else if(newCharacters[charId].assignment.type === 'system'){
		newSystems[newCharacters[charId].assignment.id] = { ...newSystems[newCharacters[charId].assignment.id], assignedCharacter: null };
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
	
	const newCharacters = { ...functionState.characters.entities };
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
