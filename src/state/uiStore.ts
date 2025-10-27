import { create } from 'zustand';
import type { UiStoreState, ModalType } from '../types/uiState';
import type { Selection } from '../types/gameState'; 

export const useUiStore = create<UiStoreState>((set) => ({

	activeModal: null,
	selection: null,

	openModal: (modal: ModalType) => {
		set({ activeModal: modal });
	},
  	
  	closeModal: () => {
  		set({ activeModal: null, selection: null });
  	},

  	setSelection: (selection: Selection | null) => set({ 
  		selection: selection 
  	}),
}));