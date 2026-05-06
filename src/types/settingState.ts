
export type SPronoun = 'you' | 'thou' | 'Usted';

export interface SettingState {
    flavor: {
        userSPronoun: SPronoun;
        userTPronoun: string;
    };

    setUserPronoun: (pronoun: SPronoun) => void;
    setUserTPronoun: (pronoun: string) => void;
}

export type SettingStoreState = SettingState;
