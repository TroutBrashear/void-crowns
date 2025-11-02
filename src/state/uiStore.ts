import { create } from 'zustand';
import type { UiStoreState, ModalType, ShowNotificationPayload } from '../types/uiState';
import type { Selection } from '../types/gameState'; 

export const useUiStore = create<UiStoreState>((set, get) => ({

	activeModal: null,
	selection: null,
	notification: {
		notificationType: null,
  		notificationMessage: null,
  		isOpen: false,
  		timeOutId: null,
	},

	openModal: (modal: ModalType) => {
		set({ activeModal: modal });
	},
  	
  	closeModal: () => {
  		set({ activeModal: null, selection: null });
  	},

  	setSelection: (selection: Selection | null) => set({ 
  		selection: selection 
  	}),

  	showNotification: (payload: ShowNotificationPayload) => {
		const { notification } = get(); 
		if (notification.timeoutId) {
  			clearTimeout(notification.timeoutId);
		}

		const newTimeoutId = setTimeout(() => {
			set({isOpen:false, timeoutId: null});
		}, 4000);

		set((state) => ({
      		...state,
      		notification: {
        		isOpen: true,
        		notificationType: payload.type, 
        		notificationMessage: payload.message,
        		timeOutId: newTimeoutId,
     		}
    	}));
	},

	hideNotification: () => {
		const notification = get().notification;
 
		if (notification.timeOutId) {
  			clearTimeout(notification.timeOutId);
		}

		set((state) => ({
      		...state,
      		notification: {
        		isOpen: false,
        		notificationMessage: null,
        		notificationType: null,
        		timeOutId: null,
      		}
    	}));
	},
}));