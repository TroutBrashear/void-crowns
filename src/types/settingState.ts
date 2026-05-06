
export type Pronoun = 'you' | 'thou' | 'Usted';

export interface SettingState {
    flavor: {
        userPronoun: Pronoun;
    };

    setUserPronoun: (pronoun: Pronoun) => void;
}

export type SettingStoreState = SettingState;
