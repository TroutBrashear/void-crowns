import { useUiStore } from '../../state/uiStore';
import FleetSelectModal from './FleetSelectModal';
import SystemSelectModal from './SystemSelectModal';
import OrgSelectModal from './OrgSelectModal';

export function ModalManager() {
	const activeModal = useUiStore(state => state.activeModal);

	switch(activeModal){
		case 'fleet_modal':
			return <FleetSelectModal />
		case 'system_modal':
			return <SystemSelectModal />
		case 'org_modal':
			return <OrgSelectModal />
		default:
			return null;
	}
}