import { create } from 'zustand';
import type { UiStoreState } from '../types/uiState';
import type { Selection } from '../types/gameState'; 

export const useUiStore = create<UiStoreState>((set) => ({

	activeModal: null,
	selection: null,

	openModal: (modal: ModalType) => {
		set((state) => {
  			return{ activeModal: modal };
  		});
	},
  	
  	closeModal: () => {
  		set((state) => {
  			return{ activeModal: null, selection: null };
  		});
  	},

  	setSelection: (selection: Selection | null) => set({ 
  		selection: selection 
  	}),
}));