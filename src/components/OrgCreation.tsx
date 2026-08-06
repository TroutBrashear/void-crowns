import { useState } from 'react';
import { useUiStore } from '../state/uiStore';
import { useGameStore } from '../state/gameStore';

import { Button } from './pure/Button';
import { SUCCESSION_CATALOG } from '../data/politics/succession';

export function OrgCreation() {

    const [name, setName] = useState('');
    const [color, setColor] = useState('#ff0000');
    const [speciesName, setSpeciesName] = useState('');
    const [selectedSuccession, setSelectedSuccession] = useState<string | null>(null);
    const [termLength, setTermLength] = useState('');

    const setAppState = useUiStore(state => state.setAppState);
    const initializeNewGame = useGameStore(state => state.initializeNewGame);



    const startGame = () => {
        if(selectedSuccession){
            let playerOrgInfo = {
                name: name,
                color: color,
                successionType: selectedSuccession,
                termLength: Number(termLength)
            };
            initializeNewGame({playerOrg: playerOrgInfo, playerSpecies: speciesName});
            setAppState('in_game');
        }
    };


    const successionOptions = Object.keys(SUCCESSION_CATALOG);

    return (
        <div>
            <label htmlFor="orgName">Name: </label>
            <input type="text" id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="orgColor">Color: </label>
            <input type="color" id="orgColor" value={color} onChange={(e) => setColor(e.target.value)} />

            <div>
                <label htmlFor="successionLaw">Succession Law:</label>
                <select name="constructionTarget" value={selectedSuccession || ''} onChange={(e) => setSelectedSuccession(e.target.value as string)}>
                    {successionOptions.map(successionKey => {
                        if (!successionKey) return null;
                        return(
                            <option value={successionKey}>
                                {successionKey}
                            </option>);
                    })}
                </select>
                <label htmlFor="termLength">Term Length in Years (0 = disabled)</label>
                <input type="number" id="termLength" value={termLength} onChange={(e) => setTermLength(e.target.value)}/>
            </div>



            <div>
                <p>Species Info:</p>
                <label htmlFor="speciesName">Name: </label>
                <input type="text" id="speciesName" value={speciesName} onChange={(e) => setSpeciesName(e.target.value)}/>
            </div>
            <Button onClick= {startGame}>Submit</Button>
        </div>
    );
}

export default OrgCreation;
