import { useUiStore } from '../../state/uiStore';
import FleetSelectModal from './FleetSelectModal';
import SystemSelectModal from './SystemSelectModal';
import OrgSelectModal from './OrgSelectModal';
import ShipSelectModal from './ShipSelectModal';
import PlanetoidSelectModal from './PlanetoidSelectModal';

export function ModalManager() {
	const activeModal = useUiStore(state => state.activeModal);

	switch(activeModal){
		case 'fleet_modal':
			return <FleetSelectModal />
		case 'system_modal':
			return <SystemSelectModal />
		case 'org_modal':
			return <OrgSelectModal />
		case 'ship_modal':
			return <ShipSelectModal />
		case 'planet_modal':
			return <PlanetoidSelectModal />
		default:
			return null;
	}
}