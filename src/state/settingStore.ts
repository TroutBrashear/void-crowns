import { create } from 'zustand';

import type { SettingStoreState, SPronoun } from '../types/settingState';

export const useSettingStore = create<SettingStoreState>((set) => {

    return {
        flavor: {
            userSPronoun: 'you',
            userTPronoun: 'she',
        },


        setUserPronoun: (pronoun: SPronoun) => {
             set((state) => {
                 return {
                     flavor: {
                         ...state.flavor,
                         userSPronoun: pronoun,
                    },
                };
             });
        },

        setUserTPronoun: (pronoun: string) => {
            set((state) => {
                return {
                    flavor: {
                        ...state.flavor,
                        userTPronoun: pronoun,
                    }
                };
            });
        },
    };
});
