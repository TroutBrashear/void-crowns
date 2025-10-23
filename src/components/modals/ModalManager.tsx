import { useUiStore } from '../../state/uiStore';
import FleetSelectModal from './FleetSelectModal';
import SystemSelectModal from './SystemSelectModal';

export function ModalManager() {
	const activeModal = useUiStore(state => state.activeModal);

	switch(activeModal){
		case 'fleet_modal':
			return <FleetSelectModal />
		case 'system_modal':
			return <SystemSelectModal />
		default:
			return null;
	}
}