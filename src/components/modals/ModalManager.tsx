import { useUiStore } from '../../state/uiStore';
import FleetSelectModal from './FleetSelectModal';
import SystemSelectModal from './SystemSelectModal';
import OrgSelectModal from './OrgSelectModal';
import ShipSelectModal from './ShipSelectModal';
import PlanetoidSelectModal from './PlanetoidSelectModal';

import CharacterAssignModal from './assignment_modals/CharacterAssignModal';

import DiplomacyPanel from '../panels/DiplomacyPanel';
import PoliticsPanel from '../panels/PoliticsPanel';

export function ModalManager() {
	const activeModal = useUiStore(state => state.activeModal);
	const childAssignModal = useUiStore(state => state.childAssignModal);
	const activePanel = useUiStore(state => state.activePanel);

	let modal = null;

	switch(activeModal){
		case 'fleet_modal':
			modal = <FleetSelectModal/>; break;
		case 'system_modal':
			modal = <SystemSelectModal/>; break;
		case 'org_modal':
			modal = <OrgSelectModal/>; break;
		case 'ship_modal':
			modal = <ShipSelectModal/>; break;
		case 'planet_modal':
			modal = <PlanetoidSelectModal/>; break;
	}

	let assignModal = null;

	switch(childAssignModal){
		case 'assign_character':
			assignModal = <CharacterAssignModal/>; break;
	}

	let panel = null;

	switch(activePanel){
		case 'diplomacy_panel':
			panel = <DiplomacyPanel/>; break;
		case 'politics_panel':
			panel = <PoliticsPanel/>; break;
	}

	return(
		<div>
			{modal}
			{assignModal}
			{panel}
		</div>
	);
}
