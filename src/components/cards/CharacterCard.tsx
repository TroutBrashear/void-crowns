import { useGameStore } from '../../state/gameStore';

import { characterName } from '../../utils/formatters';


function CharacterCard({ characterId }: { characterId: number }) {

    const targetCharacter = useGameStore(state => state.characters.entities[characterId]);

    if(!targetCharacter){
        return null;
    }

    const name = characterName(targetCharacter);
    return(
        <div>
            <h3>{name}</h3>
            { targetCharacter.assignment?.type ??  <p>targetCharacter.assignment.type</p>}
            <p>Age: {targetCharacter.age} </p>
            <ul>
            { targetCharacter.traits.map(trait =>
                <li key={trait}><p>trait</p></li>
            ) }
            </ul>
        </div>
    );
}

export default CharacterCard;
