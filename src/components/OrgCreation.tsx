import { useState } from 'react';
import { useUiStore } from '../state/uiStore';
import { useGameStore } from '../state/gameStore';

export function OrgCreation() {

    const [name, setName] = useState('');
    const [color, setColor] = useState('#ff0000');

    const setAppState = useUiStore(state => state.setAppState);
    const initializeNewGame = useGameStore(state => state.initializeNewGame);


    const startGame = () => {
        initializeNewGame({playerOrgName: name, playerOrgColor: color});
        setAppState('in_game');
    };

    return (
        <div>
            <label htmlFor="orgName">Name: </label>
            <input type="text" id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="orgColor">Color: </label>
            <input type="color" id="orgColor" value={color} onChange={(e) => setColor(e.target.value)} />
            <button onClick= {startGame}>Submit</button>
        </div>
    );
}

export default OrgCreation;
