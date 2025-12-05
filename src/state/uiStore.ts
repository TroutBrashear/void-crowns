import { create } from 'zustand';
import type { UiStoreState, ModalType, ShowNotificationPayload, HistoryStep } from '../types/uiState';
import type { Selection } from '../types/gameState'; 

export const useUiStore = create<UiStoreState>((set, get) => ({

	activeModal: null,
	selection: null,
	navStack: [],

	//logic for notifications
	notification: {
		notificationType: null,
  		notificationMessage: null,
  		isOpen: false,
  		timeOutId: null,
	},


	openModal: (modal: ModalType) => {
		set({ activeModal: modal });
	},

	changeModal: (modal: ModalType, newSelection: Selection) => {
		const { activeModal, selection, navStack } = get();

		if(activeModal){
			set({
                navStack: [...navStack, { modal: activeModal, selection: selection }],
                activeModal: modal,
                selection: newSelection
            });
		}
		else{
			set({ activeModal: modal, selection: newSelection });
		}
	},
  	
  	closeModal: () => {
  		set({ activeModal: null, selection: null, navStack: [] });
  	},

  	backModal: () => {
  		const { navStack } = get();

  		//top of stack, just exit modal
  		if(navStack.length === 0){
  			set({ activeModal: null, selection: null });
  			return;
  		}

  		const previousModal = navStack[navStack.length - 1];
        const newStack = navStack.slice(0, -1);

        set({
            selection: previousModal.selection,
            activeModal: previousModal.modal,
            navStack: newStack
        });
  	},

  	setSelection: (selection: Selection | null) => set({ 
  		selection: selection 
  	}),

  	showNotification: (payload: ShowNotificationPayload) => {
		const { notification } = get(); 
		if (notification.timeOutId) {
  			clearTimeout(notification.timeOutId);
		}

		const newTimeoutId = setTimeout(() => {
			set({notification: { ...state.notification, isOpen:false, timeOutId: null}});
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