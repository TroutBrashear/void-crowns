import type { Selection } from './gameState'; 


export type ModalType = "fleet_modal" | "system_modal"; 

export interface UiState {
  activeModal: ModalType | null;
  selection: Selection | null;
}

export interface UiStoreMethods {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setSelection: (selection: Selection | null) => void;
}

export type UiStoreState = UiState & UiStoreMethods;