import { create } from 'zustand';
import type { UiStoreState } from '../types/uiState';


export const useUiStore = create<UiStoreState>((set, get) => ({

	activeModal: null,

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
}));