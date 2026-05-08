import { useState } from 'react';
import { useUiStore } from '../state/uiStore';
import { useSettingStore } from '../state/settingStore';

export function SessionSettings() {
    const SPronoun = ['you', 'thou', 'Usted'];

    const [sPronoun, setSPronoun] = useState(SPronoun[0]);
    const [tPronoun, setTPronoun] = useState('');

    const setAppState = useUiStore(state => state.setAppState);

    const setUserPronoun = useSettingStore(state => state.setUserPronoun);
    const setUserTPronoun = useSettingStore(state => state.setUserTPronoun);


    const submitSettings = () => {
        setUserPronoun(sPronoun);
        setUserTPronoun(tPronoun);
        setAppState('org_creation');
    };


    return (
      <div>
        <p>How should the game address the player?</p>
        <select
            value={sPronoun}
            onChange={(e) => setSPronoun(e.target.value)}
            >
            {SPronoun.map(pronoun => (
                <option key={pronoun} value={pronoun}>
                    {pronoun}
                </option>
            ))}
        </select>
        <label htmlFor="tPronoun">Pronoun: </label>
        <input type="text" id="tPronoun" value={tPronoun} onChange={(e) => setTPronoun(e.target.value)}/>
        <button onClick={submitSettings}>Submit</button>
      </div>
    );
}

export default SessionSettings;
