import type { GameState } from '../types/gameState';


 


//processCharacterCycles will be a function handling: ensuring that orgs have pools of eligible characters, and that characters age and die.
export function processCharacterCycles(currentState: GameState): GameState {
	const newCharacters = { ...currentState.characters.entities };
	
	
	const characterIds = currentState.characters.ids;
	const newIds: number[] = [];
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
	
	return {
		...currentState,
		characters: {
			...currentState.characters,
			entities: newCharacters,
			ids: newIds,
		}
	};
}
