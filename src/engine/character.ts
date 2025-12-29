import type { GameState, Character } from '../types/gameState';

 
export function generateCharacter(nextId: number): Character {
	let newCharacter = {
		id: nextId,
		name: "new character",
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
				let newCharacter = generateCharacter(nextCId);
				
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
