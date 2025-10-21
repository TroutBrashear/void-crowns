

export type ModalTypes = "inspector"; 

export interface UiState {
  activeModal: ModalType | null;
}

export interface UiStoreMethods {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

export type UiStoreState = UiState & UiStoreMethods;