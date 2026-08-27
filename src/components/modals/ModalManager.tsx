import { useUiStore } from '../../state/uiStore';
import FleetSelectModal from './FleetSelectModal';
import SystemSelectModal from './SystemSelectModal';
import OrgSelectModal from './OrgSelectModal';
import ShipSelectModal from './ShipSelectModal';
import PlanetoidSelectModal from './PlanetoidSelectModal';
import BuildingSelectModal from './BuildingSelectModal';
import PopsInfoModal from './PopsInfoModal';

import CharacterAssignModal from './assignment_modals/CharacterAssignModal';
import ResearchAssignModal from './assignment_modals/ResearchAssignModal';
import TradeAssignModal from './assignment_modals/TradeAssignModal';
import AnchorAssignModal from './assignment_modals/AnchorAssignModal';

import DiplomacyPanel from '../panels/DiplomacyPanel';
import PoliticsPanel from '../panels/PoliticsPanel';
import ResearchPanel from '../panels/ResearchPanel';
import HabitatAssignModal from './assignment_modals/HabitatAssignModal';
import StatusAssignModal from './assignment_modals/StatusAssignModal';

import styles from './Modal.module.css';

export function ModalManager() {
	const activeModal = useUiStore(state => state.activeModal);
	const closeModal = useUiStore(state => state.closeModal);
	const closeAssignModal = useUiStore(state => state.closeAssignModal);
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
		case 'building_modal':
			modal = <BuildingSelectModal/>; break;
		case 'pops_modal':
			modal = <PopsInfoModal/>; break;
	}

	let assignModal = null;

	switch(childAssignModal){
		case 'assign_character':
			assignModal = <CharacterAssignModal/>; break;
		case 'assign_research':
			assignModal = <ResearchAssignModal/>; break;
		case 'send_trade':
			assignModal = <TradeAssignModal/>; break;
		case 'assign_anchor':
			assignModal = <AnchorAssignModal/>; break;
		case 'assign_habitat':
			assignModal = <HabitatAssignModal/>; break;
		case 'assign_status':
			assignModal = <StatusAssignModal/>; break;
	}

	let panel = null;

	switch(activePanel){
		case 'diplomacy_panel':
			panel = <DiplomacyPanel/>; break;
		case 'politics_panel':
			panel = <PoliticsPanel/>; break;
		case 'research_panel':
			panel = <ResearchPanel/>; break;
	}

	if(!panel && !modal && !assignModal){
		return null;
	}

	return(
	 <div  className={styles.modalBackdrop} onClick={(e) => { console.log("Attempt modal close"); if (e.target === e.currentTarget) {closeAssignModal(); closeModal();}}}>
				{modal}
				{assignModal}
				{panel}
		</div>
	);
}
