import type { Selection } from './gameState'; 


export type ModalType = "fleet_modal" | "system_modal" | "org_modal"; 


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
}

export interface ShowNotificationPayload {
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface UiStoreMethods {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setSelection: (selection: Selection | null) => void;

  showNotification: (payload: ShowNotificationPayload) => void;
  hideNotification: () => void;
}

export type UiStoreState = UiState & UiStoreMethods;