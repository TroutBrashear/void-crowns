import { create } from 'zustand';
import type { UiStoreState, ModalType, AssignType, ShowNotificationPayload, PanelType, AppState, CharacterAssignTarget } from '../types/uiState';
import type { Selection } from '../types/gameState'; 

export const useUiStore = create<UiStoreState>((set, get) => ({

	appState: 'main_menu',

	activeModal: null,

	selection: null,
	navStack: [],

	childAssignModal: null,
	characterAssignTarget: null,

	activePanel: null,

	//logic for notifications
	notifications: {
		notification: {
			notificationType: null,
			notificationMessage: null,
			isOpen: false,
			timeOutId: null,
			isUrgent: false
		},
		notStack: []
	},


	setAppState: (appState: AppState) => {
		set({appState: appState});
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

	openAssignModal: (modal: AssignType, target: CharacterAssignTarget) => {
		set({childAssignModal: modal, characterAssignTarget: target });
	},

	closeAssignModal: () => {
		set({childAssignModal: null });
	},

	openPanel: (panel: PanelType) => {
		set({activePanel: panel });
	},

	closePanel: () => {
		set({activePanel: null });
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
		const { notification } = get().notifications;


		//notification is up, push new notification to stack
		if(notification.isOpen){
			let notStack = get().notifications.notStack;

			let newNot = {
				isOpen: false,
				notificationType: payload.type,
				notificationMessage: payload.message,
				timeOutId: null,
				isUrgent: payload.isUrgent
			};

			if (payload.isUrgent){
				notStack = [newNot, ...notStack];
			}
			else{
				let index = notStack.findIndex(not => !not.isUrgent);
				if(index >= 0){
					notStack = [...notStack.slice(0, index), newNot, ...notStack.slice(index)];
				}
				else{
					notStack = [...notStack, newNot];
				}
			}

			set((state) => ({
				...state,
				notifications: {
					...state.notifications,
					notStack: notStack
				}
			}));
		}
		else{
			const newTimeoutId = setTimeout(() => {
				get().hideNotification();
			}, 4000);

			set((state) => ({
				...state,
				notifications: {
					...state.notifications,
					notification: {
						isOpen: true,
						notificationType: payload.type,
						notificationMessage: payload.message,
						timeOutId: newTimeoutId,
						isUrgent: payload.isUrgent
					}
				}
			}));
		}
	},

	hideNotification: () => {
		const notification = get().notifications.notification;
 
		if (notification.timeOutId) {
  			clearTimeout(notification.timeOutId);
		}

		let notStack = get().notifications.notStack;

		if(notStack[0]){
			let noti = {...notStack[0]};
			const newTimeoutId = setTimeout(() => {
				get().hideNotification();
			}, 4000);

			noti.timeOutId = newTimeoutId;
			noti.isOpen = true;
			notStack = notStack.slice(1);
			set((state) => ({
				...state,
				notifications: {
					...state.notifications,
					notification: noti,
					notStack: notStack
				}
			}));
		}
		else{
			set((state) => ({
				...state,
				notifications: {
					...state.notifications,
					notification: {
						isOpen: false,
						notificationType: null,
						notificationMessage: null,
						timeOutId: null,
						isUrgent: false
					}
				}
			}));
		}
	},
}));
