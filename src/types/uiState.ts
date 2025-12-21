import type { Selection } from './gameState'; 


export type ModalType = "fleet_modal" | "system_modal" | "org_modal" | "ship_modal" | "planet_modal"; 


export interface NotificationData {
  notificationType: string | null;
  notificationMessage: string | null;
  isOpen: boolean;
  timeOutId: number | null;
}

export interface UiState {
  activeModal: ModalType | null;
  selection: Selection | null;
  notification: NotificationData;
  navStack: HistoryStep[];
}

export interface ShowNotificationPayload {
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface UiStoreMethods {
  openModal: (modal: ModalType) => void;
  changeModal: (modal: ModalType, newSelection: Selection) => void;
  closeModal: () => void;
  backModal: () => void;
  setSelection: (selection: Selection | null) => void;

  showNotification: (payload: ShowNotificationPayload) => void;
  hideNotification: () => void;
}

export interface HistoryStep {
  selection: Selection | null;
  activeModal: string | null;
}

export type UiStoreState = UiState & UiStoreMethods;