import type { Selection } from './gameState'; 


export type ModalType = "fleet_modal" | "system_modal" | "org_modal" | "ship_modal" | "planet_modal"; 

export type AssignType = "assign_character";

export type PanelType = "diplomacy_panel" | "politics_panel";

export type AppState = 'main_menu' | 'org_creation' | 'in_game';

export interface NotificationData {
  notificationType: string | null;
  notificationMessage: string | null;
  isOpen: boolean;
  timeOutId: number | null;
}

export interface UiState {
  appState: AppState;
  activeModal: ModalType | null;
  childAssignModal: AssignType | null;
  activePanel: PanelType | null;
  selection: Selection | null;
  notification: NotificationData;
  navStack: HistoryStep[];
}

export interface ShowNotificationPayload {
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface UiStoreMethods {
  setAppState: (appState: AppState) => void;

  openModal: (modal: ModalType) => void;
  changeModal: (modal: ModalType, newSelection: Selection) => void;
  closeModal: () => void;
  backModal: () => void;
  setSelection: (selection: Selection | null) => void;

  openAssignModal: (modal: AssignType) => void;
  closeAssignModal: () => void;

  openPanel: (panel: PanelType) => void;
  closePanel: () => void;

  showNotification: (payload: ShowNotificationPayload) => void;
  hideNotification: () => void;
}

export interface HistoryStep {
  selection: Selection | null;
  activeModal: string | null;
}

export type UiStoreState = UiState & UiStoreMethods;
