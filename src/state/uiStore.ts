import { create } from 'zustand';
import type { UiStoreState } from '../types/uiState';
import type { Selection } from './types/gameState'; 

export const useUiStore = create<UiStoreState>((set, get) => ({

	activeModal: null,
	selection: null,

	openModal: (modal: ModalType) => {
		set((state) => {
  			return{ activeModal: modal };
  		});
	},
  	
  	closeModal: () => {
  		set((state) => {
  			return{ activeModal: null };
  		});
  	},

  	setSelection: (selection) => set({ 
  		selection: selection 
  	}),
}));