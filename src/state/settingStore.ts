import { create } from 'zustand';

import type { SettingStoreState, Pronoun } from '../types/settingState';

export const useSettingStore = create<SettingStoreState>((set, get) => {

    return {
        flavor: {
            userPronoun: 'you',
        },


        setUserPronoun: (pronoun: Pronoun) => {
             set((state) => {
                 return {
                     flavor: {
                         ...state.flavor,
                         userPronoun: pronoun,
                    },
                };
             });
        },
    };
});
