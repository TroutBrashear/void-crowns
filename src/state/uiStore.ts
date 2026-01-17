import { create } from 'zustand';
import type { UiStoreState, ModalType, AssignType, ShowNotificationPayload } from '../types/uiState';
import type { Selection } from '../types/gameState'; 

export const useUiStore = create<UiStoreState>((set, get) => ({

	activeModal: null,
	childAssignModal: null,
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
		set({ activeModal: modal, childAssignModal: null });
	},

	changeModal: (modal: ModalType, newSelection: Selection) => {
		const { activeModal, selection } = get();

		if(activeModal){
			set((state) => ({
				...state,
				navStack: [...state.navStack, { activeModal: activeModal, selection: selection }],
				activeModal: modal,
				selection: newSelection,
				childAssignModal: null
			}));
		}
		else{
			set((state) => ({ 
				...state,
				activeModal: modal, 
				selection: newSelection,
				childAssignModal: null
			}));
		}
	},
  	
  	closeModal: () => {
  		set({ activeModal: null, selection: null, navStack: [], childAssignModal: null });
  	},

	openAssignModal: (modal: AssignType) => {
			set({childAssignModal: modal });
	},

	closeAssignModal: () => {
		set({childAssignModal: null });
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
            activeModal: previousModal.activeModal as ModalType,
            navStack: newStack,
			childAssignModal: null
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
			get().hideNotification();
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
