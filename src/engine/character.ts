import type { GameState, Character } from '../types/gameState';
import { NAME_LISTS } from '../data/names';


export function engineAssignCharacter(currentState: GameState, charId: number, assignmentTargetId: number, assignmentType: string): GameState {

	//address character first
	let newCharacters = { ...currentState.characters.entities };
	let updatedCharacter = newCharacters[charId];
	
	if(!updatedCharacter){
		return currentState;
	}
	
	updatedCharacter.assignment = { type: assignmentType, id: assignmentTargetId };
	
	newCharacters[charId] = updatedCharacter;
	
	//then the other way from target
	let newFleets = { ...currentState.fleets.entities };
	let newSystems = { ...currentState.systems.entities };
	if(assignmentType === 'fleet'){
		let updatedFleet = newFleets[assignmentTargetId];
		updatedFleet.assignedCharacter = charId;
		newFleets[assignmentTargetId] = updatedFleet;
	}
	else if(assignmentType === 'system'){
		let updatedSystem = newSystems[assignmentTargetId];
		updatedSystem.assignedCharacter = charId;
		newSystems[assignmentTargetId] = updatedSystem;
	}
	else{
		return currentState;
	}
	
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
	};
	
	return newCharacter; 
}
 
//processCharacterCycles will be a function handling: ensuring that orgs have pools of eligible characters, and that characters age and die.
export function processCharacterCycles(currentState: GameState): GameState {
	const newCharacters = { ...currentState.characters.entities };
	const characterIds = currentState.characters.ids;
	const newIds: number[] = [];
	
	const newOrgs = { ...currentState.orgs.entities };
	const orgIds = currentState.orgs.ids;
	
	let nextCId = currentState.meta.lastCharacterId;
	
	//step 1: process each character, advancing age, evaluating deaths
	for(const charId of characterIds){
		let currentCharacter = newCharacters[charId];
		if(currentCharacter){

			let newAge = currentCharacter.age;
			if(currentState.meta.turn % 50 === 0) {
				newAge +=1;
			}
			if(newAge >= 100){
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
		let currentOrg = newOrgs[orgId];
		
		if(currentOrg){
			let updatedOrg = { ...currentOrg };
			
			while(updatedOrg.characters.characterPool.length < 4){
				nextCId++;
				let newCharacter = generateCharacter(nextCId, updatedOrg.flavor.nameList);
				console.log(newCharacter.name);
				newIds.push(nextCId);
				updatedOrg.characters.characterPool.push(nextCId);
				newCharacters[nextCId] = newCharacter;
			}
			console.log(updatedOrg.characters.characterPool);
			newOrgs[orgId] = updatedOrg;
		}
	}
	
	
	return {
		...currentState,
		meta: {
			...currentState.meta,
			lastCharacterId: nextCId,
		},
		characters: {
			...currentState.characters,
			entities: newCharacters,
			ids: newIds,
		},
		orgs: { 
            ...currentState.orgs,
            entities: newOrgs,
        }
	};
}
